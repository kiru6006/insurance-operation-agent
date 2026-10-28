import os
import json
from typing import Dict, Any, Optional

class LLMProvider:
    def complete(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        raise NotImplementedError

class MockProvider(LLMProvider):
    def complete(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        # Realistic extraction mock response
        return json.dumps({
            "applicant_name": "Apex Logistics Corp",
            "line_of_business": "COMMERCIAL_PROPERTY",
            "requested_limits": 1000000.0,
            "deductible": 5000.0,
            "coverage_highlights": ["Building", "Personal Property", "Business Income"],
            "confidence_score": 0.96
        })

class AnthropicProvider(LLMProvider):
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("ANTHROPIC_API_KEY")

    def complete(self, prompt: str, system_prompt: Optional[str] = None) -> str:
        if not self.api_key:
            return MockProvider().complete(prompt, system_prompt)
        try:
            import anthropic
            client = anthropic.Anthropic(api_key=self.api_key)
            message = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=1024,
                system=system_prompt or "You are an expert insurance underwriting intelligence assistant.",
                messages=[{"role": "user", "content": prompt}]
            )
            return message.content[0].text
        except Exception:
            return MockProvider().complete(prompt, system_prompt)

def get_llm_provider() -> LLMProvider:
    provider = os.getenv("LLM_PROVIDER", "mock").lower()
    if provider == "anthropic" and os.getenv("ANTHROPIC_API_KEY"):
        return AnthropicProvider()
    return MockProvider()
