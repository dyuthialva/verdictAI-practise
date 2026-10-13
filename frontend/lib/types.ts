export interface TestCase {
  input: unknown;
  expected_output: unknown;
}

export interface DebugRequest {
  original_code: string;
  test_cases: TestCase[];
}

export interface TestCaseResult {
  test_index: number;
  input: unknown;
  expected_output: unknown;
  actual_output?: unknown;
  passed: boolean;
  status: "passed" | "failed" | "error" | "timeout";
  error?: string | null;
}

export interface ProgramRunSummary {
  passed_count: number;
  failed_count: number;
  total_count: number;
  tests: TestCaseResult[];
}

export interface ResultsComparison {
  original: ProgramRunSummary;
  prosecutor: ProgramRunSummary;
  defender: ProgramRunSummary;
}

export interface ProsecutorData {
  name: string;
  root_cause: string;
  reasoning: string;
  proposed_code: string;
}

export interface DefenderData {
  name: string;
  criticism: string;
  edge_cases: string;
  alternative_reasoning: string;
  proposed_code: string;
}

export interface JudgeData {
  name: string;
  verdict: string;
  winner: "Prosecutor" | "Defender" | "Tie";
  evidence: string;
}

export interface DebugResponse {
  status: "completed" | "validated";
  message: string;
  agent_mode: "mock" | "llm";
  code_line_count: number;
  test_case_count: number;
  prosecutor?: ProsecutorData;
  defender?: DefenderData;
  judge?: JudgeData;
  results?: ResultsComparison;
}

export interface SessionRun {
  id: string;
  timestamp: string;
  codeSnippet: string;
  request: DebugRequest;
  response: DebugResponse;
}
