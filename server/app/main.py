from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.config import settings
from app.services.rag_service import rag_service
from app.services.agent_service import civic_agent
from app.services.fusion_service import fusion_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Backend for Civic Intelligence, pgvector RAG, and MistralAI Agents",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

class QueryRequest(BaseModel):
    query: str
    district: Optional[str] = None
    limit: Optional[int] = 5

class AgentRequest(BaseModel):
    prompt: str

class FindRelatedRequest(BaseModel):
    report_id: Optional[str] = None
    text: str
    category: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    limit: Optional[int] = 5

@app.get("/")
def root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "embedding_model": settings.EMBEDDING_MODEL,
        "reasoning_model": settings.REASONING_MODEL
    }

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/api/v1/rag/search")
def vector_search(req: QueryRequest):
    results = rag_service.vector_search_problems(
        query_text=req.query,
        limit=req.limit or 5,
        district=req.district
    )
    return {"query": req.query, "results": results}

@app.post("/api/v1/rag/ask")
def rag_ask(req: QueryRequest):
    response = rag_service.answer_query_with_context(
        user_query=req.query,
        district=req.district
    )
    return response

@app.post("/api/v1/agent/chat")
def agent_chat(req: AgentRequest):
    result = civic_agent.run(req.prompt)
    return result

@app.post("/api/v1/fusion/find-related")
def find_related(req: FindRelatedRequest):
    results = fusion_service.find_related_reports(
        report_id=req.report_id,
        text=req.text,
        category=req.category,
        latitude=req.latitude,
        longitude=req.longitude,
        limit=req.limit or 5
    )
    return {"success": True, "results": results}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
