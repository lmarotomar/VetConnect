# Data Processing Agreement (DPA)

**Effective Date:** January 1, 2025  
**Version:** 1.0

This Data Processing Agreement ("**DPA**") is entered into between:

**Data Controller:** The veterinary clinic or business entity subscribing to VetConnect ("**Customer**")  
**Data Processor:** VetConnect, operated by BioVetAI ("**VetConnect**", "we", "us")

This DPA supplements the VetConnect Terms of Service and applies to all processing of Personal Data by VetConnect on behalf of the Customer.

---

## 1. Definitions

**Personal Data:** Any information relating to an identified or identifiable natural person (pet owner/client).

**Processing:** Any operation performed on Personal Data, including collection, storage, use, disclosure, or deletion.

**Sub-processor:** Any third-party engaged by VetConnect to process Personal Data.

**Data Subject:** The individual (pet owner/client) whose Personal Data is being processed.

**Supervisory Authority:** The data protection authority with jurisdiction (e.g., ICO, CNIL, etc.).

**GDPR:** General Data Protection Regulation (EU) 2016/679.

**CCPA:** California Consumer Privacy Act.

---

## 2. Scope and Roles

### 2.1 Controller and Processor Relationship

**Customer** is the **Data Controller**:
- Determines the purposes and means of processing Personal Data
- Responsible for compliance with data protection laws
- Must have legal basis for processing (consent, contract, legitimate interest)

**VetConnect** is the **Data Processor**:
- Processes Personal Data only on documented instructions from Customer
- Does not determine purposes or means of processing
- Acts solely as a service provider

### 2.2 Processing Details

**Subject Matter:** Provision of veterinary clinic management software (SaaS).

**Duration:** For the term of the VetConnect subscription.

**Nature and Purpose:**
- Appointment scheduling and management
- Client and patient records storage
- Automated communications (WhatsApp, SMS, Email)
- CRM integration and synchronization
- Billing and payment processing
- Reporting and analytics

**Categories of Data Subjects:**
- Pet owners (clinic clients)
- Clinic staff/veterinarians
- Emergency contacts

**Types of Personal Data Processed:**

| Category | Data Fields |
|----------|-------------|
| **Contact Information** | Name, email, phone, address |
| **Pet Information** | Pet name, species, breed, age, medical history |
| **Appointment Data** | Date, time, type, notes, triage responses |
| **Communication Records** | WhatsApp messages, SMS, emails sent/received |
| **Billing Information** | Invoices, payment methods (tokenized), transaction history |
| **Usage Data** | Login times, IP addresses, browser type |

---

## 3. Customer Instructions

### 3.1 Scope of Instructions

VetConnect will process Personal Data only in accordance with Customer's documented instructions, which include:

1. **Use of the VetConnect Platform** as described in the Terms of Service
2. **Configuration Settings** defined by Customer in the application
3. **API Integrations** enabled by Customer (HubSpot, Google, etc.)
4. **Communication Templates** created or approved by Customer
5. **Specific Written Instructions** provided via email to support@vetconnect.com

### 3.2 Instruction Compliance

If VetConnect believes an instruction violates GDPR, CCPA, or other data protection laws, we will:
1. Immediately inform Customer
2. Suspend the instruction until resolved
3. Document the concern in writing

### 3.3 Changes to Instructions

Customer may change processing instructions by:
- Updating settings in the VetConnect dashboard
- Submitting a written request to support@vetconnect.com

VetConnect will implement changes within **5 business days**.

---

## 4. VetConnect Obligations

### 4.1 Confidentiality

All VetConnect personnel with access to Personal Data are:
- Bound by confidentiality obligations (contractual or statutory)
- Trained on data protection principles
- Granted access on a need-to-know basis only

**Background checks** are conducted for all employees handling Personal Data.

### 4.2 Security Measures

VetConnect implements **state-of-the-art** technical and organizational measures:

#### Technical Measures:
- ✅ **Encryption at rest** (AES-256)
- ✅ **Encryption in transit** (TLS 1.3)
- ✅ **Multi-factor authentication** (MFA)
- ✅ **Role-based access control** (RBAC)
- ✅ **Automated backups** (daily, encrypted)
- ✅ **Intrusion detection systems** (IDS/IPS)
- ✅ **DDoS protection** (Cloudflare)
- ✅ **Security logging and monitoring** (SIEM)

#### Organizational Measures:
- ✅ **ISO 27001** certified data centers
- ✅ **SOC 2 Type II** compliance (annual audit)
- ✅ **Incident response plan** (24/7 on-call)
- ✅ **Regular penetration testing** (quarterly)
- ✅ **Employee security training** (annual)
- ✅ **Data protection impact assessments** (DPIA)

**Full Security Policy:** [security-policy.md](security-policy.md)

### 4.3 Sub-processors

VetConnect engages the following Sub-processors:

| Sub-processor | Service | Location | Safeguards |
|---------------|---------|----------|------------|
| **AWS** | Cloud hosting | USA (us-east-1) | Standard Contractual Clauses (SCCs) |
| **Stripe** | Payment processing | USA | PCI-DSS Level 1, SCCs |
| **Twilio** | SMS/WhatsApp | USA | GDPR compliant, SCCs |
| **SendGrid** | Email delivery | USA | GDPR compliant, SCCs |
| **Google Cloud** | Calendar/Sheets integration | USA | GDPR compliant, SCCs |
| **HubSpot** | CRM integration | USA | GDPR compliant, Privacy Shield successor |

#### Sub-processor Changes:

VetConnect will provide **30 days' notice** before:
- Adding a new Sub-processor
- Replacing an existing Sub-processor

**Customer may object** to a new Sub-processor. If objection is reasonable, VetConnect will either:
1. Not use the Sub-processor, or
2. Allow Customer to terminate the agreement without penalty

**Current Sub-processor list:** Always available at https://www.vetconnect.com/sub-processors

### 4.4 Data Subject Rights

VetConnect will assist Customer in fulfilling Data Subject requests:

| Right | VetConnect Action | Response Time |
|-------|-------------------|---------------|
| **Access** | Provide tools to export data | 48 hours |
| **Rectification** | Allow Customer to edit records | Real-time |
| **Erasure** | Provide deletion functionality | 48 hours |
| **Restriction** | Support data freezing | 48 hours |
| **Portability** | Export in machine-readable format (JSON, CSV) | 48 hours |
| **Objection** | Assist with opt-out processing | 48 hours |

**Note:** Customer is responsible for verifying the identity of Data Subjects.

### 4.5 Data Breach Notification

In case of a Personal Data breach, VetConnect will:

**Within 24 hours:**
1. Notify Customer via email to admin contacts
2. Provide initial assessment of the breach
3. Assign a dedicated incident manager

**Within 72 hours:**
1. Provide detailed written report including:
   - Nature of the breach
   - Categories and approximate number of affected Data Subjects
   - Likely consequences
   - Measures taken or proposed to mitigate

VetConnect will **reasonably assist** Customer in notifying Supervisory Authorities and Data Subjects if required.

### 4.6 Audits and Inspections

Customer has the right to audit VetConnect's compliance with this DPA:

**Annual SOC 2 Report:** Provided free of charge annually.

**On-site Audit:** Customer may conduct or appoint an independent auditor to conduct an on-site audit:
- Maximum **once per year** (unless breach has occurred)
- With **30 days' written notice**
- During business hours
- Subject to confidentiality obligations
- **Cost:** Borne by Customer

VetConnect will provide **reasonable assistance** and access to:
- Relevant records and documentation
- Personnel for interviews
- Systems for technical review (in controlled environment)

### 4.7 Data Retention and Deletion

**During Agreement:**
- Personal Data is retained as long as Customer account is active
- Customer can delete data at any time via the application

**After Termination:**

| Timeframe | Action |
|-----------|--------|
| **0-30 days** | Data remains accessible for export |
| **30 days** | Automated deletion from production systems begins |
| **60 days** | Deletion from backup systems |
| **90 days** | Complete destruction, including:  • Encrypted backups  • Logs containing Personal Data  • Sub-processor data |

**Certificate of Deletion:** Provided upon written request.

**Legal Hold Exception:** If required by law or legal proceedings, VetConnect will notify Customer of any delayed deletion.

---

## 5. International Data Transfers

### 5.1 EEA to USA Transfers

For transfers of Personal Data from the European Economic Area (EEA) to the USA:

**Mechanism:** Standard Contractual Clauses (SCCs) approved by the European Commission.

**SCCs incorporated** by reference: [EU SCCs Decision 2021/914](https://eur-lex.europa.eu/eli/dec_impl/2021/914/oj)

**Module:** Module Two (Controller to Processor)

**Optional Clauses:** Docking clause enabled, allowing new parties to join.

### 5.2 UK Transfers

For transfers from the UK:

**Mechanism:** UK International Data Transfer Agreement (IDTA) or UK Addendum to EU SCCs.

### 5.3 Switzerland

For transfers from Switzerland:

**Mechanism:** Swiss-approved SCCs

### 5.4 Supplementary Measures

In addition to SCCs, VetConnect implements supplementary technical measures:
- End-to-end encryption
- Pseudonymization where possible
- Strict access controls
- Contractual restrictions on government access

### 5.5 Privacy Shield Successor

VetConnect monitors and will adopt any successor framework to the EU-US Privacy Shield if adopted.

---

## 6. Customer Obligations

### 6.1 Legal Basis

Customer must ensure it has a valid legal basis for processing:
- ✅ Consent from pet owners
- ✅ Contractual necessity
- ✅ Legal obligation
- ✅ Legitimate interests

### 6.2 Transparency

Customer must inform Data Subjects about:
- Processing by VetConnect
- Use of cookies and tracking
- Data transfers to third countries
- Their rights under data protection laws

**Recommended:** Link to VetConnect Privacy Policy in your clinic's privacy notice.

### 6.3 Data Minimization

Customer should only collect and process Personal Data that is:
- Necessary for the specified purpose
- Accurate and up-to-date
- Retained no longer than necessary

---

## 7. Liability and Indemnification

### 7.1 Liability Cap

VetConnect's total liability under this DPA is limited to the **Limitation of Liability** clause in the Terms of Service.

**Exception:** No limit on liability for:
- Gross negligence or willful misconduct
- Violation of data protection laws due to VetConnect's actions
- Data breaches caused by VetConnect's security failures

### 7.2 Indemnification

Each party will indemnify the other for:
- Claims arising from breach of this DPA
- Fines from Supervisory Authorities due to the other party's breach
- Third-party claims related to data protection violations

---

## 8. Term and Termination

### 8.1 Term

This DPA remains in effect for the duration of the VetConnect subscription.

### 8.2 Survival

The following obligations survive termination:
- Data deletion (Section 4.7)
- Confidentiality (Section 4.1)
- Audit rights (for 1 year post-termination)
- Indemnification (Section 7.2)

---

## 9. Amendments

This DPA may be amended:
- To reflect changes in data protection law
- To add new Sub-processors (with 30 days' notice)
- By mutual written agreement

**Notification:** Changes will be notified via email and posted at https://www.vetconnect.com/legal/dpa

---

## 10. Governing Law and Jurisdiction

This DPA is governed by the same law and jurisdiction as the VetConnect Terms of Service, **except** where data protection law mandates a different jurisdiction.

For GDPR-related disputes, the courts of the Customer's Member State have jurisdiction.

---

## 11. Contact Information

**VetConnect Data Protection Officer (DPO):**  
Email: dpo@vetconnect.com  
Mail: VetConnect - Data Protection Officer  
BioVetAI  
[Your Address]

**Customer DPO/Contact:**  
To be specified in Customer's account settings.

---

## Appendix A: Technical and Organizational Measures (TOMs)

_See [security-policy.md](security-policy.md) for full details._

## Appendix B: Standard Contractual Clauses

_Incorporated by reference: EU SCCs Decision 2021/914, Module Two._

## Appendix C: Sub-processor List

_Always current at: https://www.vetconnect.com/sub-processors_

---

**By using VetConnect, Customer agrees to this Data Processing Agreement.**

**Last Updated:** January 1, 2025  
**Version:** 1.0
