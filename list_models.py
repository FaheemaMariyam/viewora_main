import os
import asyncio
from dotenv import load_dotenv
from google import genai

load_dotenv()

async def main():
    client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))
    print("Available Models:")
    async for model in client.models.list():
        print(f"Name: {model.name}, Display: {model.display_name}, Supported: {model.supported_generation_methods}")

if __name__ == "__main__":
    asyncio.run(main())
