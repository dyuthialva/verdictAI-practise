"""FastAPI entry point. Run with: uvicorn main:app --reload --port 8000"""
import os
import json
import asyncio
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Swarm Debugger API")

<<<<<<< HEAD

app.add_middleware(
    CORSMiddleware,
    allow_origins=config.cors_origins(),
=======
# VERY IMPORTANT: Enable CORS so your frontend can connect to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins (good for local dev/hackathons)
>>>>>>> d8dcbe940362399e499d8567f5964e6f07a70ef0
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client()

<<<<<<< HEAD

@app.exception_handler(RequestValidationError)
async def validation_error_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
    """Return validation problems in a simple, readable shape for the frontend."""
    errors = []
    for err in exc.errors():
        location = ".".join(str(part) for part in err["loc"] if part != "body")
        message = err["msg"].removeprefix("Value error, ")
        errors.append(f"{location}: {message}" if location else message)
    return JSONResponse(status_code=422, content={"detail": "Invalid request", "errors": errors})
=======
class CodeRequest(BaseModel):
    code: str

@app.post("/debug/stream")
async def swarm_debug_stream(request: CodeRequest):
    async def event_generator():
        original_code = request.code
        model_name = 'gemini-2.5-flash'
        config = types.GenerateContentConfig(max_output_tokens=800)
        
        try:
            # 1. PROSECUTOR AGENT
            yield f"data: {json.dumps({'agent': 'status', 'text': 'Prosecutor is analyzing the code...'})}\n\n"
            prosecutor_prompt = (
                "You are the Prosecutor Agent. Your audience is a beginner who has never seen this code.\n"
                "Find bugs in the Python code and explain in simple, everyday English without unexplained jargon.\n"
                "Say exactly WHERE the code fails (name the line or part) and WHY it fails.\n"
                "Include one tiny real example input that triggers the failure.\n"
                "Describe your fix in plain words. Keep your answer under 120 words.\n\n"
                f"Code:\n{original_code}"
            )
            
            prosecutor_res = await client.aio.models.generate_content(
                model=model_name, contents=prosecutor_prompt, config=config
            )
            prosecutor_output = prosecutor_res.text or ""
            yield f"data: {json.dumps({'agent': 'prosecutor', 'text': prosecutor_output})}\n\n"

            # DELAY BEFORE DEFENDER
            yield f"data: {json.dumps({'agent': 'status', 'text': 'Defender is getting ready...'})}\n\n"
            await asyncio.sleep(2.0)

            # 2. DEFENDER AGENT
            defender_prompt = (
                "You are the Defender Agent. Your audience is a beginner who has never seen this code.\n"
                "Respond directly to the Prosecutor's specific points and challenge their logic on the same code.\n"
                "Find edge cases where their fix or reasoning breaks down. Describe your superior fix in plain words.\n"
                "Keep your answer under 120 words.\n\n"
                f"Original Code:\n{original_code}\n\n"
                f"Prosecutor's Fix:\n{prosecutor_output}"
            )
            
            defender_res = await client.aio.models.generate_content(
                model=model_name, contents=defender_prompt, config=config
            )
            defender_output = defender_res.text or ""
            yield f"data: {json.dumps({'agent': 'defender', 'text': defender_output})}\n\n"

            # DELAY BEFORE JUDGE
            yield f"data: {json.dumps({'agent': 'status', 'text': 'Judge is evaluating both sides...'})}\n\n"
            await asyncio.sleep(2.0)

            # 3. JUDGE AGENT
            judge_prompt = (
                "You are the Judge Agent. Your audience is a beginner who has never seen this code.\n"
                "Evaluate both sides based on the Prosecutor's and Defender's suggested fixes.\n"
                "Write 3-4 short edge-case test cases in plain English.\n"
                "End with a clear scorecard:\n"
                "Prosecutor's code passed: X/Y test cases\n"
                "Defender's code passed: X/Y test cases\n"
                "Winner: <Prosecutor / Defender / Tie>\n\n"
                f"Original Code Intent:\n{original_code}\n\n"
                f"Prosecutor:\n{prosecutor_output}\n\n"
                f"Defender:\n{defender_output}"
            )
            
            judge_res = await client.aio.models.generate_content(
                model=model_name, contents=judge_prompt, config=config
            )
            judge_output = judge_res.text or ""
            yield f"data: {json.dumps({'agent': 'judge', 'text': judge_output})}\n\n"

            # FINISHED
            yield f"data: {json.dumps({'agent': 'status', 'text': 'Done'})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'agent': 'error', 'text': str(e)})}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")

    async def event_generator():
        original_code = request.code
        model_name = 'gemini-2.5-flash'
        config = types.GenerateContentConfig(max_output_tokens=300)
        
        try:
            # 1. PROSECUTOR AGENT
            yield f"data: {json.dumps({'agent': 'status', 'text': 'Prosecutor is analyzing the code...'})}\n\n"
            prosecutor_prompt = (
                "You are the Prosecutor Agent. Your audience is a beginner who has never seen this code.\n"
                "Find bugs in the Python code and explain in simple, everyday English without unexplained jargon.\n"
                "Say exactly WHERE the code fails (name the line or part) and WHY it fails.\n"
                "Include one tiny real example input that triggers the failure (e.g., 'If the list is empty, this line crashes because...').\n"
                "Describe your fix in plain words. You may show at most the single relevant line (max 2-3 lines) of code showing the fix; do not dump full code listings. The rest must be plain sentences.\n"
                "Keep your answer under 120 words, concise, easy to scan, and maximum 5-6 short sentences or bullet points.\n\n"
                f"Code:\n{original_code}"
            )
            
            prosecutor_output = ""
            response = await client.aio.models.generate_content_stream(
                model=model_name, contents=prosecutor_prompt, config=config
            )
            async for chunk in response:
                text = chunk.text or ""
                if not text:
                    continue
                prosecutor_output += text
                yield f"data: {json.dumps({'agent': 'prosecutor', 'text': text})}\n\n"

            # DELAY BEFORE DEFENDER
            yield f"data: {json.dumps({'agent': 'status', 'text': 'Defender is getting ready...'})}\n\n"
            await asyncio.sleep(2.5)

            # 2. DEFENDER AGENT
            defender_prompt = (
                "You are the Defender Agent. Your audience is a beginner who has never seen this code.\n"
                "Respond directly to the Prosecutor's specific points and challenge their logic on the same code.\n"
                "Find edge cases where their fix or reasoning breaks down. Explain WHERE and WHY in simple, everyday English without unexplained jargon.\n"
                "Include one tiny real example input that triggers the failure.\n"
                "Describe your superior fix in plain words. You may show at most the single relevant line (max 2-3 lines) of code showing your fix; do not dump full code listings. The rest must be plain sentences.\n"
                "Keep your answer under 120 words, concise, easy to scan, and maximum 5-6 short sentences or bullet points.\n\n"
                f"Original Code:\n{original_code}\n\n"
                f"Prosecutor's Fix:\n{prosecutor_output}"
            )
            
            defender_output = ""
            response = await client.aio.models.generate_content_stream(
                model=model_name, contents=defender_prompt, config=config
            )
            async for chunk in response:
                text = chunk.text or ""
                if not text:
                    continue
                defender_output += text
                yield f"data: {json.dumps({'agent': 'defender', 'text': text})}\n\n"

            # DELAY BEFORE JUDGE
            yield f"data: {json.dumps({'agent': 'status', 'text': 'Judge is evaluating both sides...'})}\n\n"
            await asyncio.sleep(3.5)

            # 3. JUDGE AGENT
            judge_prompt = (
                "You are the Judge Agent. Your audience is a beginner who has never seen this code.\n"
                "Evaluate both sides based on the Prosecutor's and Defender's actual suggested fixes. Use simple, everyday English without jargon.\n"
                "Write 4-5 short edge-case test cases in plain English (e.g. 'Empty input', 'Negative number', 'Very large value'), one line each.\n"
                "For each test case, state whether the Prosecutor's fixed code PASSES or FAILS, and whether the Defender's fixed code PASSES or FAILS.\n"
                "End with a clear scorecard in this exact format:\n"
                "Prosecutor's code passed: X/Y test cases\n"
                "Defender's code passed: X/Y test cases\n"
                "Winner: <Prosecutor / Defender / Tie> - one plain sentence explaining why.\n\n"
                "Keep the whole Judge response under 150 words.\n\n"
                f"Original Code Intent:\n{original_code}\n\n"
                f"Prosecutor:\n{prosecutor_output}\n\n"
                f"Defender:\n{defender_output}"
            )
            
            judge_output = ""
            response = await client.aio.models.generate_content_stream(
                model=model_name, contents=judge_prompt, config=config
            )
            async for chunk in response:
                text = chunk.text or ""
                if not text:
                    continue
                judge_output += text
                yield f"data: {json.dumps({'agent': 'judge', 'text': text})}\n\n"

            # FINISHED
            yield f"data: {json.dumps({'agent': 'status', 'text': 'Done'})}\n\n"

        except Exception as e:
            yield f"data: {json.dumps({'agent': 'error', 'text': str(e)})}\n\n"

    # Returns a Server-Sent Events stream
    return StreamingResponse(event_generator(), media_type="text/event-stream")
>>>>>>> d8dcbe940362399e499d8567f5964e6f07a70ef0


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)