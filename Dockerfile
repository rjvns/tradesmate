FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY backend/requirements.txt .
RUN pip install --no-cache-dir flask flask-cors gunicorn

# Copy simple app
COPY backend/simple_app.py .

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Create simple startup script
RUN echo '#!/bin/bash\necho "Starting TradesMate on port ${PORT:-8000}"\nexec gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 1 --timeout 30 simple_app:app' > start.sh && chmod +x start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 CMD curl -f http://localhost:${PORT:-8000}/ || exit 1

EXPOSE 8000
CMD ["./start.sh"]
