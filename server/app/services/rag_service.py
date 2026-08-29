from typing import List, Dict, Any, Optional
from app.db.connection import get_db_connection
from app.core.ai_provider import get_embeddings_model, get_llm
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

class RAGService:
    def __init__(self):
        self.embeddings = get_embeddings_model()
        self.llm = get_llm()

    def generate_embedding(self, text: str) -> List[float]:
        return self.embeddings.embed_query(text)

    def vector_search_problems(self, query_text: str, limit: int = 5, district: Optional[str] = None) -> List[Dict[str, Any]]:
        query_vector = self.generate_embedding(query_text)
        
        sql = """
            SELECT 
                pr.id,
                pr.title,
                pr.description,
                pr.category,
                pr.district,
                pr.severity,
                1 - (pe.embedding <=> %s::vector) AS similarity
            FROM problem_embeddings pe
            JOIN problem_reports pr ON pe.problem_report_id = pr.id
            WHERE 1=1
        """
        params: list = [query_vector]
        
        if district:
            sql += " AND pr.district = %s"
            params.append(district)
            
        sql += " ORDER BY pe.embedding <=> %s::vector ASC LIMIT %s;"
        params.extend([query_vector, limit])
        
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(sql, params)
                    results = cur.fetchall()
                    return results
        except Exception as e:
            return [{"error": f"Database search failed: {str(e)}"}]

    def answer_query_with_context(self, user_query: str, district: Optional[str] = None) -> Dict[str, Any]:
        context_records = self.vector_search_problems(user_query, limit=5, district=district)
        
        formatted_context = ""
        for i, item in enumerate(context_records, 1):
            if "error" in item:
                continue
            formatted_context += (
                f"[{i}] Title: {item.get('title')}\n"
                f"Category: {item.get('category')}, District: {item.get('district')}, Severity: {item.get('severity')}\n"
                f"Description: {item.get('description')}\n\n"
            )
            
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are the Civic Intelligence Agent. Answer the citizen or government query truthfully and concisely based on retrieved civic context. Do not fabricate records or impact data. If no context matches, explain clearly."),
            ("human", "Civic Problem Context:\n{context}\n\nUser Question: {query}")
        ])
        
        chain = prompt | self.llm | StrOutputParser()
        
        try:
            response_text = chain.invoke({"context": formatted_context if formatted_context else "No problem records found in database.", "query": user_query})
        except Exception as e:
            response_text = f"AI reasoning fallback (check MISTRAL_API_KEY): {str(e)}"
            
        return {
            "query": user_query,
            "context_records": context_records,
            "answer": response_text
        }

rag_service = RAGService()
