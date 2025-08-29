# Multi-stage build for smaller production image
FROM python:3.11-slim as builder

# Install system dependencies for building
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Copy and install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Production stage
FROM python:3.11-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libpq5 \
    tesseract-ocr \
    tesseract-ocr-eng \
    libgl1-mesa-dri \
    libglib2.0-0 \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy virtual environment from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Set working directory
WORKDIR /app

# Copy application code
COPY backend/ ./backend/

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONPATH=/app/backend
ENV PYTHONUNBUFFERED=1

# Create non-root user for security
RUN useradd --create-home --shell /bin/bash app
RUN chown -R app:app /app
USER app

# Create optimized startup script
RUN echo '#!/bin/bash\n\
cd /app/backend\n\
echo "=== TradesMate API Production Startup ==="\n\
echo "Port: ${PORT:-8000}"\n\
echo "Environment: $FLASK_ENV"\n\
echo "Python path: $PYTHONPATH"\n\
echo "Starting gunicorn with optimized settings..."\n\
exec gunicorn --bind 0.0.0.0:${PORT:-8000} \\\n\
    --workers 2 \\\n\
    --worker-class gevent \\\n\
    --worker-connections 1000 \\\n\
    --timeout 120 \\\n\
    --keepalive 5 \\\n\
    --max-requests 1000 \\\n\
    --max-requests-jitter 100 \\\n\
    --access-logfile - \\\n\
    --error-logfile - \\\n\
    --log-level info \\\n\
    "src.main:create_app"\n\
' > /app/start.sh && chmod +x /app/start.sh

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

EXPOSE 8000
CMD ["/app/start.sh"]

