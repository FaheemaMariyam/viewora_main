"""
Vector Storage Module
---------------------
This file manages the "Memory" of the AI system.
It is responsible for:
1. Initializing the FAISS (Facebook AI Similarity Search) index.
2. Storing the generated document embeddings for fast retrieval.

This allows the application to search through thousands of properties in milliseconds.
"""


from langchain_community.vectorstores import FAISS


def create_vector_store(documents, embeddings):
    return FAISS.from_documents(documents, embeddings)
