
"""FastAPI entry point.
Run with: uvicorn main:app --reload --port 8000
"""

import os
import json
import asyncio

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI(title="Swarm Debugger API")

# CORS: allow the local Next.js development frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Initialize Gemini lazily so the API can start even if the key is missing.
_client = None


def get_client():
    global _client

    if _client is None:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is missing. Add it to backend/.env."
            )
        _client = genai.Client(api_key=api_key)

    return _client


class CodeRequest(BaseModel):
    code: str


@app.exception_handler(RequestValidationError)
async def validation_error_handler(
    request: Request,
    exc: RequestValidationError,
):
    """Return validation errors in a readable format."""
    errors = []

    for err in exc.errors():
        location = ".".join(
            str(part) for part in err["loc"] if part != "body"
        )
        message = err["msg"].removeprefix("Value error, ")
        errors.append(f"{location}: {message}" if location else message)

    return JSONResponse(
        status_code=422,
        content={
            "detail": "Invalid request",
            "errors": errors,
        },
    )


@app.get("/health")
async def health():
    return {"status": "ok", "service": "Swarm Debugger API"}


@app.post("/debug/stream")
async def swarm_debug_stream(request: CodeRequest):

    async def event_generator():
        original_code = request.code
        model_name = "gemini-2.5-flash"
        client = None

        generation_config = types.GenerateContentConfig(
            max_output_tokens=1000,
            temperature=0.2,
        )

        def send_event(agent, text):
            return (
                f"data: {json.dumps({'agent': agent, 'text': text})}\n\n"
            )

        async def stream_agent(agent, prompt):
            """Stream one agent's response and return its full text."""
            response_text = ""

            response = await client.aio.models.generate_content_stream(
                model=model_name,
                contents=prompt,
                config=generation_config,
            )

            async for chunk in response:
                text = chunk.text or ""

                if not text:
                    continue

                response_text += text
                yield send_event(agent, text)

            return response_text

        try:
            if not original_code.strip():
                yield send_event("error", "Please provide Python code to debug.")
                return

            client = get_client()

            # 1. PROSECUTOR
            yield send_event(
                "status",
                "Prosecutor is analyzing the code...",
            )

            prosecutor_prompt = (
                "You are the Prosecutor Agent in a collaborative debugging system. "
                "Your audience is a beginner.\n"
                "Analyze the submitted Python code and identify genuine bugs. "
                "Explain exactly where and why each bug occurs in plain English. "
                "Give a small example input that triggers the problem and "
                "describe a proposed fix. Do not invent line numbers. "
                "Keep your response under 120 words. "
                "Do not claim that you executed the code.\n\n"
                f"Code:\n{original_code}"
            )

            prosecutor_output = ""

            response = await client.aio.models.generate_content_stream(
                model=model_name,
                contents=prosecutor_prompt,
                config=generation_config,
            )

            async for chunk in response:
                text = chunk.text or ""
                if text:
                    prosecutor_output += text
                    yield send_event("prosecutor", text)

            # 2. DEFENDER
            yield send_event(
                "status",
                "Defender is challenging the proposed fix...",
            )
            await asyncio.sleep(1)

            defender_prompt = (
                "You are the Defender Agent in a collaborative debugging system. "
                "Your audience is a beginner.\n"
                "Critically review the original code and the Prosecutor's analysis. "
                "Challenge incorrect claims, identify overlooked edge cases, "
                "and propose a better fix when justified. If the Prosecutor "
                "is correct, acknowledge that honestly. Explain your reasoning "
                "in plain English, with a small example where useful. "
                "Keep your response under 120 words. Do not claim execution.\n\n"
                f"Original code:\n{original_code}\n\n"
                f"Prosecutor's analysis:\n{prosecutor_output}"
            )

            defender_output = ""

            response = await client.aio.models.generate_content_stream(
                model=model_name,
                contents=defender_prompt,
                config=generation_config,
            )

            async for chunk in response:
                text = chunk.text or ""
                if text:
                    defender_output += text
                    yield send_event("defender", text)

            # 3. JUDGE
            yield send_event(
                "status",
                "Judge is comparing both arguments...",
            )
            await asyncio.sleep(1)

            judge_prompt = (
                "You are the Judge Agent in a collaborative debugging system. "
                "Your audience is a beginner.\n"
                "Compare the Prosecutor's and Defender's reasoning. "
                "Identify the strongest proposed fix and explain why. "
                "List 4 short edge-case tests and state the expected behavior "
                "of a correct implementation. Assess each proposed fix "
                "based on the code and explanations only. You have NOT executed "
                "either fix, so do not claim tests were actually run or passed. "
                "If there is insufficient information to decide, say so.\n"
                "End with this scorecard:\n"
                "Prosecutor: Stronger / Weaker / Tie / Uncertain\n"
                "Defender: Stronger / Weaker / Tie / Uncertain\n"
                "Verdict: Prosecutor / Defender / Tie / Uncertain\n"
                "Reason: one concise sentence.\n"
                "Keep your response under 150 words.\n\n"
                f"Original code:\n{original_code}\n\n"
                f"Prosecutor:\n{prosecutor_output}\n\n"
                f"Defender:\n{defender_output}"
            )

            response = await client.aio.models.generate_content_stream(
                model=model_name,
                contents=judge_prompt,
                config=generation_config,
            )

            async for chunk in response:
                text = chunk.text or ""
                if text:
                    yield send_event("judge", text)

            yield send_event("status", "Done")

        except Exception as exc:
            # Keep internal details in the backend terminal.
            print(f"Swarm Debugger error: {exc}")
            yield send_event(
                "error",
                "Debugging failed. Check the backend terminal and API key.",
            )

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
    )
