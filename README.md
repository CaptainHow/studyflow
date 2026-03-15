# StudyFlow

Full-stack project using **Django (backend)** and **React + Vite (frontend)**.
Python dependencies are managed using **uv**.

---

# Project Structure

```
.
├── client/                 # React frontend
│   └── app/
│       ├── public/
│       ├── src/
│       │   ├── assets/
│       │   ├── components/
│       │   ├── pages/
│       │   │   └── Dashboard.jsx
│       │   ├── App.css
│       │   ├── App.jsx
│       │   ├── index.css
│       │   └── main.jsx
│       ├── index.html
│       ├── package.json
│       └── vite.config.js
│
├── server/                 # Django backend
│   └── django_uv/
│       ├── django_project/
│       │   ├── settings.py
│       │   ├── urls.py
│       │   ├── asgi.py
│       │   └── wsgi.py
│       │
│       ├── studyflow/      # Django app
│       │   ├── migrations/
│       │   ├── admin.py
│       │   ├── apps.py
│       │   ├── models.py
│       │   ├── views.py
│       │   └── tests.py
│       │
│       ├── manage.py
│       ├── pyproject.toml
│       └── uv.lock
│
└── README.md
```

---

# Requirements

Install the following tools:

* **Python 3.10+**
* **Node.js 18+**
* **uv** (Python package manager)

Install uv:

```bash
pip install uv
```

or

```bash
curl -Ls https://astral.sh/uv/install.sh | sh
```

Verify installation:

```bash
uv --version
```

---

# Backend Setup (Django + uv)

Navigate to the backend folder:

```bash
cd server/django_uv
```

## Install Dependencies

`uv` reads dependencies from `pyproject.toml`.

```bash
uv sync
```

This creates a virtual environment and installs all dependencies.

---

## Run Database Migrations

```bash
uv run python manage.py migrate
```

---

## Create Admin User (optional)

```bash
uv run python manage.py createsuperuser
```

---

## Run Django Server

```bash
uv run python manage.py runserver
```

Backend will start at:

```
http://127.0.0.1:8000
```

---

# Frontend Setup (React + Vite)

Navigate to the frontend folder:

```bash
cd client/app
```

## Install Dependencies

```bash
npm install
```

or

```bash
yarn
```

---

## Run Development Server

```bash
npm run dev
```

Frontend will run at:

```
http://localhost:5173
```

---

# Development Workflow

Run **both servers simultaneously**:

Terminal 1 — Backend

```bash
cd server/django_uv
uv run python manage.py runserver
```

Terminal 2 — Frontend

```bash
cd client/app
npm run dev
```

---

# Useful Django Commands

Run migrations after model changes:

```bash
uv run python manage.py makemigrations
uv run python manage.py migrate
```

Open Django shell:

```bash
uv run python manage.py shell
```

---

# Build Frontend for Production

```bash
cd client/app
npm run build
```

Output will be generated in:

```
client/app/dist
```

---

# Notes

* Backend uses **uv** for fast dependency management.
* Frontend uses **Vite** for fast React development.
* React communicates with Django APIs.

---

# License

MIT
