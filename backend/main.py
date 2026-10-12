"""FastAPI entry point. Run with: uvicorn main:app --reload --port 8000"""
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

import config
from schemas import DebugRequest, DebugResponse
from services.debug_service import run_debug

app = FastAPI(title="Swarm Debugger API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins(),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    """Return validation problems in a simple, readable shape for the frontend."""
    errors = []
    for err in exc.errors():
        location = ".".join(str(part) for part in err["loc"] if part != "body")
        message = err["msg"].removeprefix("Value error, ")
        errors.append(f"{location}: {message}" if location else message)
    return JSONResponse(status_code=422, content={"detail": "Invalid request", "errors": errors})


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "agent_mode": config.agent_mode()}


@app.post("/debug", response_model=DebugResponse)
def debug(request: DebugRequest) -> DebugResponse:
    return run_debug(request)
