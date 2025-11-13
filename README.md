# Finance Tracker

Finance Tracker is a FastAPI-based service for managing budgets, transactions, categories, and summary reports.

## Prerequisites

- Python 3.11 or newer

## Project Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

If you are using a Unix-like shell:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Running the API

After activating the virtual environment, run the FastAPI app with Uvicorn:

```bash
uvicorn app.main:app --reload
```

The interactive API docs will be available at `http://localhost:8000/docs`.

## Testing

If the project includes automated tests, run them with:

```bash
pytest
```

## License

This project is distributed under the terms specified in the repository license.

