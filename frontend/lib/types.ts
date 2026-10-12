export interface TestCase {
  input: unknown;
  expected_output: unknown;
}

export interface DebugRequest {
  original_code: string;
  test_cases: TestCase[];
}

// Milestone 1 response. Later milestones add agent output and test results.
export interface DebugResponse {
  status: "validated";
  message: string;
  agent_mode: "mock" | "llm";
  code_line_count: number;
  test_case_count: number;
}
