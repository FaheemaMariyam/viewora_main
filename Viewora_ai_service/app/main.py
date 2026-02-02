"""
Main Application Entry Point
----------------------------
This file serves as the core orchestrator for the Viewora AI Service.
It is responsible for:
1. Initializing the FastAPI application.
2. Managing the PostgreSQL database connection to fetch property data.
3. Orchestrating the RAG (Retrieval-Augmented Generation) indexing process.
4. Managing the application lifecycle (startup events) and global state (Vector Store).
"""
import threading
from datetime import datetime

# Import components
from app.rag.documents import property_to_document
from app.rag.embeddings import get_embeddings
from app.rag.vector_store import create_vector_store
from app.api.v1.area_insights import router as area_router

# Force load environment
load_dotenv()

app = FastAPI(title="Viewora AI Service")

# This will hold our vector store and diagnostic info
app.state.vector_store = None
app.state.last_error = "None - Indexing not started"
app.state.is_indexing = False
app.state.last_sync = None

def rebuild_index():
    """
    Connects to Postgres, fetches latest published properties,
    and rebuilds the FAISS vector index.
    """
    if app.state.is_indexing:
        print(" SKIPPING: Indexing already in progress.")
        return
    
    app.state.is_indexing = True
    print(" REBUILDING AI INDEX: Fetching latest properties from Postgres...")
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME", "viewora_db"),
            user=os.getenv("DB_USER", "postgres"),
            password=os.getenv("DB_PASSWORD", "root"),
            host=os.getenv("DB_HOST", "postgres"),
            port=os.getenv("DB_PORT", "5432"),
            sslmode="require",
            cursor_factory=RealDictCursor
        )
        cur = conn.cursor()
        
        # Load real data
        query = """
            SELECT id, property_type as type, city, locality, price, 
                   area_size, area_unit, bedrooms, bathrooms, description
            FROM properties_property 
            WHERE status = 'published' AND is_active = true
        """
        cur.execute(query)
        rows = cur.fetchall()
        
        cur.close()
        conn.close()
        
        properties = []
        for row in rows:
            properties.append({
                "id": row['id'],
                "type": row['type'],
                "city": row['city'],
                "locality": row['locality'],
                "price_range": f"{row['price']} INR",
                "area_size": f"{row['area_size']} {row['area_unit']}",
                "amenities": [f"{row['bedrooms']} BHK"] if row['bedrooms'] else []
            })
            
        if properties:
            print(f" Success: Found {len(properties)} properties. Re-indexing...")
            docs = [property_to_document(p) for p in properties]
            embeddings = get_embeddings()
            app.state.vector_store = create_vector_store(docs, embeddings)
            app.state.last_error = "None - Indexing successful"
            app.state.last_sync = datetime.now().isoformat()
            print(" AI Index is currently SYNCED and READY.")
            return len(properties)
        else:
            print(" No properties found. AI context cleared.")
            app.state.vector_store = None
            app.state.last_error = "None - Zero properties found in DB"
            return 0

    except Exception as e:
        app.state.last_error = f"REBUILD ERROR: {str(e)}"
        print(f"REBUILD ERROR: {e}")
        # Don't raise in thread, just log
    finally:
        app.state.is_indexing = False

@app.on_event("startup")
def startup_event():
    print(" AI SERVICE STARTING (Asynchronous Mode)...")
    # Start indexing in background so health check passes immediately
    thread = threading.Thread(target=rebuild_index)
    thread.daemon = True
    thread.start()

@app.post("/ai/sync")
def sync_data():
    """
    Manual trigger to refresh property data
    """
    # Start in background if not already running
    if not app.state.is_indexing:
        thread = threading.Thread(target=rebuild_index)
        thread.daemon = True
        thread.start()
        return {"status": "sync_started"}
    return {"status": "sync_in_progress"}

@app.get("/health")
def health():
    return {
        "status": "up", 
        "rag_ready": app.state.vector_store is not None,
        "is_indexing": app.state.is_indexing,
        "last_sync": app.state.last_sync,
        "last_error": app.state.last_error
    }

# Register the AI route
app.include_router(area_router, prefix="/ai")
