# 📸 Photo Documentation System Architecture

## Executive Summary
The photo documentation system is critical for legal compliance and dispute resolution. Based on user story analysis, this system must handle 12+ photos per rental with Swiss legal requirements.

## System Requirements

### Photo Capture Requirements
- **Minimum per rental:** 12 photos (8 exterior + 4 interior)
- **Maximum per rental:** 20 photos (flexibility for damage documentation)
- **Resolution:** 1920x1080 minimum, up to 4K
- **Compression:** Max 1MB per photo (from original 5-10MB)
- **Formats:** JPEG primary, HEIC support for iOS
- **Annotation:** Damage marking, text annotations, timestamps

### Legal & Compliance
- **Swiss Evidence Law:** Photo integrity verification
- **Chain of Custody:** Immutable photo metadata
- **GDPR Compliance:** Customer consent, data retention
- **Audit Trail:** Who took photo, when, where, why

## Architecture Design

### Photo Capture Flow
```
Rental Process → Photo Capture → Processing Pipeline → Storage → PDF Embedding
     ↓               ↓                ↓                 ↓           ↓
   Trigger      Camera/Upload     Compression       Supabase    Contract PDF
   Photos         API           + Validation       Storage     Generation
```

### Technical Implementation

#### Frontend Photo Capture
```typescript
// Photo capture component architecture
interface PhotoCaptureSystem {
  camera: {
    library: 'react-camera-pro';
    fallback: 'input[type="file"]';
    constraints: {
      video: {
        width: { ideal: 1920 };
        height: { ideal: 1080 };
        facingMode: 'environment';
      }
    }
  };
  
  annotation: {
    library: 'fabric.js';
    features: ['drawing', 'text', 'shapes', 'damage-markers'];
  };
  
  compression: {
    library: 'browser-image-compression';
    options: {
      maxSizeMB: 1;
      maxWidthOrHeight: 1920;
      useWebWorker: true;
    }
  };
}
```

#### Backend Processing Pipeline
```typescript
// Photo processing workflow
interface PhotoProcessor {
  validation: {
    formats: ['jpeg', 'jpg', 'png', 'heic'];
    maxSize: '10MB';
    dimensions: { min: [1280, 720], max: [4096, 3072] };
  };
  
  processing: {
    compression: 'sharp'; // Node.js image processing
    watermark: 'company-logo + timestamp';
    metadata: 'exif + custom-fields';
  };
  
  storage: {
    primary: 'supabase-storage';
    backup: 'aws-s3';
    cdn: 'cloudflare';
  };
}
```

### Database Schema

#### Photo Management Tables
```sql
-- Photo metadata table
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id),
    vehicle_id UUID REFERENCES vehicles(id),
    photo_type VARCHAR(50) NOT NULL, -- 'exterior_front', 'interior_dashboard', etc.
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    compression_ratio DECIMAL(4,2),
    taken_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    taken_by UUID REFERENCES users(id),
    device_info JSONB, -- camera model, GPS coordinates, etc.
    annotations JSONB, -- damage markers, text annotations
    hash_sha256 VARCHAR(64) NOT NULL, -- for integrity verification
    legal_status VARCHAR(20) DEFAULT 'active', -- 'active', 'deleted', 'disputed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Photo processing jobs table
CREATE TABLE photo_processing_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    photo_id UUID REFERENCES photos(id),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
    job_type VARCHAR(50) NOT NULL, -- 'compression', 'watermark', 'pdf-embed'
    input_params JSONB,
    output_data JSONB,
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_photos_contract_id ON photos(contract_id);
CREATE INDEX idx_photos_taken_at ON photos(taken_at);
CREATE INDEX idx_photos_type ON photos(photo_type);
CREATE INDEX idx_processing_jobs_status ON photo_processing_jobs(status);
```

### Photo Types & Requirements

#### Mandatory Photo Categories
```javascript
const PHOTO_REQUIREMENTS = {
  exterior: {
    required: [
      'front_view', 'rear_view', 
      'driver_side', 'passenger_side',
      'front_left_corner', 'front_right_corner',
      'rear_left_corner', 'rear_right_corner'
    ],
    optional: ['license_plate', 'damage_closeup']
  },
  
  interior: {
    required: [
      'dashboard', 'front_seats', 
      'rear_seats', 'trunk'
    ],
    optional: ['odometer', 'fuel_gauge', 'damage_interior']
  },
  
  documents: {
    required: ['customer_id', 'driver_license_front'],
    optional: ['driver_license_back', 'insurance_card']
  }
};
```

### Swiss Legal Compliance

#### Evidence Chain Features
```typescript
interface LegalCompliance {
  integrity: {
    hashing: 'SHA-256 for tamper detection';
    timestamps: 'RFC3339 with timezone';
    signatures: 'Digital signatures for staff photos';
  };
  
  retention: {
    active_contracts: '7 years (Swiss commercial law)';
    disputed_cases: '10 years + legal hold';
    gdpr_deletion: 'Customer right to deletion after retention';
  };
  
  access_control: {
    staff: 'Can view/annotate assigned rentals';
    owners: 'Can view all photos in their location';
    customers: 'Can view their own rental photos';
    legal: 'Special access for legal proceedings';
  };
}
```

### Performance Architecture

#### Photo Upload Optimization
```typescript
// Optimized upload flow
interface PhotoUploadFlow {
  client_side: {
    preview_generation: 'instant (<100ms)';
    background_upload: 'queue system with retry';
    compression: 'web worker (non-blocking)';
    progress_tracking: 'real-time upload progress';
  };
  
  server_side: {
    upload_handling: 'multipart with resumable uploads';
    processing_queue: 'background job processing';
    cdn_distribution: 'automatic CDN sync';
    thumbnail_generation: 'multiple sizes (thumb, medium, full)';
  };
}
```

#### Storage Strategy
```yaml
Storage Tiers:
  hot: # Recent photos (< 30 days)
    location: "Supabase Storage"
    cdn: "Vercel Edge Network"
    access: "< 100ms"
    
  warm: # Older photos (30 days - 2 years)  
    location: "Supabase + AWS S3"
    cdn: "CloudFlare"
    access: "< 500ms"
    
  cold: # Archive photos (> 2 years)
    location: "AWS Glacier"
    cdn: "On-demand"
    access: "< 5 minutes"
```

### Integration Points

#### PDF Generation Integration
```typescript
// Photo embedding in contracts
interface PDFPhotoEmbedding {
  layout: {
    cover_page: 'rental_summary + signatures';
    photo_section: 'organized_by_category';
    annotations: 'damage_markers + descriptions';
  };
  
  compression: {
    pdf_photos: 'JPEG 85% quality';
    max_pdf_size: '25MB per contract';
    optimization: 'progressive_jpeg';
  };
  
  legal_elements: {
    timestamps: 'visible_on_each_photo';
    signatures: 'embedded_digital_signatures';
    metadata: 'exif_data_preserved';
  };
}
```

#### Real-time Synchronization
```typescript
// Multi-device photo sync
interface PhotoSync {
  real_time: {
    protocol: 'Supabase Realtime';
    events: ['photo_captured', 'photo_processed', 'annotation_added'];
    conflict_resolution: 'last_writer_wins';
  };
  
  offline_support: {
    local_storage: 'IndexedDB for photos';
    sync_on_reconnect: 'automatic_background_sync';
    conflict_detection: 'hash_comparison';
  };
}
```

### Monitoring & Analytics

#### Photo System Metrics
```yaml
Performance Metrics:
  - photo_capture_time: "< 3 seconds average"
  - upload_completion: "< 30 seconds per photo"
  - compression_ratio: "80-90% size reduction"
  - processing_queue: "< 5 minutes per job"

Quality Metrics:
  - photo_rejection_rate: "< 2% (blurry/dark)"
  - annotation_usage: "% of photos with damage markers"
  - pdf_generation_success: "> 99.5%"

Business Metrics:
  - photos_per_rental: "12-20 average"
  - dispute_photo_usage: "% disputes using photo evidence"
  - customer_satisfaction: "photo_quality_rating"
```

## Implementation Phases

### Phase 1: Basic Photo Capture (Week 1-2)
- Camera integration
- Basic upload to Supabase
- Simple compression
- Database schema

### Phase 2: Processing Pipeline (Week 3-4)  
- Background job processing
- Watermarking
- Thumbnail generation
- CDN integration

### Phase 3: Legal Compliance (Week 5-6)
- Hash verification
- Chain of custody
- Swiss legal features
- Audit logging

### Phase 4: Advanced Features (Week 7-8)
- Annotation tools
- PDF embedding
- Real-time sync
- Performance optimization

## Security Considerations

### Photo Security
- **Access Control:** Role-based photo access
- **Encryption:** Photos encrypted at rest and in transit
- **Backup:** Multi-region backup strategy
- **Compliance:** GDPR deletion capabilities

### Privacy Protection
- **Customer Consent:** Explicit consent for photo capture
- **Data Minimization:** Only necessary photos stored
- **Anonymization:** Option to blur personal items
- **Right to Deletion:** Customer can request photo removal

---

**This architecture ensures the photo system can handle enterprise-scale operations while meeting Swiss legal requirements.**