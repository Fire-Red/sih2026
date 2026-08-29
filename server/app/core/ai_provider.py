from typing import List
from langchain_mistralai import MistralAIEmbeddings, ChatMistralAI
from app.config import settings

def get_embeddings_model() -> MistralAIEmbeddings:
    return MistralAIEmbeddings(
        model=settings.EMBEDDING_MODEL,
        mistral_api_key=settings.MISTRAL_API_KEY if settings.MISTRAL_API_KEY else "dummy_key"
    )

def get_llm(temperature: float = 0.2) -> ChatMistralAI:
    return ChatMistralAI(
        model=settings.REASONING_MODEL,
        temperature=temperature,
        mistral_api_key=settings.MISTRAL_API_KEY if settings.MISTRAL_API_KEY else "dummy_key"
    )
