FROM python:3.11-slim

# Prevents Python from creating .pyc files
ENV PYTHONDONTWRITEBYTECODE=1
# Makes logs appear immediately in terminal
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies for PostgreSQL and building packages
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

EXPOSE 8000

# Default command (will be overridden by docker-compose in production)
CMD ["gunicorn", "viewora_project.wsgi:application", "--bind", "0.0.0.0:8000"]
