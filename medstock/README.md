# MedStock - Medical Inventory and Prescription Management System

MedStock is a comprehensive solution for managing medical supplies inventory and prescriptions in healthcare facilities. The system is built with Django REST Framework for the backend and React.js for the frontend.

## Features

- **Inventory Management**
  - Hierarchical category organization
  - Complete supplier information management
  - Detailed medicine tracking
  - Stock movement history
  - Reorder level monitoring
  - Expiry date tracking

- **Prescription Management**
  - Digital prescription creation
  - Patient record management
  - Medicine dispensing tracking
  - Prescription history
  - Dosage management

- **User Management**
  - Role-based access control
  - Secure authentication
  - User activity tracking
  - Session management

## Tech Stack

### Backend
- Django REST Framework
- MySQL Database
- JWT Authentication
- CORS Support

### Frontend
- React.js
- Material-UI
- React Query
- React Router
- TypeScript

## Getting Started

### Prerequisites
- Python 3.8+
- Node.js 14+
- MySQL 8.0+

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd medstock/backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure the database in `medstock/settings.py`

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Start the development server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd medstock/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

The API documentation is available at `/api/docs/` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 