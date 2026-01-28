"""
Embedding Generation Module
---------------------------
This file handles the "Translation" phase of the RAG pipeline.
It is responsible for:
1. Loading the pre-trained sentence-transformer model (all-MiniLM-L6-v2).
2. Converting the text "Documents" into numerical vectors (embeddings).

These embeddings allow the system to perform semantic similarity searches (e.g., matching "cozy home" to a property description).
"""


from langchain_community.embeddings import HuggingFaceEmbeddings


def get_embeddings():
    return HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )
