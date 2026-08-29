from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.config import settings
from app.services.rag_service import rag_service
from app.services.agent_service import civic_agent

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="FastAPI Backend for Civic Intelligence, pgvector RAG, and MistralAI Agents",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str
    district: Optional[str] = None
    limit: Optional[int] = 5

class AgentRequest(BaseModel):
    prompt: str

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
