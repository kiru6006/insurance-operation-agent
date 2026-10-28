import pytest
from agents.core.llm_provider import GeminiProvider, MockProvider, OpenAIProvider, AnthropicProvider, get_llm_provider

def test_mock_llm_provider():
    provider = MockProvider()
    response = provider.complete("Test insurance prompt")
    assert "Apex Logistics" in response
    assert "COMMERCIAL_PROPERTY" in response

def test_gemini_provider_mock_fallback():
    # When no key is set or invalid, it gracefully falls back to mock
    provider = GeminiProvider(api_key=None)
    response = provider.complete("Extract insurance details")
    assert "Apex Logistics" in response

def test_anthropic_and_openai_mock_fallback():
    p1 = AnthropicProvider(api_key=None)
    assert "Apex Logistics" in p1.complete("prompt")
    p2 = OpenAIProvider(api_key=None)
    assert "Apex Logistics" in p2.complete("prompt")

def test_get_llm_provider_default():
    provider = get_llm_provider()
    assert isinstance(provider, MockProvider)
