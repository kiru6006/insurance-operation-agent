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

class MockSubmissionSystem:
    def __init__(self):
        self.submissions: Dict[str, dict] = {}
        self.documents: Dict[str, List[dict]] = {}
        self.broker_emails: Dict[str, str] = {}
        self._seed_sample_submissions()

    def _seed_sample_submissions(self):
        lobs = ["COMMERCIAL_PROPERTY", "GENERAL_LIABILITY", "WORKERS_COMP", "CYBER_SECURITY", "COMMERCIAL_AUTO"]
        businesses = [
            ("Apex Logistics Corp", "Warehousing and regional distribution center, 45,000 sq ft, 25 vehicles."),
            ("Nexus Healthcare Partners", "Multi-specialty outpatient surgery and clinical practice network."),
            ("Beacon Hospitality Group", "Boutique hotel with rooftop bar and commercial restaurant."),
            ("Horizon Tech Solutions", "Cloud software infrastructure and enterprise data services provider."),
            ("Pinnacle Construction LLC", "Mid-rise commercial general contractor operating in 3 states."),
            ("Summit Manufacturing", "Precision industrial metal machining and CNC manufacturing facility.")
        ]

        for i in range(1, 31):
            sub_id = f"SUB-{i:03d}"
            biz_idx = (i - 1) % len(businesses)
            biz_name, desc = businesses[biz_idx]
            lob = lobs[(i - 1) % len(lobs)]
            broker_id = f"BRK-{(i % 5) + 1:03d}"
            
            # Email sample
            email_text = f"""From: broker{broker_id}@firstbrokerage.com
To: submissions@insureops.local
Subject: New Submission Quote Request: {biz_name} ({lob})

Dear Underwriting Team,

Please find attached the insurance package for {biz_name}.
Business details: {desc}
Requested line: {lob}
Effective Date: 2026-11-01
Prior coverage: Standard commercial policy with zero major losses in last 3 years.

Attached documents:
1. ACORD 125 (Commercial Insurance Application)
2. 5-Year Loss Runs Statement
3. Safety Audit & Operations Overview

Regards,
Senior Broker Agent
"""
            self.broker_emails[sub_id] = email_text
            self.submissions[sub_id] = {
                "id": sub_id,
                "tenant_id": "tenant-default",
                "broker_id": broker_id,
                "applicant_name": f"{biz_name} #{i}",
                "line_of_business": lob,
                "status": "submitted" if i % 3 != 0 else "analyzed",
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat(),
            }
            self.documents[sub_id] = [
                {
                    "id": f"DOC-{sub_id}-1",
                    "file_name": "ACORD_125_Application.pdf",
                    "file_path": f"/mock_storage/submissions/{sub_id}/acord_125.pdf",
                    "document_type": "application"
                },
                {
                    "id": f"DOC-{sub_id}-2",
                    "file_name": "5_Year_Loss_Runs.pdf",
                    "file_path": f"/mock_storage/submissions/{sub_id}/loss_runs.pdf",
                    "document_type": "loss_runs"
                }
            ]

    def get_submission(self, sub_id: str) -> Optional[dict]:
        return self.submissions.get(sub_id)

    def list_submissions(self) -> List[dict]:
        return list(self.submissions.values())

    def get_documents(self, sub_id: str) -> List[dict]:
        return self.documents.get(sub_id, [])

    def get_email_text(self, sub_id: str) -> str:
        return self.broker_emails.get(sub_id, "No email body recorded.")

# Global instances
policy_system = MockPolicySystem()
claims_system = MockClaimsSystem()
crm_system = MockCustomerCRM()
submission_system = MockSubmissionSystem()

