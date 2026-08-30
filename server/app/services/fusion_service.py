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
        limit: int = 5
    ) -> List[Dict[str, Any]]:
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
                "distanceKm": None
            }

            row_lat = row.get("latitude")
            row_lon = row.get("longitude")
            if latitude is not None and longitude is not None and row_lat and row_lon:
                try:
                    lat_f = float(row_lat)
                    lon_f = float(row_lon)
                    item["distanceKm"] = haversine_distance_km(latitude, longitude, lat_f, lon_f)
                except (ValueError, TypeError):
                    pass

            results.append(item)

        return results

fusion_service = FusionService()
