FROM python:3.11-slim

WORKDIR /app

# Install only essential dependencies
RUN pip install flask gunicorn

# Copy minimal app
COPY minimal_app.py .

# Simple command
CMD gunicorn --bind 0.0.0.0:$PORT --workers 1 minimal_app:app