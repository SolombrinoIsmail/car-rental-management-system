# Story 6: Evidence Chain Management

## Story ID
**Epic 7 - Story 6**

## User Story Statement
**As an** owner and rental business operator  
**I want to** maintain a complete, tamper-proof legal evidence chain for all photos and documentation  
**So that** photos are admissible in court proceedings, disputes can be resolved with confidence, and the business is protected from false claims

## Detailed Acceptance Criteria

1. **Cryptographic Timestamping**
   - Apply RFC 3161 compliant timestamps to all photos at capture
   - Use Swiss-certified timestamping authority for legal validity
   - Embed timestamps that cannot be altered after creation
   - Maintain timestamp accuracy within 1 second of official time

2. **Immutable Storage System**
   - Store original photos in write-once, read-many (WORM) format
   - Prevent any modification to original photo files
   - Use blockchain-based integrity verification for critical photos
   - Maintain multiple independent copies with cross-verification

3. **Comprehensive Audit Trail**
   - Log every action performed on photos (view, download, annotate)
   - Track user identity, timestamp, IP address, and device information
   - Record all system operations affecting photo integrity
   - Maintain tamper-evident audit logs with cryptographic signatures

4. **Hash Verification System**
   - Generate SHA-256 hashes for all photos at capture
   - Store hashes in separate, secured database
   - Regular verification of stored photos against original hashes
   - Immediate alerting for any detected hash mismatches

5. **Digital Chain of Custody**
   - Document complete photo lifecycle from capture to storage
   - Track all personnel who handled or accessed photos
   - Maintain custody transfer records for photo sharing
   - Generate legal chain of custody reports for court proceedings

6. **Tamper Detection**
   - Implement file integrity monitoring for all photo storage
   - Detect any unauthorized access or modification attempts
   - Use advanced forensic techniques to identify tampering
   - Automatic isolation of suspected compromised photos

7. **Legal Export Capabilities**
   - Generate court-admissible photo packages with complete metadata
   - Export evidence bundles in legally recognized formats
   - Include all relevant certificates and timestamp proofs
   - Provide digital signature verification tools

8. **Swiss Legal Compliance**
   - Comply with Swiss Code of Civil Procedure for digital evidence
   - Meet Swiss Federal Act on Data Protection (FADP) requirements
   - Ensure admissibility under Swiss Evidence Law (ZPO Art. 177)
   - Maintain documentation in German, French, and Italian as required

9. **Identity Verification**
   - Strong authentication for all photo-related operations
   - Multi-factor authentication for sensitive evidence operations
   - Biometric verification options for high-value cases
   - Non-repudiation mechanisms for all user actions

10. **Backup and Recovery Validation**
    - Verify evidence chain integrity after backup/restore operations
    - Test recovery procedures without compromising evidence validity
    - Maintain multiple synchronized copies across different jurisdictions
    - Document all recovery operations in audit trail

11. **Expert Witness Support**
    - Generate technical reports explaining photo authenticity
    - Provide expert witness testimony support documentation
    - Create simplified evidence summaries for legal teams
    - Maintain detailed technical specifications for court review

12. **Long-term Archival**
    - Ensure evidence remains valid for Swiss statute of limitations (10 years)
    - Plan for technology migration without compromising integrity
    - Maintain format compatibility for future legal proceedings
    - Regular validation of archived evidence authenticity

## Technical Implementation Notes

### Cryptographic Architecture
- **TimestampService.js**: RFC 3161 timestamp authority integration
- **HashManager.js**: SHA-256 generation and verification system
- **BlockchainIntegrity.js**: Distributed ledger for critical evidence
- **AuditLogger.js**: Tamper-evident audit trail management

### Digital Signature Implementation
```javascript
// Evidence chain with cryptographic signatures
class EvidenceChainManager {
  async capturePhotoWithEvidence(photoData, captureContext) {
    const timestamp = await this.getRFC3161Timestamp()
    const hash = this.generateSHA256Hash(photoData)
    
    // Create evidence record
    const evidenceRecord = {
      photoHash: hash,
      timestamp: timestamp,
      capturedBy: captureContext.userId,
      device: captureContext.deviceInfo,
      location: captureContext.gpsCoordinates,
      contractId: captureContext.contractId
    }
    
    // Sign with private key
    const signature = await this.signWithPrivateKey(evidenceRecord)
    
    // Store in immutable ledger
    await this.storeInBlockchain({
      ...evidenceRecord,
      signature: signature
    })
    
    return {
      photoId: await this.storePhoto(photoData),
      evidenceId: evidenceRecord.id,
      legalFingerprint: this.generateLegalFingerprint(evidenceRecord)
    }
  }
  
  async verifyPhotoIntegrity(photoId) {
    const currentPhoto = await this.retrievePhoto(photoId)
    const originalEvidence = await this.getEvidenceRecord(photoId)
    
    const currentHash = this.generateSHA256Hash(currentPhoto)
    
    if (currentHash !== originalEvidence.photoHash) {
      throw new EvidenceIntegrityError('Photo has been modified since capture')
    }
    
    return {
      verified: true,
      timestamp: originalEvidence.timestamp,
      chainOfCustody: await this.getChainOfCustody(photoId)
    }
  }
}
```

### Blockchain Integration for Critical Evidence
```typescript
interface EvidenceBlock {
  blockHash: string
  previousHash: string
  timestamp: Date
  evidenceRecords: EvidenceRecord[]
  merkleRoot: string
  digitalSignature: string
}

class BlockchainEvidenceSystem {
  async addEvidenceToChain(evidence: EvidenceRecord): Promise<string> {
    const previousBlock = await this.getLatestBlock()
    
    const newBlock: EvidenceBlock = {
      blockHash: '',
      previousHash: previousBlock.blockHash,
      timestamp: new Date(),
      evidenceRecords: [evidence],
      merkleRoot: this.calculateMerkleRoot([evidence]),
      digitalSignature: ''
    }
    
    newBlock.blockHash = this.calculateBlockHash(newBlock)
    newBlock.digitalSignature = await this.signBlock(newBlock)
    
    await this.storeBlock(newBlock)
    return newBlock.blockHash
  }
  
  async verifyChainIntegrity(): Promise<ValidationResult> {
    const chain = await this.getAllBlocks()
    
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i]
      const previousBlock = chain[i - 1]
      
      // Verify hash links
      if (currentBlock.previousHash !== previousBlock.blockHash) {
        return { valid: false, error: `Block ${i} has invalid previous hash` }
      }
      
      // Verify block hash
      const calculatedHash = this.calculateBlockHash(currentBlock)
      if (calculatedHash !== currentBlock.blockHash) {
        return { valid: false, error: `Block ${i} has invalid hash` }
      }
      
      // Verify digital signature
      const signatureValid = await this.verifyBlockSignature(currentBlock)
      if (!signatureValid) {
        return { valid: false, error: `Block ${i} has invalid signature` }
      }
    }
    
    return { valid: true }
  }
}
```

## API Endpoints Needed

### Evidence Chain Operations
```
POST /api/v1/evidence/photos/{photo_id}/chain
- Create evidence chain record for photo
- Request: capture_context, legal_requirements
- Response: evidence_id, blockchain_hash, timestamp_token

GET /api/v1/evidence/photos/{photo_id}/verify
- Verify photo integrity and evidence chain
- Response: verification_status, chain_validity, timestamps

POST /api/v1/evidence/photos/{photo_id}/audit-event
- Log audit event for photo access/modification
- Request: event_type, user_context, details
- Response: audit_event_id, logged_timestamp

GET /api/v1/evidence/photos/{photo_id}/chain-of-custody
- Retrieve complete chain of custody report
- Response: custody_events, transfers, access_log
```

### Legal Export
```
POST /api/v1/evidence/legal-export
- Generate legal evidence package
- Request: photo_ids[], export_format, jurisdiction
- Response: export_id, download_url, verification_instructions

GET /api/v1/evidence/legal-export/{export_id}/certificate
- Get authenticity certificate for legal package
- Response: digital_certificate, verification_data

POST /api/v1/evidence/court-package
- Create court-ready evidence bundle
- Request: case_info, photo_selection, language
- Response: package_id, legal_summary, expert_witness_notes
```

### System Verification
```
POST /api/v1/evidence/system/integrity-check
- Perform system-wide evidence integrity verification
- Response: check_id, status, estimated_completion

GET /api/v1/evidence/system/compliance-status
- Check Swiss legal compliance status
- Response: compliance_level, certification_status, recommendations

GET /api/v1/evidence/blockchain/verify
- Verify blockchain integrity for all evidence
- Response: blockchain_status, last_verified, error_count
```

## Database Schema Requirements

### evidence_chain Table
```sql
CREATE TABLE evidence_chain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE RESTRICT,
    contract_id UUID NOT NULL REFERENCES contracts(id),
    evidence_hash VARCHAR(64) NOT NULL, -- SHA-256 of photo
    timestamp_token TEXT NOT NULL, -- RFC 3161 timestamp
    timestamp_authority VARCHAR(100) NOT NULL,
    blockchain_hash VARCHAR(64), -- Hash in blockchain if stored
    blockchain_block_number BIGINT,
    legal_fingerprint VARCHAR(128) NOT NULL UNIQUE,
    created_by UUID NOT NULL REFERENCES users(id),
    device_fingerprint JSONB, -- Device identification data
    gps_coordinates JSONB, -- Location data if available
    capture_metadata JSONB, -- Technical capture details
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_legally_sealed BOOLEAN DEFAULT false,
    sealed_at TIMESTAMPTZ,
    sealed_by UUID REFERENCES users(id)
);

CREATE UNIQUE INDEX idx_evidence_chain_photo ON evidence_chain(photo_id);
CREATE INDEX idx_evidence_chain_contract ON evidence_chain(contract_id);
CREATE INDEX idx_evidence_chain_hash ON evidence_chain(evidence_hash);
CREATE INDEX idx_evidence_chain_fingerprint ON evidence_chain(legal_fingerprint);
```

### audit_trail Table
```sql
CREATE TABLE audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID NOT NULL REFERENCES evidence_chain(id),
    event_type VARCHAR(50) NOT NULL, -- 'created', 'accessed', 'verified', 'exported'
    event_description TEXT NOT NULL,
    performed_by UUID NOT NULL REFERENCES users(id),
    ip_address INET NOT NULL,
    user_agent TEXT,
    session_id VARCHAR(100),
    request_headers JSONB,
    response_status INTEGER,
    operation_duration_ms INTEGER,
    event_hash VARCHAR(64) NOT NULL, -- Hash of event data
    previous_event_hash VARCHAR(64), -- Chain of audit events
    event_signature TEXT, -- Digital signature of event
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_system_event BOOLEAN DEFAULT false
);

CREATE INDEX idx_audit_trail_evidence ON audit_trail(evidence_id);
CREATE INDEX idx_audit_trail_user ON audit_trail(performed_by);
CREATE INDEX idx_audit_trail_occurred ON audit_trail(occurred_at);
CREATE INDEX idx_audit_trail_type ON audit_trail(event_type);

-- Partition audit trail by month for performance
ALTER TABLE audit_trail PARTITION BY RANGE (occurred_at);
```

### chain_of_custody Table
```sql
CREATE TABLE chain_of_custody (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID NOT NULL REFERENCES evidence_chain(id),
    custody_event_type VARCHAR(50) NOT NULL, -- 'captured', 'transferred', 'accessed', 'exported'
    from_user_id UUID REFERENCES users(id),
    to_user_id UUID REFERENCES users(id),
    transfer_reason VARCHAR(200),
    custody_location VARCHAR(200), -- Physical or digital location
    transfer_method VARCHAR(100), -- 'system', 'export', 'legal_request'
    authorization_required BOOLEAN DEFAULT false,
    authorized_by UUID REFERENCES users(id),
    authorization_timestamp TIMESTAMPTZ,
    digital_signature TEXT NOT NULL,
    verification_hash VARCHAR(64) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_minutes INTEGER, -- How long custody was held
    notes TEXT
);

CREATE INDEX idx_chain_custody_evidence ON chain_of_custody(evidence_id);
CREATE INDEX idx_chain_custody_from_user ON chain_of_custody(from_user_id);
CREATE INDEX idx_chain_custody_to_user ON chain_of_custody(to_user_id);
CREATE INDEX idx_chain_custody_occurred ON chain_of_custody(occurred_at);
```

### legal_exports Table
```sql
CREATE TABLE legal_exports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    export_type VARCHAR(50) NOT NULL, -- 'court_package', 'insurance_claim', 'legal_discovery'
    case_reference VARCHAR(200),
    jurisdiction VARCHAR(100) NOT NULL,
    requested_by UUID NOT NULL REFERENCES users(id),
    authorized_by UUID REFERENCES users(id),
    evidence_ids UUID[] NOT NULL, -- Array of evidence_chain IDs
    export_format VARCHAR(50) NOT NULL, -- 'pdf_bundle', 'digital_package', 'forensic_image'
    language VARCHAR(10) DEFAULT 'de', -- 'de', 'fr', 'it', 'en'
    export_path VARCHAR(500),
    export_size_bytes BIGINT,
    digital_signature TEXT NOT NULL,
    verification_certificate TEXT,
    export_hash VARCHAR(64) NOT NULL,
    validity_period_days INTEGER DEFAULT 3650, -- 10 years default
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    download_count INTEGER DEFAULT 0,
    last_downloaded_at TIMESTAMPTZ,
    is_court_sealed BOOLEAN DEFAULT false,
    court_seal_reference VARCHAR(200)
);

CREATE INDEX idx_legal_exports_requested_by ON legal_exports(requested_by);
CREATE INDEX idx_legal_exports_case_ref ON legal_exports(case_reference);
CREATE INDEX idx_legal_exports_created ON legal_exports(created_at);
```

### integrity_violations Table
```sql
CREATE TABLE integrity_violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evidence_id UUID NOT NULL REFERENCES evidence_chain(id),
    violation_type VARCHAR(50) NOT NULL, -- 'hash_mismatch', 'timestamp_invalid', 'unauthorized_access'
    severity_level VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    detected_by VARCHAR(100) NOT NULL, -- System component that detected violation
    violation_details JSONB NOT NULL,
    expected_value TEXT,
    actual_value TEXT,
    investigation_status VARCHAR(20) DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'false_positive'
    investigated_by UUID REFERENCES users(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    notification_sent BOOLEAN DEFAULT false,
    legal_impact_assessment TEXT
);

CREATE INDEX idx_integrity_violations_evidence ON integrity_violations(evidence_id);
CREATE INDEX idx_integrity_violations_severity ON integrity_violations(severity_level);
CREATE INDEX idx_integrity_violations_status ON integrity_violations(investigation_status);
CREATE INDEX idx_integrity_violations_detected ON integrity_violations(detected_at);
```

## UI/UX Considerations

### Evidence Dashboard
- Real-time integrity status indicators for all photos
- Chain of custody visualization with timeline view
- Legal compliance status dashboard with Swiss law requirements
- Automated alerts for integrity violations or compliance issues

### Court Package Generation
- Wizard-style interface for creating legal evidence packages
- Template selection based on case type and jurisdiction
- Preview of generated packages before finalization
- Digital signature and authentication status indicators

### Audit Trail Interface
- Searchable and filterable audit log viewer
- Visual timeline of all evidence-related activities
- Export capabilities for legal review
- Role-based access to sensitive audit information

### Integrity Monitoring
- Real-time monitoring dashboard for system integrity
- Automated reporting of verification status
- Investigation workflow for detected violations
- Integration with alerting systems for critical issues

## Testing Scenarios

### Scenario 1: Complete Evidence Chain Creation
**Given** a photo is captured during vehicle inspection  
**When** evidence chain is established  
**Then** cryptographic timestamp is applied correctly  
**And** SHA-256 hash is generated and stored  
**And** blockchain record is created for critical evidence

### Scenario 2: Integrity Verification After Storage
**Given** photos have been stored for several months  
**When** integrity verification is performed  
**Then** all hashes match original values  
**And** timestamps are validated against authority  
**And** any discrepancies are flagged immediately

### Scenario 3: Legal Export Generation
**Given** court case requires photo evidence  
**When** legal export package is generated  
**Then** package includes all required authentication  
**And** Swiss legal compliance is verified  
**And** expert witness documentation is included

### Scenario 4: Tamper Detection
**Given** attempt is made to modify stored photo  
**When** integrity check runs  
**Then** modification is detected immediately  
**And** affected evidence is isolated  
**And** security team is alerted

### Scenario 5: Chain of Custody Tracking
**Given** photo evidence is accessed by multiple users  
**When** custody transfers occur  
**Then** all transfers are logged with authorization  
**And** complete audit trail is maintained  
**And** custody gaps are prevented

### Scenario 6: Blockchain Verification
**Given** critical evidence stored in blockchain  
**When** blockchain integrity check is performed  
**Then** all blocks validate correctly  
**And** hash chain is unbroken  
**And** digital signatures verify successfully

### Scenario 7: Long-term Archival Validation
**Given** photos archived for legal retention period  
**When** evidence validity is checked after years  
**Then** integrity remains intact  
**And** legal admissibility is maintained  
**And** format compatibility is preserved

### Scenario 8: Multi-jurisdiction Compliance
**Given** evidence may be used in different jurisdictions  
**When** compliance status is assessed  
**Then** Swiss, EU, and international standards are met  
**And** proper documentation exists for each jurisdiction  
**And** expert witness support is available

## Definition of Done

- [ ] RFC 3161 compliant timestamping system implemented
- [ ] Immutable storage system with WORM compliance
- [ ] Comprehensive audit trail with tamper-evident logging
- [ ] SHA-256 hash verification system operational
- [ ] Digital chain of custody tracking functional
- [ ] Tamper detection with immediate alerting
- [ ] Legal export capabilities for Swiss court system
- [ ] Swiss legal compliance validated by legal experts
- [ ] Multi-factor authentication for evidence operations
- [ ] Backup and recovery with integrity preservation
- [ ] Expert witness support documentation generated
- [ ] Long-term archival system tested and validated
- [ ] Blockchain integration for critical evidence functional
- [ ] All API endpoints implemented and secured
- [ ] Database schema optimized for evidence integrity
- [ ] User interfaces for evidence management tested
- [ ] Integration with existing photo systems completed
- [ ] Security testing passed for all evidence operations
- [ ] Legal review completed for Swiss court admissibility
- [ ] Performance testing under evidence verification load
- [ ] Disaster recovery procedures validated for evidence preservation
- [ ] Documentation completed for legal and technical teams
- [ ] Staff training materials created for evidence procedures

## Estimated Effort
**8 Story Points** (2 Developer Days)

### Breakdown:
- Cryptographic timestamping and hash system: 3 points
- Blockchain integration and immutable storage: 2 points
- Audit trail and chain of custody: 2 points
- Legal compliance and export capabilities: 1 point

### Dependencies:
- Photo storage system (Story 5) completed
- Legal review of Swiss evidence requirements
- Cryptographic library selection and security audit
- Blockchain infrastructure setup (if using distributed ledger)
- Swiss timestamping authority integration
- Legal expert consultation for court admissibility requirements
- Security infrastructure for digital signatures
- Long-term storage planning for evidence retention