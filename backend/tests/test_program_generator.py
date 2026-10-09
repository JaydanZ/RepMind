import pytest
from langchain_core.exceptions import OutputParserException

from backend.utils.programGenerator import invoke_with_retry, ProgramGenerationError


class FakeChain:
    """Returns or raises each queued outcome in turn, standing in for prompt | llm | parser."""

    def __init__(self, *outcomes):
        self.outcomes = list(outcomes)
        self.calls = 0

    def invoke(self, inputs):
        self.calls += 1
        outcome = self.outcomes.pop(0)
        if isinstance(outcome, Exception):
            raise outcome
        return outcome


def test_returns_the_first_valid_program():
    chain = FakeChain("program")

    assert invoke_with_retry(chain, {}) == "program"
    assert chain.calls == 1


def test_retries_once_after_invalid_output():
    chain = FakeChain(OutputParserException("bad output"), "program")

    assert invoke_with_retry(chain, {}) == "program"
    assert chain.calls == 2


def test_gives_up_after_the_retry_also_fails():
    chain = FakeChain(OutputParserException("bad"), OutputParserException("still bad"), "unused")

    with pytest.raises(ProgramGenerationError):
        invoke_with_retry(chain, {})
    assert chain.calls == 2


def test_does_not_retry_other_errors():
    chain = FakeChain(ConnectionError("network down"), "unused")

    with pytest.raises(ConnectionError):
        invoke_with_retry(chain, {})
    assert chain.calls == 1
