from typing import List, Dict, Any, Optional
import json
from langchain_core.tools import tool
from langchain_core.messages import HumanMessage, ToolMessage
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
        self.tool_map = {t.name: t for t in self.tools}
        self.llm_with_tools = self.llm.bind_tools(self.tools)

    def run(self, user_prompt: str) -> Dict[str, Any]:
        try:
            messages = [HumanMessage(content=user_prompt)]
            response = self.llm_with_tools.invoke(messages)
            tool_calls = getattr(response, "tool_calls", [])

            if tool_calls:
                messages.append(response)
                for tc in tool_calls:
                    tool_name = tc.get("name")
                    tool_args = tc.get("args", {})
                    tool_id = tc.get("id")

                    selected_tool = self.tool_map.get(tool_name)
                    if selected_tool:
                        tool_output = selected_tool.invoke(tool_args)
                    else:
                        tool_output = {"error": f"Tool '{tool_name}' not found."}

                    content_str = json.dumps(tool_output) if not isinstance(tool_output, str) else tool_output
                    messages.append(
                        ToolMessage(
                            content=content_str,
                            tool_call_id=tool_id or tool_name,
                        )
                    )

                final_response = self.llm_with_tools.invoke(messages)
                return {
                    "content": final_response.content,
                    "tool_calls": tool_calls,
                }

            return {
                "content": response.content,
                "tool_calls": [],
            }
        except Exception as e:
            return {"error": str(e), "fallback": f"Agent error: {str(e)}"}

civic_agent = CivicAgent()
