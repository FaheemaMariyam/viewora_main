"""
Document Formatting Module
--------------------------
This file handles the "Ingestion" phase of the RAG pipeline.
It is responsible for:
1. converting raw property dictionaries (from the database) into structured text strings.
2. Creating LangChain 'Document' objects that include metadata (ID, city, type).

These text documents are what the AI "reads" and embeds to understand the property inventory.
"""
from langchain_community.docstore.document import Document

def property_to_document(property_data: dict) -> Document:
    content = f"""
    Property Type: {property_data.get('type')}
    City: {property_data.get('city')}
    Locality: {property_data.get('locality')}
    Price Range: {property_data.get('price_range')}
    Area Size: {property_data.get('area_size')}
    Amenities: {', '.join(property_data.get('amenities', []))}
    """

    return Document(
        page_content=content.strip(),
        metadata={
            "property_id": property_data.get("id"),
            "city": property_data.get("city"),
            "locality": property_data.get("locality"),
            "type": property_data.get("type"),
        }
    )
