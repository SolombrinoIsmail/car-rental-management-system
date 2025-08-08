# Story 5: Photo Storage & Retrieval

## Story ID

**Epic 7 - Story 5**

## User Story Statement

**As a** system administrator  
**I want to** efficiently store, organize, and retrieve photos with intelligent compression and
backup systems  
**So that** system performance is maintained, storage costs are optimized, and photos are always
available when needed

## Detailed Acceptance Criteria

1. **Intelligent Image Compression**
   - Automatic compression based on photo type and usage patterns
   - Target maximum 500KB per vehicle photo while maintaining quality
   - Document photos compressed to 200KB with high text readability
   - Lossless compression for legal evidence requirements

2. **Hierarchical Storage Organization**
   - Organize photos by contract ID and capture date
   - Separate directories for pickup, return, and inspection photos
   - Archive older photos to cost-effective cold storage
   - Maintain quick access index for recent photos (<90 days)

3. **Fast Retrieval Performance**
   - Photo retrieval under 2 seconds for recent photos
   - Search by contract ID, date range, or vehicle VIN
   - Thumbnail generation for quick preview
   - Lazy loading for photo galleries with large sets

4. **Automated Backup System**
   - Daily incremental backups to separate storage location
   - Weekly full backups with verification
   - Geographic redundancy with Swiss data residency
   - Automatic backup health monitoring and alerting

5. **Retention Policy Management**
   - Configurable retention periods by photo type
   - Automatic archival of photos after rental completion
   - Legal hold capability for dispute or legal proceedings
   - Secure deletion after retention period expires

6. **Storage Monitoring & Analytics**
   - Real-time storage usage monitoring
   - Growth prediction and capacity planning
   - Cost optimization recommendations
   - Performance metrics and alerting

7. **Content Delivery Optimization**
   - Multiple image sizes (thumbnail, preview, full resolution)
   - Progressive loading for large photo sets
   - Caching strategy for frequently accessed photos
   - Optional CDN integration for faster global access

8. **Data Integrity Assurance**
   - Checksum verification for all stored photos
   - Regular integrity checks with corruption detection
   - Automatic healing from backup copies
   - Blockchain-based integrity chain for legal evidence

9. **Scalable Architecture**
   - Support for horizontal scaling as photo volume grows
   - Efficient metadata indexing for fast searches
   - Load balancing for concurrent access
   - Database partitioning by date for performance

10. **Disaster Recovery**
    - Complete system recovery within 4 hours
    - Point-in-time recovery for data corruption scenarios
    - Cross-region replication for business continuity
    - Regular disaster recovery testing and validation

11. **Access Control Integration**
    - Role-based access to photo collections
    - Audit logging for all photo access operations
    - Secure API endpoints with authentication
    - Privacy controls for sensitive customer photos

12. **Migration & Import Tools**
    - Bulk import tools for existing photo collections
    - Format conversion and standardization
    - Migration from legacy storage systems
    - Data validation and quality assessment during import

## Technical Implementation Notes

### Storage Architecture

- **StorageManager.js**: Core storage operations and abstraction layer
- **CompressionEngine.js**: Intelligent image compression algorithms
- **BackupScheduler.js**: Automated backup and verification system
- **RetrievalOptimizer.js**: Fast search and caching management

### File System Structure

```
/storage/photos/
├── active/
│   ├── YYYY/MM/
│   │   ├── {contract-id}/
│   │   │   ├── pickup/
│   │   │   │   ├── vehicle/
│   │   │   │   │   ├── {photo-id}_original.jpg
│   │   │   │   │   ├── {photo-id}_compressed.webp
│   │   │   │   │   └── {photo-id}_thumbnail.jpg
│   │   │   │   └── documents/
│   │   │   └── return/
│   │   │       └── vehicle/
│   │   └── metadata/
│   │       └── {date}_index.json
├── archive/
│   └── YYYY/
│       └── {contract-id}.tar.gz
└── backups/
    ├── incremental/
    └── full/
```

### Compression Algorithm

```javascript
class IntelligentCompressor {
  async compressPhoto(photo, targetSizeKB, quality = 'auto') {
    const metadata = await this.analyzeImage(photo);

    // Determine optimal compression based on content
    const compressionConfig = this.getCompressionConfig(metadata, targetSizeKB);

    if (metadata.isDocument) {
      // Prioritize text readability
      return await this.compressDocument(photo, compressionConfig);
    } else if (metadata.hasFineDamageDetails) {
      // Maintain detail for damage assessment
      return await this.compressWithDetailPreservation(photo, compressionConfig);
    } else {
      // Standard vehicle photo compression
      return await this.compressStandard(photo, compressionConfig);
    }
  }

  getCompressionConfig(metadata, targetSizeKB) {
    const baseConfig = {
      format: metadata.supportsWebP ? 'webp' : 'jpeg',
      quality: 0.85,
      maxWidth: 1920,
      maxHeight: 1080,
    };

    // Adjust based on content analysis
    if (metadata.isDocument) {
      baseConfig.quality = 0.95; // Higher quality for text
      baseConfig.format = 'jpeg'; // Better text compatibility
    }

    return this.optimizeForSize(baseConfig, targetSizeKB);
  }
}
```

### Retrieval Optimization

```typescript
interface PhotoQuery {
  contractId?: string;
  dateRange?: { start: Date; end: Date };
  vehicleVin?: string;
  photoType?: 'pickup' | 'return' | 'inspection';
  includeArchived?: boolean;
}

class PhotoRetrieval {
  async searchPhotos(query: PhotoQuery, limit = 50): Promise<PhotoResult[]> {
    // Use database index for fast initial filtering
    const indexResults = await this.searchIndex(query, limit * 2);

    // Verify file existence and generate access URLs
    const validResults = await this.validateAndPrepareResults(indexResults);

    // Generate thumbnails on-demand if not cached
    await this.ensureThumbnails(validResults);

    return validResults.slice(0, limit);
  }

  async getPhotoStream(
    photoId: string,
    size: 'thumbnail' | 'preview' | 'full',
  ): Promise<ReadableStream> {
    const cacheKey = `${photoId}_${size}`;

    // Check cache first
    let stream = await this.getFromCache(cacheKey);
    if (stream) return stream;

    // Generate requested size if needed
    stream = await this.generateSizeVariant(photoId, size);

    // Cache for future requests
    await this.cacheStream(cacheKey, stream);

    return stream;
  }
}
```

## API Endpoints Needed

### Storage Operations

```
POST /api/v1/storage/photos
- Upload and store new photo
- Request: multipart/form-data with photo and metadata
- Response: photo_id, storage_path, compression_info

GET /api/v1/storage/photos/{photo_id}
- Retrieve photo by ID with size options
- Query params: size=thumbnail|preview|full
- Response: photo stream or signed URL

DELETE /api/v1/storage/photos/{photo_id}
- Soft delete photo (move to deleted folder)
- Response: deletion_timestamp, recovery_deadline

POST /api/v1/storage/photos/{photo_id}/restore
- Restore soft-deleted photo
- Response: restored photo metadata
```

### Search and Retrieval

```
GET /api/v1/storage/search
- Search photos by various criteria
- Query params: contract_id, date_from, date_to, type, limit
- Response: array of photo metadata with access URLs

GET /api/v1/storage/contracts/{contract_id}/photos
- Get all photos for specific contract
- Query params: session_type, include_thumbnails
- Response: organized photo collection

POST /api/v1/storage/photos/batch-retrieve
- Bulk retrieval of multiple photos
- Request: array of photo IDs and size preferences
- Response: batch of photo URLs or streams
```

### Storage Management

```
GET /api/v1/storage/stats
- Get storage usage statistics
- Response: total_size, photo_count, growth_rate, projections

POST /api/v1/storage/compress-batch
- Trigger batch compression of uncompressed photos
- Request: compression_profile, batch_size
- Response: job_id for tracking progress

GET /api/v1/storage/integrity-check
- Verify data integrity across storage
- Response: health_status, corruption_count, repair_actions

POST /api/v1/storage/archive
- Archive old photos to cold storage
- Request: date_cutoff, archive_options
- Response: archive_job_id, estimated_completion
```

## Database Schema Requirements

### photo_storage Table

```sql
CREATE TABLE photo_storage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
    storage_path VARCHAR(500) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    compressed_size_bytes INTEGER,
    compression_ratio DECIMAL(4,3), -- e.g., 0.250 for 25% of original
    compression_algorithm VARCHAR(50), -- 'webp_85', 'jpeg_90', etc.
    storage_tier VARCHAR(20) DEFAULT 'active', -- 'active', 'archive', 'cold'
    checksum_sha256 VARCHAR(64) NOT NULL,
    backup_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'backed_up', 'failed'
    last_accessed_at TIMESTAMPTZ,
    access_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    archived_at TIMESTAMPTZ,
    backup_verified_at TIMESTAMPTZ
);

CREATE INDEX idx_photo_storage_photo_id ON photo_storage(photo_id);
CREATE INDEX idx_photo_storage_path ON photo_storage(storage_path);
CREATE INDEX idx_photo_storage_tier ON photo_storage(storage_tier);
CREATE INDEX idx_photo_storage_checksum ON photo_storage(checksum_sha256);
CREATE INDEX idx_photo_storage_last_accessed ON photo_storage(last_accessed_at);
```

### storage_metrics Table

```sql
CREATE TABLE storage_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_date DATE NOT NULL,
    total_photos INTEGER NOT NULL DEFAULT 0,
    total_size_bytes BIGINT NOT NULL DEFAULT 0,
    active_tier_size_bytes BIGINT DEFAULT 0,
    archive_tier_size_bytes BIGINT DEFAULT 0,
    cold_tier_size_bytes BIGINT DEFAULT 0,
    average_compression_ratio DECIMAL(4,3),
    daily_upload_count INTEGER DEFAULT 0,
    daily_upload_size_bytes BIGINT DEFAULT 0,
    retrieval_requests INTEGER DEFAULT 0,
    cache_hit_rate DECIMAL(4,3), -- 0.000-1.000
    backup_success_rate DECIMAL(4,3),
    integrity_check_failures INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_storage_metrics_date ON storage_metrics(metric_date);
CREATE INDEX idx_storage_metrics_created ON storage_metrics(created_at);
```

### backup_jobs Table

```sql
CREATE TABLE backup_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_type VARCHAR(20) NOT NULL, -- 'incremental', 'full', 'verification'
    status VARCHAR(20) DEFAULT 'queued', -- 'queued', 'running', 'completed', 'failed'
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    files_processed INTEGER DEFAULT 0,
    total_files INTEGER,
    bytes_processed BIGINT DEFAULT 0,
    total_bytes BIGINT,
    backup_location VARCHAR(500),
    error_message TEXT,
    verification_passed BOOLEAN,
    retention_until DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_backup_jobs_type ON backup_jobs(job_type);
CREATE INDEX idx_backup_jobs_status ON backup_jobs(status);
CREATE INDEX idx_backup_jobs_started ON backup_jobs(started_at);
```

### photo_access_log Table

```sql
CREATE TABLE photo_access_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID NOT NULL REFERENCES photos(id),
    accessed_by UUID NOT NULL REFERENCES users(id),
    access_type VARCHAR(50) NOT NULL, -- 'view', 'download', 'thumbnail'
    ip_address INET,
    user_agent TEXT,
    response_time_ms INTEGER,
    bytes_transferred BIGINT,
    cache_hit BOOLEAN DEFAULT false,
    accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photo_access_log_photo ON photo_access_log(photo_id);
CREATE INDEX idx_photo_access_log_user ON photo_access_log(accessed_by);
CREATE INDEX idx_photo_access_log_date ON photo_access_log(accessed_at);

-- Partition by month for performance
CREATE TABLE photo_access_log_y2024m01 PARTITION OF photo_access_log
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
```

## UI/UX Considerations

### Storage Dashboard

- Visual storage usage with capacity planning charts
- Real-time upload progress indicators
- Batch operation status with detailed progress
- Storage cost optimization recommendations

### Photo Gallery Interface

- Infinite scroll with lazy loading
- Grid and list view options
- Quick filtering by date, contract, or type
- Bulk selection and operations

### Performance Indicators

- Loading states for photo retrieval
- Compression quality previews
- Cache hit rate displays
- Network usage optimization for mobile

### Admin Interface

- Storage health monitoring dashboard
- Backup status and scheduling controls
- Archive management with recovery options
- System performance metrics and alerts

## Testing Scenarios

### Scenario 1: High-Volume Photo Upload

**Given** multiple staff uploading photos simultaneously  
**When** system processes concurrent uploads  
**Then** all photos are stored successfully  
**And** compression maintains quality standards  
**And** system performance remains stable

### Scenario 2: Fast Photo Retrieval

**Given** user requests photo from recent contract  
**When** system processes retrieval request  
**Then** photo is returned within 2 seconds  
**And** appropriate size variant is served  
**And** access is logged for analytics

### Scenario 3: Storage Capacity Management

**Given** storage approaches capacity limits  
**When** automatic archival process runs  
**Then** old photos are moved to archive tier  
**And** system generates capacity warnings  
**And** performance is maintained

### Scenario 4: Backup and Recovery

**Given** scheduled backup process runs  
**When** backup completes successfully  
**Then** all photos are verified in backup  
**And** integrity checks pass  
**And** recovery testing validates backup quality

### Scenario 5: Search Performance

**Given** large photo database (100K+ photos)  
**When** user searches by contract ID  
**Then** results are returned quickly (<3 seconds)  
**And** pagination works efficiently  
**And** filters apply correctly

### Scenario 6: Compression Optimization

**Given** photos of varying types and sizes  
**When** intelligent compression is applied  
**Then** target file sizes are achieved  
**And** quality remains acceptable for use case  
**And** compression ratios are logged

### Scenario 7: Data Integrity Monitoring

**Given** regular integrity checks are scheduled  
**When** corruption is detected in stored photo  
**Then** system automatically attempts repair from backup  
**And** administrators are alerted  
**And** affected contracts are flagged

### Scenario 8: Disaster Recovery Validation

**Given** simulated storage system failure  
**When** disaster recovery procedures are executed  
**Then** photo access is restored within 4 hours  
**And** no data loss occurs  
**And** system operates normally after recovery

## Definition of Done

- [ ] Intelligent compression system implemented with quality optimization
- [ ] Hierarchical storage organization with automatic archival
- [ ] Fast photo retrieval under 2 seconds for recent photos
- [ ] Automated backup system with verification and monitoring
- [ ] Retention policy management with legal hold capabilities
- [ ] Storage monitoring dashboard with usage analytics
- [ ] Multiple image size variants generated and cached
- [ ] Data integrity checking with automatic repair capabilities
- [ ] Scalable architecture supporting growth projections
- [ ] Disaster recovery procedures tested and validated
- [ ] Role-based access control with audit logging
- [ ] Migration tools for existing photo collections
- [ ] API endpoints for all storage operations
- [ ] Database schema optimized for performance at scale
- [ ] Admin interface for storage management
- [ ] Performance optimization for concurrent access
- [ ] Unit tests covering all compression algorithms
- [ ] Integration tests for backup and recovery procedures
- [ ] Load testing for storage system under peak usage
- [ ] Security testing for access controls and data protection
- [ ] Documentation for system administration and maintenance

## Estimated Effort

**5 Story Points** (1 Developer Day)

### Breakdown:

- Storage architecture and compression: 2 points
- Backup and recovery systems: 1 point
- Performance optimization and caching: 1 point
- Monitoring and administration interface: 1 point

### Dependencies:

- Photo capture system (Story 1) completed
- Database infrastructure sizing
- Storage infrastructure setup (file system or cloud storage)
- Backup storage location configuration
- Image compression library optimization
- Monitoring and alerting infrastructure
