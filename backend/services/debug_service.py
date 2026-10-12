"""Orchestrates one debugging round.

Milestone 1: only validates and acknowledges the request. Milestones 2-4 will
extend `run_debug` with: run original code -> Prosecutor -> Defender ->
execute candidates -> Judge verdict.
"""
import config
from schemas import DebugRequest, DebugResponse


def run_debug(request: DebugRequest) -> DebugResponse:
    return DebugResponse(
        status="validated",
        message=(
            "Input is valid. No code has been executed and no agents have run yet "
            "(Milestone 1: website and API only)."
        ),
        agent_mode=config.agent_mode(),
        code_line_count=len(request.original_code.splitlines()),
        test_case_count=len(request.test_cases),
    )
