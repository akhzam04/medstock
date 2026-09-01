# MedStock

A full-stack hospital inventory and procurement management system. Tracks medical stock levels, manages supplier orders, and flags items approaching reorder thresholds — replacing the spreadsheet-based processes that small clinics often rely on.

Built as an independent project to work through the full lifecycle of a production-style application: relational schema design, a REST API with token authentication, and a typed frontend consuming it.

## Stack

**Backend** — Django 5.0, Django REST Framework, PostgreSQL, JWT authentication (SimpleJWT)
**Frontend** — React with TypeScript, protected routing, typed API layer
**Other** — CORS handling, environment-based configuration, Pillow for image handling

## Features

- Inventory tracking with stock levels and reorder thresholds
- Supplier and procurement order management
- JWT-based authentication with protected routes on both API and client
- Typed API layer — request and response shapes defined in TypeScript
- Relational schema designed for referential integrity across stock, suppliers and orders

## Running it locally

**Backend**

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

**Frontend**

```bash
cd medstock/frontend
npm install
npm start
```

The client runs on `http://localhost:3000` and expects the API on `http://localhost:8000`. Set `REACT_APP_API_URL` in a `.env` file in the frontend directory to point elsewhere.

## Project structure

```
medstock/
├── manage.py              # Django entry point
├── requirements.txt       # Python dependencies
├── sqlmed.sql             # Database schema
├── test_api.py            # API endpoint tests
├── test_mysql.py          # Database connection tests
└── medstock/
    ├── backend/           # Django apps, models, serializers, views
    └── frontend/          # React TypeScript client
        └── src/
            ├── components/    # Layout, ProtectedRoute
            ├── types/         # Shared TypeScript interfaces
            └── App.tsx
```

## Notes and limitations

- Built as a learning project rather than for clinical deployment — it has no regulatory compliance work behind it and shouldn't be used to manage real controlled substances.
- Test coverage is limited to API and database connectivity checks.
- No CI pipeline or containerisation yet; both are the obvious next steps.

## Licence

MIT
