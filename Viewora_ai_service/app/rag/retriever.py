"""
Retrieval Logic Module
----------------------
This file defines how the system finds relevant information.
It is responsible for:
1. Configuring the retriever interface for the vector store.
2. Setting search parameters (e.g., k=5) to determine how many relevant properties to fetch for each user query.
"""

def get_retriever(vector_store, k: int = 5):
    return vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": k},
    )
