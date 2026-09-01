#!/bin/bash

# Function to print messages
print_message() {
    echo "==> $1"
}

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
print_message "Checking prerequisites..."

# Check Python
if ! command_exists python3; then
    print_message "Python 3 is not installed. Please install Python 3 and try again."
    exit 1
fi

# Check Node.js
if ! command_exists node; then
    print_message "Node.js is not installed. Please install Node.js and try again."
    exit 1
fi

# Check MySQL
if ! command_exists mysql; then
    print_message "MySQL is not installed. Please install MySQL and try again."
    exit 1
fi

# Set up backend
print_message "Setting up backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_message "Created .env file. Please update it with your database credentials."
fi

# Run migrations
python manage.py migrate

# Create initial data
python manage.py create_initial_data

# Deactivate virtual environment
deactivate

# Set up frontend
print_message "Setting up frontend..."
cd ../frontend

# Install Node.js dependencies
npm install

print_message "Setup complete!"
print_message "To start the backend server:"
print_message "1. cd backend"
print_message "2. source venv/bin/activate"
print_message "3. python manage.py runserver"
print_message ""
print_message "To start the frontend development server:"
print_message "1. cd frontend"
print_message "2. npm start"
print_message ""
print_message "Default admin credentials:"
print_message "Username: admin"
print_message "Password: admin123" 