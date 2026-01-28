
"""
AI Response Generation Module
-----------------------------
This file handles the "Generation" phase of the RAG pipeline.
It is responsible for:
1. Connecting to the Google Gemini API (LLM).
2. Defining the system persona ("Real Estate Advisor") and safety rules.
3. Constructing the final prompt that combines User Query + Retrieved Properties + Analytics.
4. Returning the natural language answer to the user.
"""
import os
from dotenv import load_dotenv
from google import genai #gemini
from google.genai import errors

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GOOGLE_API_KEY")
)

def generate_ai_answer(context: str, analytics: str, question: str) -> str:
    prompt = f"""
You are a highly professional and helpful real estate advisor for Viewora. Your goal is to interact with potential buyers, answering their doubts and providing realistic market insights.

Persona:
- You are warm, knowledgeable, and professional.
- You treat the user as a valued client looking for their next home or investment.
- You provide clear, concise, and honest advice.

Context (Available Properties):
{context}

Analytics (Real-time Trends):
{analytics}

User Question:
{question}

STRICT OPERATIONAL RULES:
1. NEVER mention "Property ID", "ID 123", or any raw numeric identifiers in your conversation.
2. Refer to properties by their specific locality or distinguishing features (e.g., "The spacious 3BHK in Palakkad").
3. Do NOT guarantee profits; use professional, cautious language.
4. You MUST include property references at the VERY end for the UI to handle, in this EXACT format:
   REFERENCES: [id1, id2]

Focus on building trust and helping the client navigate their real estate journey.
"""

    try:
        response = client.models.generate_content(
            model="models/gemini-flash-latest",
            contents=prompt
        )
        return response.text.strip() if response.text else "The AI advisor is currently pondering. Please try a different question."
    except errors.ClientError as e:
        if "429" in str(e):
            return "I'm sorry, I've reached my daily limit for real-time insights. Please try again in a little while, or contact our support for urgent inquiries."
        return f"I'm having trouble accessing my knowledge base: {str(e)}"
    except Exception as e:
        return "I encountered an unexpected glitch while researching your request. Please try again in a moment."
