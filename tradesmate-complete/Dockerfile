FROM python:3.11-slim

# Set working directory
WORKDIR /app
# Build timestamp: 2025-01-27 - Production Deploy

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY backend/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory
COPY backend/ ./backend/

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONPATH=/app/backend

# Create a simple startup script that uses Railway's PORT variable
RUN echo '#!/bin/bash\n\
cd /app/backend\n\
# Railway provides PORT environment variable\n\
echo "Starting TradesMate API on port ${PORT:-8000}..."\n\
echo "Environment: $FLASK_ENV"\n\
echo "Python path: $PYTHONPATH"\n\
exec gunicorn --bind 0.0.0.0:${PORT:-8000} --workers 1 --timeout 120 --access-logfile - --error-logfile - "src.main:create_app()"\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose the port (for documentation, Railway handles the actual port mapping)
EXPOSE 8000

# Remove the Docker healthcheck; we will rely on Railway's health checks
# HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
#  CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["/app/start.sh"]

