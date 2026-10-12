import type { DebugRequest, DebugResponse, TestCase } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/** Parse and check the test-case text. Returns test cases or a readable error. */
export function parseTestCases(text: string): { ok: true; value: TestCase[] } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch (e) {
    return { ok: false, error: `Test cases are not valid JSON: ${(e as Error).message}` };
  }
  if (!Array.isArray(parsed)) {
    return { ok: false, error: "Test cases must be a JSON array, e.g. [ { \"input\": ..., \"expected_output\": ... } ]." };
  }
  if (parsed.length === 0) {
    return { ok: false, error: "Add at least one test case." };
  }
  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i];
    if (typeof item !== "object" || item === null || Array.isArray(item)) {
      return { ok: false, error: `Test case #${i + 1} must be an object with "input" and "expected_output".` };
    }
    const keys = Object.keys(item);
    for (const required of ["input", "expected_output"]) {
      if (!keys.includes(required)) {
        return { ok: false, error: `Test case #${i + 1} is missing "${required}".` };
      }
    }
    const extra = keys.filter((k) => k !== "input" && k !== "expected_output");
    if (extra.length > 0) {
      return { ok: false, error: `Test case #${i + 1} has unexpected field(s): ${extra.join(", ")}.` };
    }
  }
  return { ok: true, value: parsed as TestCase[] };
}

/** Call POST /debug. Throws an Error with a readable message on any failure. */
export async function runDebug(request: DebugRequest): Promise<DebugResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_URL}/debug`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error(`Could not reach the backend at ${API_URL}. Is it running?`);
  }

  if (!response.ok) {
    let message = `Backend returned HTTP ${response.status}.`;
    try {
      const body = await response.json();
      if (Array.isArray(body.errors) && body.errors.length > 0) {
        message = body.errors.join("\n");
      } else if (typeof body.detail === "string") {
        message = body.detail;
      }
    } catch {
      /* keep the default message */
    }
    throw new Error(message);
  }
  return (await response.json()) as DebugResponse;
}
