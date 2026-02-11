# Viewora Project Hosting & Infrastructure Documentation

**Version:** 1.2
**Date:** 2026-02-11
**Status:** Official Documentation

---

## 1. Executive Summary

This document provides a comprehensive technical overview of the Viewora project's hosting infrastructure. The system is designed as a high-performance, scalable microservices architecture leveraging a hybrid cloud approach. It utilizes AWS for core backend computing and storage, Vercel for frontend global distribution, Supabase for managed database services, and a specialized Kubernetes (K3s) cluster for AI service scalability, with a unified EC2 deployment option.

---

## 2. Infrastructure Architecture Overview

The application is composed of three main layers:

### A. Frontend Layer (Vercel)
-   **Framework:** React (Vite)
-   **Hosting:** Vercel (Edge Network)
-   **Routing:** Client-side routing with `react-router-dom`.
-   **Integration:** Connects to the backend via REST APIs and WebSockets.
-   **Rewrites:** Configured (`vercel.json`) to proxy API requests (`/api/*`), static files (`/static/*`), and media (`/media/*`) to the backend server (`viewora.duckdns.org`) to resolve CORS and cookie issues.

### B. Backend & AI Layer (AWS EC2 + ECR)
-   **Deployment Strategy:** Docker Containerization with AWS ECR.
    *   **Repository 1:** `viewora-backend` (Django)
    *   **Repository 2:** `viewora-ai-service` (FastAPI)
-   **Compute:** Single AWS EC2 Instance (Ubuntu).
-   **Orchestration:** Docker Compose manages both the Backend and AI Service containers on the single instance for standard operation.
-   **Reverse Proxy:** Caddy (Automatic HTTPS Management).
-   **Task Queue:** Celery & Celery Beat (Background tasks).
-   **Broker:** Redis.

### C. Data & Storage Layer
-   **Primary Database:** Supabase (Managed PostgreSQL) via Transaction Pooler.
-   **Object Storage:** AWS S3 (Media & Static Files).
-   **NoSQL/Analytics:** AWS DynamoDB (Real-time Views & Interests).

### D. Enhanced AI Scalability Layer (K3s Cluster)
-   **Purpose:** High-load auto-scaling for the AI component.
-   **Orchestration:** K3s (Lightweight Kubernetes).
-   **Mechanism:** Horizontal Pod Autoscaler (HPA) scales AI pods based on CPU usage.

---

## 3. Detailed Service Configuration & Setup

### 3.1 Docker & ECR Deployment (The Core Hosting)

**Workflow:**
1.  **Container Registry (Amazon ECR):**
    *   Created two separate repositories in AWS ECR: `viewora-backend` and `viewora-ai-service`.
    *   Images are built locally and pushed to ECR.
2.  **EC2 Host:**
    *   The single EC2 instance pulls both images from ECR using IAM credentials.
    *   **Docker Compose:** The `docker-compose.prod.yml` defines the services (`backend`, `aiadvisor`, `celery`, etc.) and links them together on a custom bridge network.

**Key Configuration (`docker-compose.prod.yml`):**
```yaml
services:
  backend:
    image: [AWS_ACCOUNT_ID].dkr.ecr.[AWS_REGION].amazonaws.com/viewora-backend:latest
    env_file: .env
    depends_on: [postgres, redis, aiadvisor]

  aiadvisor:
    image: [AWS_ACCOUNT_ID].dkr.ecr.[AWS_REGION].amazonaws.com/viewora-ai-service:latest
    ports: ["8001:8001"]
    env_file: .env
```
*   **Integration:** The backend communicates with the AI service directly via the Docker network alias `aiadvisor` or `localhost:8001`.

### 3.2 Backend Configuration (Viewora_backend)

**Deployment Platform:** AWS EC2 (Dockerized)

**Key Components:**

1.  **Caddy Web Server (`Caddyfile`):**
    *   **Automatic SSL:** Manages Let's Encrypt certificates for `viewora.duckdns.org`.
    *   **Reverse Proxy:** Forwards requests to `backend:8000`.

2.  **Database (Supabase):**
    *   **Type:** Managed PostgreSQL on Supabase.
    *   **Connection:** Configured via the Supabase Transaction Pooler (Session mode) on port 5432 or 6543.
    *   **Django Settings:** `CONN_MAX_AGE = 0` to ensure compatibility with the transaction pooler. `SSLMODE = 'require'`.

### 3.3 AWS S3 Configuration (Object Storage)

**Purpose:** Hosts all user-uploaded media (Property Images, Property Videos) and static assets (CSS/JS) to offload the EC2 server and ensure fast delivery.

**Bucket Name:** `[YOUR_BUCKET_NAME]` (e.g., `viewora-property-videos`)
**Region:** `[AWS_REGION]` (e.g., `us-east-1`)

**Configuration:**
*   **Public Access:** Block Public Access settings configured to allow public read via Bucket Policy (or CloudFront).
*   **CORS Configuration:** Crucial for allowing uploads/reads from the Vercel frontend.
    ```json
    [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
            "AllowedOrigins": ["https://viewora-pi.vercel.app", "http://localhost:5173"],
            "ExposeHeaders": []
        }
    ]
    ```
*   **Django Integration (`settings.py`):**
    *   Uses `django-storages` and `boto3`.
    *   `AWS_S3_CUSTOM_DOMAIN`: Configured to serve files directly from S3 (e.g., `[BUCKET_NAME].s3.amazonaws.com`).
    *   `AWS_QUERYSTRING_AUTH = False`: Ensures URLs are clean and public without expiring signatures.

### 3.4 AWS DynamoDB Configuration (Real-Time Analytics)

**Purpose:** Stores high-velocity event data for property views and user interests to power the "Popularity" and "Trending" features in the AI Insights.

**Tables:**
1.  **Table Name:** `PropertyViewEvents`
    *   **Partition Key:** `property_id` (String) - Enables fast lookups of total views per property.
    *   **Sort Key:** `timestamp` (String) - Allows time-based queries (e.g., "views in the last 24h").
2.  **Table Name:** `PropertyInterestEvents`
    *   **Partition Key:** `property_id` (String)
    *   **Sort Key:** `timestamp` (String)

**Integration (`analytics/dynamo.py`):**
*   Uses `boto3` to perform `put_item` (record a view) and `query` (count views).
*   This NoSQL approach prevents the main PostgreSQL database from being bogged down by millions of improved view-count updates.

---

## 4. Problems Faced & Solutions

### Problem 1: Cross-Site Cookie Blocking on iOS (Safari/Chrome)
**Issue:** Authentication cookies (JWT) were blocked by Safari's Intelligent Tracking Prevention (ITP) when the frontend (Vercel) and backend (AWS) were on different domains.
**Solution:**
1.  **Samesite=None:** Configured Django settings to allow cross-site usage.
2.  **Vercel Rewrites:** Proxying requests via Vercel makes them appear as same-origin, improving cookie acceptance.

### Problem 2: S3 Video Upload Reliability
**Issue:** Large video files failed to upload directly to EC2 due to timeouts and storage limits.
**Solution:**
1.  **Direct S3 Upload:** Configured Django to stream uploads directly to S3 using `django-storages`.
2.  **Multipart Upload:** Enabled S3 transfer acceleration (if applicable) or standard multipart uploads for stability.

### Problem 3: Database Connection Limits
**Issue:** Direct connections to Postgres exhausted the max connection limit during high concurrency.
**Solution:**
1.  **Supabase Transaction Pooler:** Switched from direct DB connection to Supabase's built-in transaction pooler.
2.  **Django Optimization:** Set `CONN_MAX_AGE = 0` to prevent persistent connections from hogging the pool.

---

## 5. Deployment Commands & Operations

### Deployment Pipeline (ECR -> EC2)

*> **Note:** Replace `[AWS_ACCOUNT_ID]` and `[AWS_REGION]` with your actual credentials.*

1.  **Login to ECR (Local):**
    ```bash
    aws ecr get-login-password --region [AWS_REGION] | docker login --username AWS --password-stdin [AWS_ACCOUNT_ID].dkr.ecr.[AWS_REGION].amazonaws.com
    ```
2.  **Build & Push Images:**
    ```bash
    # Backend
    docker build -t viewora-backend ./Viewora_backend
    docker tag viewora-backend:latest [AWS_ACCOUNT_ID].dkr.ecr.[AWS_REGION].amazonaws.com/viewora-backend:latest
    docker push [AWS_ACCOUNT_ID].dkr.ecr.[AWS_REGION].amazonaws.com/viewora-backend:latest

    # AI Service
    docker build -t viewora-ai-service ./Viewora_ai_service
    docker tag viewora-ai-service:latest [AWS_ACCOUNT_ID].dkr.ecr.[AWS_REGION].amazonaws.com/viewora-ai-service:latest
    docker push [AWS_ACCOUNT_ID].dkr.ecr.[AWS_REGION].amazonaws.com/viewora-ai-service:latest
    ```
3.  **Deploy on EC2:**
    ```bash
    # Pull latest images
    docker-compose -f docker-compose.prod.yml pull
    # Restart services
    docker-compose -f docker-compose.prod.yml up -d
    ```

### Database Management
*   **Migrate:** `docker-compose -f docker-compose.prod.yml exec backend python manage.py migrate`

---

## 6. External Services Integration

| Service | Purpose | Configuration Location |
| :--- | :--- | :--- |
| **Supabase** | Primary Database (PostgreSQL) | `.env` (DB_HOST, DB_USER via Pooler) |
| **AWS ECR** | Container Registry (Backend & AI Images) | `docker-compose.prod.yml` |
| **AWS EC2** | Compute Host (runs Docker Compose) | Infrastructure |
| **AWS S3** | Object Storage (Media/Static) | `settings.py`, `.env` |
| **AWS DynamoDB** | Real-time Analytics (Views/Interests) | `analytics/dynamo.py` |
| **Google Gemini** | LLM for AI Recommendations | `.env` (GOOGLE_API_KEY) |
| **Redis** | Broker for Celery & WebSockets | `docker-compose.yml`, `.env` |

---

**End of Documentation**
*Maintained by Viewora Engineering Team*
