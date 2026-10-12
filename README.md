# Swarm Debugger

Adversarial multi-agent debugging backed by real test execution.

**Current status: Milestone 1 of 5 (website + API skeleton).**
The page and the `POST /debug` endpoint exist and talk to each other, and the
backend validates the input. **No agents run and no code is executed yet.**

| Milestone | Status |
|---|---|
| 1. Website and API | Code written (see "Verified vs. not verified") |
| 2. Isolated Docker test runner | Not started |
| 3. Three agents (mock + LLM) | Not started |
| 4. Complete workflow | Not started |
| 5. Verification | Not started |

## Prerequisites (Windows)

- Python 3.10+ (`python --version`)
- Node.js 18.17+ (`node --version`)
- Docker Desktop is **not** needed until Milestone 2.

## Run the backend

Open PowerShell in the `swarm-debugger\backend` folder:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env
uvicorn main:app --reload --port 8000
```

If PowerShell blocks the activate script, run once:
`Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

Check it: open http://localhost:8000/health in a browser. You should see
`{"status":"ok","agent_mode":"mock"}`. Interactive API docs: http://localhost:8000/docs

## Run the frontend

Open a second PowerShell in `swarm-debugger\frontend`:

```powershell
npm install
copy .env.local.example .env.local
npm run dev
```

Open http://localhost:3000.

## Try it

1. Click **Load sample** on both panels.
2. Click **Run Debugger**.
3. You should see a "Backend response" box with agent mode `mock`, 3 lines of
   code and 2 test cases.

To see the error handling: break the JSON in the test box, clear the code box,
or stop the backend and click Run.

## Code and test-case contract

The submitted program must define `def solve(input_data):`. It receives a value
decoded from JSON and returns a JSON-compatible value. Each test case is an
object with exactly two required fields, `input` and `expected_output`.

```json
[
  { "input": {"numbers": [2, 4, 6]}, "expected_output": 4 },
  { "input": {"numbers": []},        "expected_output": 0 }
]
```

Limits: code up to 20,000 characters, 1 to 50 test cases.
Output comparison rules (e.g. `true` vs `1`) are defined in Milestone 2.

## Project layout

```
backend/    FastAPI app (main.py, schemas.py, config.py, services/, agents/, execution/)
frontend/   Next.js + TypeScript + Tailwind page (app/, components/, lib/)
docker/     Runner image (Milestone 2)
```

`agents/` and `execution/` are empty placeholders for Milestones 2 and 3.
