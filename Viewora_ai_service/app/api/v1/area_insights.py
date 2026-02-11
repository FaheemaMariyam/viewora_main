"""
AI Service API Endpoints
This file interfaces the RAG logic with the external world via HTTP.
It is responsible for:
1. Defining the /ai/area-insights POST endpoint.
2. receiving user queries.
3. Invoking the RAG pipeline (Retriever -> Analytics -> Generator).
4. Returning the final JSON response containing both the text answer and structured source references.
"""
from fastapi import APIRouter, Request
from pydantic import BaseModel
from fastapi.responses import JSONResponse

from app.rag.retriever import get_retriever
from app.rag.chain import run_rag_chain
from app.analytics.dynamo import get_property_analytics

router = APIRouter()


class AreaInsightRequest(BaseModel):
    question: str


@router.post("/area-insights")
def area_insights(request: Request, payload: AreaInsightRequest):
    #  READ FROM FASTAPI APP STATE
    vector_store = getattr(request.app.state, "vector_store", None)

    if vector_store is None:
        return JSONResponse(
            status_code=503,
            content={"error": "RAG vector store not initialized"},
        )

    try:
        retriever = get_retriever(vector_store)
        docs = retriever.invoke(payload.question)

        sources = [
            doc.metadata
            for doc in docs
            if doc.metadata
        ]

        analytics = get_property_analytics(sources)

        answer = run_rag_chain(docs, analytics, payload.question)

        return {
            "answer": answer,
            "sources": [doc.metadata for doc in docs],
        }
    except Exception as e:
        print(f"RAG Error: {e}")
        return JSONResponse(
            status_code=503,
            content={"error": "AI Service unable to process request", "detail": str(e)},
        )
