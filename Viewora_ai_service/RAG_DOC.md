RAG
---


1. What is RAG? (Retrieval-Augmented Generation)
-RAG (Retrieval-Augmented Generation) is an AI framework that optimizes the output of a Large Language Model (LLM) by referencing an authoritative knowledge base outside of its training data before generating a response.

Why it is used:

.Accuracy: Reduces hallucinations by grounding answers in real data.
.Up-to-Date Info: LLMs have a training cutoff; RAG allows them to access live data (like current property listings) without retraining.
.Context: Provides specific, private, or domain-specific data that the generic model doesn't know.

2. Relevance in Viewora Project
In Viewora, we use RAG to power the AI Area Insights and Smart Search features.

.Users can ask natural language questions like "Find me a 3BHK in Palakkad under 50 Lakhs" or "What are the investment trends in Kochi?"
.Instead of a generic answer, Viewora's AI:
-Retrieves actual property listings from your Postgres database that match the query.
-Augments this with real-time analytics (views/interest counts) from DynamoDB.
-Generates a professional, advisor-like response using Google Gemini, citing specific properties available on your platform.

3. Key AI Features in Viewora
-Semantic Search: Users don't need exact keywords. "Spacious home for family" will find properties with high square footage or many bedrooms.
-Context-Aware Advice: The AI acts as a real estate consultant, analyzing property features against user needs.
-Real-Time Analytics Integration: The AI knows which properties are "hot" (high views/interests) and uses this to recommend listings.
-Privacy-First: Returns sanitized references (IDs) for the UI to render cards, without exposing raw database IDs in the text.

4. A-Z Implementation Guide
The implementation follows a standard RAG pipeline: Ingest -> Embed -> Store -> Retrieve -> Generate.

Directory Structure & File Roles
Location: Viewora_ai_service/app/

A. Data Ingestion & Indexing
File: main.py

Role: The entry point and orchestrator.
Functionality:
Connects to the PostgreSQL database.
Fetches "published" and "active" properties.
Converts raw DB rows into text "Documents" using rag/documents.py.
Creates the Vector Store on startup (startup_event) or manual trigger (/ai/sync).
File: rag/documents.py

Role: Data Formatter.
Functionality: Takes a property dictionary (price, city, amenities) and formats it into a descriptive string (e.g., "Property Type: Flat, City: Palakkad..."). This text is what the AI "reads".

B. Embedding Generation
File: rag/embeddings.py

Role: The Translator (Text to Numbers).
Functionality:
Uses sentence-transformers/all-MiniLM-L6-v2 (via HuggingFace).
Converts the descriptive text from documents.py into a vector (a list of numbers) that represents the semantic meaning of the property.

C. Vector Storage
File: rag/vector_store.py

Role: The Brain's Memory.
Functionality:
Uses FAISS (Facebook AI Similarity Search).
Stores the vectors generated above. allows for extremely fast "similarity search" to find properties matching a user's query vector.

D. Retrieval System
File: rag/retriever.py

Role: The Librarian.
Functionality:
Configuration for how we fetch data.
Implements a "similarity" search to return the top k=5 most relevant properties for a given user question.

E. Augmented Generation (The "AG" in RAG)
File: rag/chain.py

Role: The Manager.
Functionality:
Combines everything. It takes the retrieved documents, the analytics data, and the user's question, and passes them to the generator.
File: rag/generator.py

Role: The Speaker (LLM).
Functionality:
Uses Google Gemini 1.5 Flash (via google-genai SDK).
Contains the System Prompt that defines the "Real Estate Advisor" persona.
Enforces rules: "Be professional", "Don't promise profits", "Cite references".
Returns the final natural language answer.

F. Analytics Layer
File: analytics/dynamo.py

Role: The Market Analyst.
Functionality:
Connects to AWS DynamoDB.
Fetches real-time PropertyViewEvents and PropertyInterestEvents.
Summarizes this data (e.g., "Property X has 50 views") so the AI can say "This property is currently very popular."

G. API Layer
File: api/v1/area_insights.py

Role: The Interface.
Functionality:
Defines the FastAPI route POST /ai/area-insights.
Receives the user's question.
Calls the Retriever -> Analytics -> Chain.
Returns a JSON response containing the AI Answer and the Property Source Metadata (so the frontend can display cards).

5. Information Flow Summary
-User asks: "Show me popular flats in Kochi."
-API (area_insights.py) receives the request.
-Retriever (retriever.py) searches FAISS (vector_store.py) for "flats in Kochi" and finds the top 5 matches.
-Analytics (dynamo.py) checks DynamoDB for view/interest counts on those 5 properties.
-Generator (generator.py) gets a prompt:
-"You are an advisor."
-"Here are 5 flats in Kochi..."
"Here is their popularity data..."
"Answer the user: Show me popular flats in Kochi."
Gemini generates a response: "I found a highly viewed flat in Kochi..."
Frontend receives the text and property IDs to render the UI.
