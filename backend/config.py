"""Settings read from environment variables (and an optional .env file)."""
import os

from dotenv import load_dotenv

load_dotenv()


def agent_mode() -> str:
    mode = os.getenv("AGENT_MODE", "mock").strip().lower()
    return mode if mode in ("mock", "llm") else "mock"


def cors_origins() -> list[str]:
    raw = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
    return [o.strip() for o in raw.split(",") if o.strip()]
