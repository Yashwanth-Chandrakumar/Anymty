# Set the base image to the official Python image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements.txt file into the container
COPY requirements.txt /app/

# Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy the entire Django project into the container
COPY . /app/

# Expose port 8000 for the application
EXPOSE 8000

# Use Gunicorn to run the Django application
CMD ["gunicorn", "anymty.wsgi:application", "--bind", "0.0.0.0:8000"]
