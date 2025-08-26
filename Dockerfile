FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire backend directory
COPY backend/ ./backend/

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONPATH=/app/backend
ENV PORT=8000

# Create a simple startup script
RUN echo '#!/bin/bash\n\
cd /app/backend\n\
# Use the PORT variable provided by Railway, default to 8000\n\
APP_PORT=${PORT:-8000}\n\
echo "Starting TradesMate API on port $APP_PORT..."\n\
gunicorn --bind 0.0.0.0:$APP_PORT --workers 1 --timeout 120 --access-logfile - --error-logfile - src.main:app\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose the port (for documentation, Railway handles the actual port mapping)
EXPOSE 8000

# Remove the Docker healthcheck; we will rely on Railway's health checks
# HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
#  CMD curl -f http://localhost:8000/health || exit 1

# Start the application
CMD ["/app/start.sh"]
