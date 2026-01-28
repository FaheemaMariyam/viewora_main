"""
RAG Creation Chain Module
-------------------------
This file acts as the "Manager" of the RAG pipeline.
It is responsible for:
1. Converting retrieved 'Document' objects into a single context string.
2. Passing the Context, Analytics, and User Question to the Generator.
3. Orchestrating the flow of data from retrieval to final answer generation.
"""
from app.rag.generator import generate_ai_answer


def run_rag_chain(docs, analytics: str, question: str) -> str:
    context = "\n\n".join(doc.page_content for doc in docs)
    return generate_ai_answer(context, analytics, question)

