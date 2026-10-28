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
        self.documents: Dict[str, List[dict]] = {}
        self.fnol_emails: Dict[str, str] = {}
        self._seed_sample_claims()

    def _seed_sample_claims(self):
        claim_types = ["auto_collision", "commercial_property_water", "slip_and_fall", "fire_damage", "equipment_breakdown"]
        scenarios = [
            ("Apex Logistics Corp", "Delivery truck struck loading dock beam during reverse maneuver causing fender and hydraulic tail lift damage.", 4500.0, "auto_collision", "Warehouse Bay 4, Chicago, IL", "POL-001"),
            ("Nexus Healthcare", "Broken pipe in dental clinic ceiling flooded consultation rooms 3 and 4 over weekend.", 18250.0, "commercial_property_water", "400 Health Ave, Dallas, TX", "POL-001"),
            ("Beacon Hospitality Group", "Customer slipped near bar lounge entrance after rainstorm water was tracked inside.", 7500.0, "slip_and_fall", "Rooftop Lounge, New York, NY", "POL-001"),
            ("Summit Manufacturing", "CNC machine spindle caught fire due to bearing failure during overnight shift run.", 42000.0, "fire_damage", "Plant 2, Detroit, MI", "POL-001"),
            ("Horizon Tech Solutions", "Chiller unit motor burnt out, server room temperatures surged causing emergency shutdown.", 12400.0, "equipment_breakdown", "Data Center West, San Jose, CA", "POL-001"),
        ]

        for i in range(1, 21):
            cid = f"CLM-{i:03d}"
            scen_idx = (i - 1) % len(scenarios)
            biz_name, desc, base_amount, c_type, location, pol_id = scenarios[scen_idx]
            amount = base_amount + ((i * 350) % 2500)
            
            # Potential fraud flag on select test claims (e.g. claim 7 & 13)
            is_suspicious = (i in [7, 13, 19])
            if is_suspicious:
                desc += " [ANOMALY DETECTED: Similar invoice submitted under different policy or repair estimate exceeds market standard by 300%]."

            fnol_email = f"""From: claims-intake@{biz_name.lower().replace(' ', '')}.com
To: claims-report@insureops.local
Subject: First Notice of Loss (FNOL) - Policy {pol_id} - {biz_name}

Hello Claims Department,

We are reporting an incident that occurred on 2026-10-15:
Incident Summary: {desc}
Location: {location}
Estimated Amount Claimed: ${amount:,.2f}
Primary Contact: Risk Manager ({biz_name})
Policy Reference: {pol_id}

Attached are the incident report, photographs, and repair invoices.
"""
            self.fnol_emails[cid] = fnol_email
            self.claims[cid] = {
                "id": cid,
                "policy_id": pol_id,
                "customer_id": f"CUST-{(i % 5) + 1:03d}",
                "claimant_name": biz_name,
                "incident_date": "2026-10-15T08:30:00",
                "amount_claimed": amount,
                "claim_type": c_type,
                "description": desc,
                "incident_location": location,
                "status": "reported" if i % 2 == 0 else "under_review",
                "is_suspicious": is_suspicious,
                "created_at": datetime.utcnow().isoformat(),
            }
            self.documents[cid] = [
                {
                    "id": f"CDOC-{cid}-1",
                    "file_name": "FNOL_Incident_Report.pdf",
                    "file_path": f"/mock_storage/claims/{cid}/incident_report.pdf",
                    "document_type": "police_or_incident_report"
                },
                {
                    "id": f"CDOC-{cid}-2",
                    "file_name": "Damage_Photographs.zip",
                    "file_path": f"/mock_storage/claims/{cid}/damage_photos.zip",
                    "document_type": "photographs"
                },
                {
                    "id": f"CDOC-{cid}-3",
                    "file_name": "Repair_Estimate_Invoice.pdf",
                    "file_path": f"/mock_storage/claims/{cid}/repair_invoice.pdf",
                    "document_type": "invoice"
                }
            ]

    def create_claim(self, **kwargs) -> dict:
        claim_id = f"CLM-{str(uuid4())[:8].upper()}"
        claim = {
            "id": claim_id,
            "status": "reported",
            "created_at": datetime.utcnow().isoformat(),
            **kwargs
        }
        self.claims[claim_id] = claim
        return claim
    
    def get_claim(self, claim_id: str) -> Optional[dict]:
        return self.claims.get(claim_id)

    def list_claims(self) -> List[dict]:
        return list(self.claims.values())

    def get_documents(self, claim_id: str) -> List[dict]:
        return self.documents.get(claim_id, [])

    def get_fnol_email(self, claim_id: str) -> str:
        return self.fnol_emails.get(claim_id, "No FNOL transcript found.")


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

