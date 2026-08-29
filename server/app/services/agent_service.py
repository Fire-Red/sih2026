from typing import List, Dict, Any, Optional
from langchain_core.tools import tool
from langchain_mistralai import ChatMistralAI
from app.services.rag_service import rag_service
from app.core.ai_provider import get_llm

@tool
def search_similar_civic_problems(query: str, district: Optional[str] = None) -> List[Dict[str, Any]]:
    """Searches the vector database for civic and societal problems semantically similar to the query."""
    return rag_service.vector_search_problems(query_text=query, limit=5, district=district)

@tool
def decompose_problem_capabilities(problem_title: str, problem_description: str) -> Dict[str, Any]:
    """Decomposes a societal problem into required technical and domain capabilities."""
    llm = get_llm(temperature=0.1)
    prompt = f"""
    Analyze the following societal problem and output a structured capability breakdown:
    Title: {problem_title}
    Description: {problem_description}
    
    Return:
    1. Primary Domain
    2. Required Technical Capabilities (e.g. IoT Sensor Deployment, Water Quality Testing, Civil Drainage Design)
    3. Recommended Stakeholders (Universities, Labs, Startups, Government Depts)
    """
    response = llm.invoke(prompt)
    return {"analysis": response.content}

class CivicAgent:
    def __init__(self):
        self.llm = get_llm()
        self.tools = [search_similar_civic_problems, decompose_problem_capabilities]
        self.llm_with_tools = self.llm.bind_tools(self.tools)

    def run(self, user_prompt: str) -> Dict[str, Any]:
        try:
            response = self.llm_with_tools.invoke(user_prompt)
            return {
                "content": response.content,
                "tool_calls": getattr(response, "tool_calls", [])
            }
        except Exception as e:
            return {"error": str(e), "fallback": f"Agent error: {str(e)}"}

civic_agent = CivicAgent()
