FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ ./backend/

# Set environment variables
ENV FLASK_ENV=production
ENV PYTHONPATH=/app/backend

# Expose port
EXPOSE $PORT

# Run the application
CMD cd backend && python -m gunicorn --bind 0.0.0.0:$PORT src.main:app
