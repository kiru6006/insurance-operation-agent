from uuid import uuid4
from datetime import datetime
from typing import Dict, List, Optional

class MockPolicySystem:
    def __init__(self):
        self.policies: Dict[str, dict] = {
            "POL-001": {
                "id": "POL-001",
                "customer_id": "CUST-001",
                "customer_name": "John Doe",
                "status": "active",
                "coverage_type": "auto",
                "deductible": 500,
                "limit": 100000,
                "effective_date": "2024-01-01",
                "expiry_date": "2025-01-01",
            }
        }
    
    def get_policy(self, policy_id: str) -> Optional[dict]:
        return self.policies.get(policy_id)
    
    def create_policy(self, **kwargs) -> dict:
        policy_id = f"POL-{str(uuid4())[:8].upper()}"
        policy = {
            "id": policy_id,
            "created_at": datetime.utcnow().isoformat(),
            **kwargs
        }
        self.policies[policy_id] = policy
        return policy

class MockClaimsSystem:
    def __init__(self):
        self.claims: Dict[str, dict] = {}
    
    def create_claim(self, **kwargs) -> dict:
        claim_id = f"CLM-{str(uuid4())[:8].upper()}"
        claim = {
            "id": claim_id,
            "status": "new",
            "created_at": datetime.utcnow().isoformat(),
            **kwargs
        }
        self.claims[claim_id] = claim
        return claim
    
    def get_claim(self, claim_id: str) -> Optional[dict]:
        return self.claims.get(claim_id)

class MockCustomerCRM:
    def __init__(self):
        self.customers: Dict[str, dict] = {
            "CUST-001": {
                "id": "CUST-001",
                "name": "John Doe",
                "email": "john@test.local",
                "phone": "555-0001",
                "address": "123 Main St",
            }
        }
    
    def get_customer(self, customer_id: str) -> Optional[dict]:
        return self.customers.get(customer_id)

# Global instances
policy_system = MockPolicySystem()
claims_system = MockClaimsSystem()
crm_system = MockCustomerCRM()
