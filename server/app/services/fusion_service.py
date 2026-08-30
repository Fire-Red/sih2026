import logging
import math
from typing import List, Dict, Any, Optional
from app.db.connection import get_db_connection
from app.core.ai_provider import get_embeddings_model, get_llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

logger = logging.getLogger(__name__)

SIMILARITY_THRESHOLD = 0.60

def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

class FusionService:
    def __init__(self):
        self.embeddings = get_embeddings_model()
        self.llm = get_llm()

    def find_related_reports(
        self,
        report_id: Optional[str],
        text: str,
        category: Optional[str] = None,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None,
        limit: int = 5,
        query_vector: Optional[List[float]] = None,
    ) -> List[Dict[str, Any]]:
        if query_vector is None:
            try:
                query_vector = self.embeddings.embed_query(text)
            except Exception as e:
                logger.error("Embedding generation error in FusionService: %s", str(e), exc_info=True)
                return []

        sql = """
            SELECT 
                pr.id,
                pr.title,
                pr.description,
                pr.category,
                pr.district,
                pr.block_or_panchayat,
                pr.severity,
                pr.latitude,
                pr.longitude,
                pr.status,
                pr.similar_review_mode,
                pr.created_at,
                1 - (pe.embedding <=> %s::vector) AS similarity
            FROM problem_embeddings pe
            JOIN problem_reports pr ON pe.problem_report_id = pr.id
            WHERE 1=1
        """
        params: list = [query_vector]

        if report_id:
            sql += " AND pr.id != %s::uuid"
            params.append(report_id)

        if category:
            sql += " AND pr.category = %s"
            params.append(category)

        sql += " ORDER BY pe.embedding <=> %s::vector ASC LIMIT %s;"
        params.extend([query_vector, limit])

        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, params)
                    records = cur.fetchall()
        except Exception as e:
            logger.error("Database lookup error in FusionService: %s", str(e), exc_info=True)
            return []

        results: List[Dict[str, Any]] = []
        for row in records:
            sim = float(row.get("similarity", 0))
            if sim < SIMILARITY_THRESHOLD:
                continue

            item: Dict[str, Any] = {
                "id": str(row.get("id")),
                "title": row.get("title"),
                "description": row.get("description"),
                "category": row.get("category"),
                "district": row.get("district"),
                "blockOrPanchayat": row.get("block_or_panchayat"),
                "severity": row.get("severity"),
                "status": row.get("status"),
                "similarity": round(sim, 3),
                "distanceKm": None,
                "createdAt": row.get("created_at").isoformat() if row.get("created_at") else None,
            }

            row_lat = row.get("latitude")
            row_lon = row.get("longitude")
            if latitude is not None and longitude is not None and row_lat is not None and row_lon is not None:
                try:
                    lat_f = float(row_lat)
                    lon_f = float(row_lon)
                    item["distanceKm"] = haversine_distance_km(latitude, longitude, lat_f, lon_f)
                except (ValueError, TypeError):
                    pass

            if item["distanceKm"] is not None and item["distanceKm"] > 20:
                continue

            similarity = float(item["similarity"])
            distance = item["distanceKm"]
            item["confidenceLevel"] = "high" if similarity >= 0.85 and distance is not None and distance <= 20 else "medium" if similarity >= 0.70 else "low"
            item["reviewMode"] = row.get("similar_review_mode") or "manual_review"

            results.append(item)

        return results

    def process_report(
        self,
        report_id: str,
        text: str,
        category: Optional[str],
        latitude: Optional[float],
        longitude: Optional[float],
    ) -> List[Dict[str, Any]]:
        vector = self.embeddings.embed_query(text)
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO problem_embeddings (problem_report_id, embedding, model_name, updated_at)
                    VALUES (%s::uuid, %s, %s, now())
                    ON CONFLICT (problem_report_id) DO UPDATE SET embedding = EXCLUDED.embedding, updated_at = now()
                    """,
                    (report_id, vector, "mistral-embed"),
                )
                conn.commit()
        matches = self.find_related_reports(report_id, text, category, latitude, longitude, 10, vector)
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                for match in matches:
                    distance = match.get("distanceKm")
                    similarity = float(match.get("similarity", 0))
                    high_confidence = similarity >= 0.85 and distance is not None and distance <= 20
                    confidence = "high" if high_confidence else "medium" if similarity >= 0.70 else "low"
                    relationship = "same_systemic_problem" if high_confidence else "related_review"
                    cur.execute(
                        """
                        INSERT INTO problem_relationships
                          (report_id, related_report_id, semantic_similarity, geographic_distance_km, relationship_type, confidence_level)
                        VALUES (%s::uuid, %s::uuid, %s, %s, %s, %s)
                        ON CONFLICT (report_id, related_report_id) DO UPDATE SET
                          semantic_similarity = EXCLUDED.semantic_similarity,
                          geographic_distance_km = EXCLUDED.geographic_distance_km,
                          relationship_type = EXCLUDED.relationship_type,
                          confidence_level = EXCLUDED.confidence_level,
                          created_at = now()
                        """,
                        (report_id, match["id"], str(similarity), str(distance) if distance is not None else None, relationship, confidence),
                    )
                conn.commit()
        return matches

fusion_service = FusionService()
