"""Request/response models for the API.

Test-case contract (see README): each test case has an `input` (any JSON value)
and an `expected_output` (any JSON value). Both fields are required.
"""
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, field_validator

MAX_CODE_CHARS = 20_000
MAX_TEST_CASES = 50


class TestCase(BaseModel):
    __test__ = False  # stop pytest from treating this class as a test
    model_config = ConfigDict(extra="forbid")

    input: Any
    expected_output: Any


class DebugRequest(BaseModel):
    original_code: str
    test_cases: list[TestCase]

    @field_validator("original_code")
    @classmethod
    def _check_code(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("original_code must not be empty")
        if len(value) > MAX_CODE_CHARS:
            raise ValueError(f"original_code is too long (max {MAX_CODE_CHARS} characters)")
        return value

    @field_validator("test_cases")
    @classmethod
    def _check_tests(cls, value: list[TestCase]) -> list[TestCase]:
        if not value:
            raise ValueError("test_cases must contain at least one test case")
        if len(value) > MAX_TEST_CASES:
            raise ValueError(f"too many test cases (max {MAX_TEST_CASES})")
        return value


class DebugResponse(BaseModel):
    """Milestone 1 response: the request was validated, no analysis is run yet.

    Later milestones add the Prosecutor, Defender, Judge and test-result fields.
    """

    status: Literal["validated"]
    message: str
    agent_mode: Literal["mock", "llm"]
    code_line_count: int
    test_case_count: int
