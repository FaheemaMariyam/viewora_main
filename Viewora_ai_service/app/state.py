"""
Global application state for AI service.
Used to store shared objects like vector store.
"""

from typing import Optional
from langchain_community.vectorstores import FAISS

# This will be populated at FastAPI startup
vector_store: Optional[FAISS] = None
