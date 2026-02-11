"""
Embedding Generation Module
---------------------------
This file handles the "Translation" phase of the RAG pipeline.
It is responsible for:
1. Loading the pre-trained sentence-transformer model (all-MiniLM-L6-v2).
2. Converting the text "Documents" into numerical vectors (embeddings).

These embeddings allow the system to perform semantic similarity searches (e.g., matching "cozy home" to a property description).
"""


import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings


def get_embeddings():
    """
    Returns high-speed cloud-based embeddings using Google Gemini.
    This replaces local torch-based embeddings to save CPU and RAM.
    """
    return GoogleGenerativeAIEmbeddings(
        model="models/embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
