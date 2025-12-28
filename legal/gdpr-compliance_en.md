# GDPR Compliance Guide

**VetConnect - General Data Protection Regulation Compliance**  
**Version:** 1.0  
**Effective Date:** January 1, 2025

This document outlines how VetConnect complies with the EU General Data Protection Regulation (GDPR) and how our customers (veterinary clinics) can use VetConnect in a GDPR-compliant manner.

---

## 1. Executive Summary

VetConnect is committed to protecting personal data and complying with GDPR requirements. This guide covers:

✅ Our role as Data Processor  
✅ Your responsibilities as Data Controller  
✅ Data Subject Rights implementation  
✅ Security measures and safeguards  
✅ International data transfers  
✅ Breach notification procedures  

---

## 2. GDPR Fundamentals

### 2.1 What is GDPR?

The **General Data Protection Regulation (GDPR)** is EU law that:
- Protects personal data of EU residents
- Applies to any organization processing EU residents' data
- Imposes significant fines for non-compliance (up to €20M or 4% of global revenue)

**Applies to VetConnect users who:**
- Have clinics in the EU
- Serve clients/pet owners in the EU
- Process EU residents' personal data

### 2.2 Key Principles

GDPR requires that personal data be:

| Principle | Meaning | VetConnect Implementation |
|-----------|---------|--------------------------|
| **Lawfulness** | Have legal basis | Consent, contract, legitimate interest |
| **Fairness** | Transparent processing | Clear privacy notices |
| **Transparency** | Inform data subjects | Privacy Policy, in-app notices |
| **Purpose Limitation** | Collect for specific purposes | Only appointment/medical data |
| **Data Minimization** | Collect only what's needed | Configurable fields |
| **Accuracy** | Keep data up-to-date | Edit/update functionality |
| **Storage Limitation** | Don't keep longer than needed | Configurable retention |
| **Integrity** | Secure processing | Encryption, access controls |
| **Accountability** | Demonstrate compliance | Audit logs, documentation |

---

## 3. Roles and Responsibilities

### 3.1 VetConnect as Data Processor

**We process personal data on your behalf**

**Our Obligations:**
- ✅ Process data only per your instructions
- ✅ Ensure confidentiality of personnel
- ✅ Implement appropriate security measures
- ✅ Assist with data subject rights requests
- ✅ Notify you of data breaches within 24 hours
- ✅ Delete data upon your request
- ✅ Maintain records of processing activities

**Documented in:** [Data Processing Agreement (DPA)](data-processing-agreement.md)

### 3.2 You (Clinic) as Data Controller

**You determine what data is collected and why**

**Your Obligations:**
- ✅ Have a legal basis for processing
- ✅ Inform pet owners about data processing
- ✅ Obtain explicit consent where required
- ✅ Respond to data subject rights requests
- ✅ Report breaches to supervisory authority (within 72 hours)
- ✅ Conduct Data Protection Impact Assessments (DPIAs)
- ✅ Appoint a Data Protection Officer (DPO) if required

### 3.3 When DPO is Required

You must appoint a DPO if:
- ✅ You are a public authority (public veterinary clinic)
- ✅ Your core activities require large-scale systematic monitoring
- ✅ You process special category data on a large scale

**Special category data includes:** Health data (pet medical records may qualify).

**Most private veterinary clinics** do not require a formal DPO but should designate a privacy point of contact.

---

## 4. Legal Basis for Processing

### 4.1 Available Legal Bases

Choose ONE legal basis for each processing activity:

#### 1. **Consent**
- **When:** Pet owner explicitly agrees
- **Example:** Marketing communications, optional features
- **Requirements:** Freely given, specific, informed, unambiguous
- **VetConnect tool:** Consent checkboxes in appointment forms

#### 2. **Contract**
- **When:** Processing necessary to provide service
- **Example:** Appointment scheduling, medical records
- **VetConnect tool:** Terms of Service acceptance

#### 3. **Legal Obligation**
- **When:** Required by law
- **Example:** Reporting animal diseases to authorities
- **VetConnect tool:** Mandatory fields for legal compliance

#### 4. **Legitimate Interests**
- **When:** Processing necessary for your legitimate interests
- **Example:** Fraud prevention, network security
- **Balancing test:** Your interest must not override pet owner's rights
- **VetConnect tool:** Legitimate Interest Assessment (LIA) template

#### 5. **Vital Interests**
- **When:** Protecting life/health
- **Example:** Emergency veterinary care
- **Rare in practice**

#### 6. **Public Task**
- **When:** Performing public interest tasks
- **Example:** Public health veterinary services
- **Rare for private clinics**

### 4.2 Consent Management in VetConnect

**How to obtain consent:**

1. **During Client Registration:**
   ```
   ☑️ I consent to VetConnect storing my contact information
      for appointment reminders (required)
   
   ☐ I consent to receiving marketing communications about
      pet care tips and clinic promotions (optional)
   ```

2. **Granular Consent:**
   - Separate checkboxes for each purpose
   - Pre-checked boxes are NOT valid consent
   - Easy to withdraw at any time

3. **Record of Consent:**
   - VetConnect logs: who, when, what, how
   - Stored in client profile
   - Available for audit

**Withdrawing Consent:**
- Pet owner can withdraw via Settings > Privacy
- Clinic staff can withdraw on their behalf
- Processing stops immediately (except where another legal basis applies)

---

## 5. Data Subject Rights

### 5.1 Rights Under GDPR

GDPR grants pet owners (data subjects) 8 rights:

| Right | What it means | VetConnect Feature |
|-------|---------------|-------------------|
| **1. Right to be Informed** | Know how their data is used | Privacy Policy, in-app notices |
| **2. Right of Access** | Request copy of their data | Export button (JSON, PDF, CSV) |
| **3. Right to Rectification** | Correct inaccurate data | Edit client profile |
| **4. Right to Erasure** | Delete their data ("right to be forgotten") | Delete button with confirmation |
| **5. Right to Restrict Processing** | Freeze their data | "Freeze Account" functionality |
| **6. Right to Data Portability** | Receive data in machine-readable format | Export as JSON/CSV |
| **7. Right to Object** | Object to certain processing | Opt-out links |
| **8. Rights re Automated Decision-Making** | Not be subject to automated profiling | We don't use automated decisions |

### 5.2 Responding to Requests

**Timeline:** You must respond within **1 month** (extendable by 2 months if complex).

**How VetConnect Helps:**

#### Access Request (SAR - Subject Access Request)
1. Pet owner requests their data
2. You verify their identity
3. In VetConnect: **Client Profile > Export Data**
4. Download includes:
   - Contact information
   - Pet details
   - Appointment history
   - Communication logs
   - Billing records
5. Send to pet owner (encrypted email or secure link)

#### Deletion Request
1. Pet owner requests deletion
2. You verify identity and check for legal holds
3. In VetConnect: **Client Profile > Delete Account**
4. Confirmation dialog:
   ```
   ⚠️ Are you sure? This will delete:
   - All pet records
   - Appointment history
   - Communication logs
   - Cannot be undone
   
   [Cancel] [Permanently Delete]
   ```
5. Data deleted from production within 24 hours
6. Deleted from backups within 90 days

#### Rectification Request
1. Pet owner requests data correction
2. In VetConnect: **Client Profile > Edit**
3. Update information
4. System logs the change for audit

#### Portability Request
1. Same as Access Request but format matters
2. VetConnect provides: JSON, CSV, Excel
3. Common fields mapped to standard schemas

### 5.3 Valid Reasons to Refuse

You may refuse a request if:
- ❌ Request is manifestly unfounded or excessive
- ❌ You cannot verify the requester's identity
- ❌ Legal obligation requires you to keep the data
- ❌ Data is needed for legal claims

**Important:** You must explain the refusal in writing within 1 month.

---

## 6. Security and Data Protection by Design

### 6.1 Technical Measures

VetConnect implements:

**Encryption:**
- ✅ AES-256 encryption at rest
- ✅ TLS 1.3 encryption in transit
- ✅ End-to-end encryption for sensitive fields (optional)

**Access Controls:**
- ✅ Multi-factor authentication (MFA)
- ✅ Role-based access control (RBAC)
- ✅ Principle of least privilege
- ✅ Automatic session timeout

**Data Segregation:**
- ✅ Each clinic's data isolated (multi-tenancy)
- ✅ Logical separation between environments (dev/staging/prod)

**Monitoring:**
- ✅ Real-time intrusion detection
- ✅ Audit logs for all data access
- ✅ Automated anomaly detection

**Full details:** [Security Policy](security-policy.md)

### 6.2 Organizational Measures

**Policies:**
- Security Incident Response Plan
- Data Breach Notification Procedure
- Employee Data Protection Training (annual)
- Background checks for all staff

**Certifications:**
- ISO 27001 (Information Security)
- SOC 2 Type II (annual audit)
- GDPR compliance certified by external auditor

### 6.3 Privacy by Design

VetConnect is built with privacy at its core:

**Data Minimization:**
- Only required fields are mandatory
- Optional fields clearly marked
- No unnecessary data collection

**Pseudonymization:**
- Internal IDs instead of personal identifiers where possible
- Analytics use aggregated/anonymized data only

**Privacy-Preserving Defaults:**
- Marketing opt-in (not opt-out)
- Strict data retention limits
- Automatic anonymization of old records

---

## 7. International Data Transfers

### 7.1 Where is Data Stored?

**Primary Location:** AWS us-east-1 (Virginia, USA)

**Backups:** AWS us-west-2 (Oregon, USA)

**This means:** Data is transferred from EU to USA

### 7.2 Transfer Mechanisms

For EU to USA transfers, VetConnect uses:

#### Standard Contractual Clauses (SCCs)
- ✅ Approved by European Commission (Decision 2021/914)
- ✅ Module Two: Controller to Processor
- ✅ Included in our [DPA](data-processing-agreement.md)

#### Supplementary Measures
- ✅ Encryption (end-to-end)
- ✅ Strict access controls
- ✅ Contractual restrictions on government access
- ✅ Transparency reports

#### Transfer Impact Assessment (TIA)
We have conducted a TIA and determined that:
- SCCs + technical measures provide adequate protection
- No substantial likelihood of US government access
- Encryption renders data unintelligible to third parties

**EU-only hosting (optional):**
Enterprise customers can request EU-only data residency (Frankfurt region) for an additional fee.

### 7.3 Sub-processor Locations

All Sub-processors are either:
- In the EU/EEA, or
- Have adequate safeguards (SCCs or adequacy decision)

**Full list:** [Sub-processor Registry](https://www.vetconnect.com/sub-processors)

---

## 8. Data Breach Management

### 8.1 What is a Personal Data Breach?

A breach of security leading to:
- Accidental or unlawful destruction
- Loss, alteration, unauthorized disclosure
- Unauthorized access to personal data

**Examples:**
- Ransomware attack encrypting database
- Employee accidentally emails client list to wrong person
- Lost/stolen laptop with unencrypted client data
- Hacker gains access to admin account

### 8.2 VetConnect's Breach Response (as Processor)

**Within 24 hours:**
1. Detect and contain the breach
2. Notify you (Customer) via email + phone
3. Provide initial assessment

**Within 72 hours:**
1. Full written report including:
   - Date/time of breach
   - Categories of data affected
   - Number of data subjects affected
   - Root cause analysis
   - Remediation steps taken
   - Recommendations

2. Assistance with:
   - Supervisory authority notification
   - Data subject notification (if required)
   - Media response

### 8.3 Your Breach Obligations (as Controller)

**Within 72 hours of becoming aware:**
1. **Notify Supervisory Authority:**
   - Your national DPA (e.g., ICO, CNIL)
   - Use their online portal or email
   - Include: nature, data subjects affected, consequences, measures

2. **Assess if Data Subjects Must Be Notified:**
   - **Yes, if:** High risk to rights/freedoms
   - **No, if:** 
     - Data was encrypted (and key not compromised)
     - Subsequent measures eliminate risk
     - Disproportionate effort (can use public notice)

3. **Document Everything:**
   - Facts of the breach
   - Effects
   - Remedial action
   - Keep for audit (indefinitely)

**Fines for non-compliance:** Up to €10M or 2% of global turnover

**VetConnect Breach Hotline:** breach@vetconnect.com (24/7)

---

## 9. Data Protection Impact Assessment (DPIA)

### 9.1 When DPIA is Required

Conduct a DPIA before:
- Processing sensitive/special category data on large scale
- Systematic monitoring on large scale
- Using new technologies with high risk

**For VetConnect users:**
- Most clinics: **Not required** (small-scale processing)
- Large chains, multi-location: **Recommended**
- If sharing data with research institutions: **Required**

### 9.2 DPIA Template

VetConnect provides a DPIA template for customers:

**Sections:**
1. Description of processing operations
2. Necessity and proportionality
3. Risks to data subjects' rights
4. Measures to address risks
5. Consultation with stakeholders

**Download:** [DPIA Template](https://www.vetconnect.com/resources/dpia-template.docx)

---

## 10. Children's Data

### 10.1 Is Parental Consent Required?

**GDPR:** If pet owner is under 16 (or lower age set by Member State), parental consent is required for online services.

**VetConnect Position:**
- We collect data about pet owners (clients), not about pets
- Minors rarely own pets in their own name
- However: If a minor is the legal owner, parental consent is required

### 10.2 Age Verification

VetConnect includes:
- Age gate on registration: "Are you 18 or older?"
- Parental consent form for minors
- Restriction on processing minors' data

**Your responsibility:** Verify age when registering new clients in person.

---

## 11. Special Category Data

### 11.1 What is Special Category Data?

GDPR Article 9 prohibits processing data revealing:
- Racial/ethnic origin
- Political opinions
- Religious beliefs
- Trade union membership
- **Health data**
- Sex life/sexual orientation
- Genetic/biometric data

**VetConnect:**
- **Pet medical records = pet health data** (not human health)
- **Not generally considered special category data** under GDPR
- **However:** If medical records contain human health information (e.g., "Owner is allergic to X"), this IS special category data

### 11.2 Processing Special Category Data

If you process special category data, you need:
- **Explicit consent**, or
- **Legal obligation**, or
- **Vital interests** (life/death), or
- **Medical diagnosis** (healthcare professional)

**VetConnect recommendation:**
- Avoid recording human health data in pet records
- If necessary, obtain explicit consent
- Use free-text fields sparingly

### 11.3 Security for Special Category Data

VetConnect applies **enhanced security** to fields marked as containing special category data:
- Additional encryption layer
- Restricted access (need-to-know only)
- Audit logging of all access
- Separate backup encryption keys

---

## 12. Cookies and Online Tracking

### 12.1 Cookie Consent (ePrivacy Directive)

In addition to GDPR, the ePrivacy Directive requires:
- **Consent before placing cookies** (except essential cookies)
- Clear information about cookie purposes
- Easy opt-out

**VetConnect compliance:**
- Cookie consent banner on first visit
- Granular consent options
- Easy revocation

**Full details:** [Cookie Policy](cookie-policy.md)

### 12.2 Do Not Track (DNT)

VetConnect honors the DNT browser signal:
- If DNT enabled: No analytics, no advertising cookies
- Only essential and functional cookies

---

## 13. Vendor Management

### 13.1 Sub-processor Due Diligence

VetConnect vets all Sub-processors for:
- GDPR compliance
- Adequate security measures
- Data transfer safeguards
- Track record

**Customer notification:** 30 days before engaging new Sub-processor

**Right to object:** If you object, we will find an alternative or allow termination without penalty

### 13.2 Your Vendors

If you use other tools alongside VetConnect:
- You are a Data Controller for those tools too
- Ensure they have DPAs in place
- Check their GDPR compliance

**Examples:**
- Email marketing platforms
- Social media (if you collect data via Facebook)
- Payment processors (if separate from VetConnect)

---

## 14. Supervisory Authorities

### 14.1 EU Member State DPAs

Each EU country has a supervisory authority (DPA):

| Country | Authority | Website |
|---------|-----------|---------|
| **Ireland** | Data Protection Commission (DPC) | dataprotection.ie |
| **Germany** | Bundesbeauftragter für Datenschutz | bfdi.bund.de |
| **France** | CNIL | cnil.fr |
| **Spain** | AEPD | aepd.es |
| **Italy** | Garante Privacy | garanteprivacy.it |
| **Netherlands** | Autoriteit Persoonsgegevens | autoriteitpersoonsgegevens.nl |
| **Belgium** | Data Protection Authority | gegevensbeschermingsautoriteit.be |
| **...** | ... | ... |

**Your DPA:** Register with the DPA where your clinic is established.

### 14.2 Complaints

Data subjects can lodge complaints with:
- Your DPA (clinic's jurisdiction)
- Their DPA (data subject's residence)
- VetConnect's DPA (Ireland - as we are established in EU via AWS Ireland)

**Complaint handling:**
1. DPA receives complaint
2. Investigates
3. May issue:
   - Warning
   - Reprimand
   - Order to comply
   - Fine (up to €20M or 4% of global revenue)

### 14.3 One-Stop-Shop Mechanism

If you operate in multiple EU countries:
- Your lead DPA (where main establishment is) handles cross-border cases
- Other DPAs cooperate
- Avoids having to deal with 27 different DPAs

---

## 15. VetConnect Compliance Checklist

### For Customers (Clinics)

**Setup:**
- ☐ Update your clinic's privacy policy to mention VetConnect
- ☐ Include link to VetConnect Privacy Policy
- ☐ Train staff on GDPR basics
- ☐ Designate a privacy point of contact
- ☐ Review and sign VetConnect DPA
- ☐ Configure data retention settings in VetConnect

**Ongoing:**
- ☐ Review consent forms annually
- ☐ Respond to data subject requests within 1 month
- ☐ Report breaches to DPA within 72 hours (if applicable)
- ☐ Keep records of processing activities
- ☐ Conduct DPIAs when required
- ☐ Monitor VetConnect sub-processor changes

**Annual:**
- ☐ Review data inventory
- ☐ Update privacy notices
- ☐ Retrain staff
- ☐ Audit access logs
- ☐ Test incident response plan

### For VetConnect (Our Commitments)

**Completed:**
- ✅ DPA available
- ✅ SOC 2 Type II certified
- ✅ ISO 27001 certified
- ✅ SCCs implemented
- ✅ Cookie Policy published
- ✅ Privacy Policy GDPR-compliant
- ✅ Sub-processor registry maintained
- ✅ Breach notification procedure
- ✅ Data export functionality
- ✅ Data deletion functionality

**Ongoing:**
- ✅ Monitor legal developments
- ✅ Update policies as needed
- ✅ Annual compliance audits
- ✅ Quarterly penetration testing
- ✅ Continuous security monitoring

---

## 16. Resources and Support

### 16.1 VetConnect Resources

- **GDPR Hub:** https://www.vetconnect.com/gdpr
- **Templates:** Privacy notices, consent forms, DPIA
- **Training:** Webinar on GDPR for veterinary clinics
- **Knowledge Base:** https://support.vetconnect.com/gdpr

### 16.2 Official GDPR Resources

- **EU GDPR Portal:** https://gdpr.eu
- **ICO (UK):** https://ico.org.uk/for-organisations/guide-to-data-protection/
- **European Data Protection Board:** https://edpb.europa.eu

### 16.3 VetConnect GDPR Support

**Email:** gdpr@vetconnect.com  
**Phone:** +1 (904) 934-7620 (Mon-Fri 9AM-5PM EST)  
**DPO Contact:** dpo@vetconnect.com

---

## 17. Updates to This Guide

This compliance guide is updated:
- Quarterly (or as GDPR law evolves)
- After significant product changes
- Following guidance from DPAs

**Version History:**
- v1.0 (Jan 1, 2025): Initial publication

**Notification:** Major changes notified via email and in-app banner.

---

**By using VetConnect, you agree to comply with GDPR and this guidance.**

**Questions? Contact our DPO:** dpo@vetconnect.com
