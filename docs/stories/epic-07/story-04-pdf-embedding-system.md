# Story 4: PDF Embedding System

## Story ID
**Epic 7 - Story 4**

## User Story Statement
**As a** rental staff member  
**I want to** automatically embed photos with annotations into rental contracts and reports  
**So that** all documentation is complete, legally compliant, and professionally presented in a single PDF document

## Detailed Acceptance Criteria

1. **Automatic Photo Integration**
   - Embed all captured photos into contract PDFs automatically
   - Include photos at appropriate sections (vehicle condition, customer documents)
   - Maintain chronological order of photo capture
   - Support both pickup and return photo sets in same document

2. **Annotation Preservation**
   - Render all photo annotations in PDF format
   - Maintain annotation colors, text, and positioning accuracy
   - Include annotation legends explaining damage marking system
   - Preserve annotation metadata (author, timestamp, damage type)

3. **Image Optimization**
   - Compress images for optimal PDF file size without quality loss
   - Target maximum 2MB total file size for complete contract
   - Maintain minimum 300 DPI resolution for legal document standards
   - Smart compression based on photo content (documents vs. vehicle photos)

4. **Layout Management**
   - Professional document layout with proper photo positioning
   - Automatic page breaks and photo sizing to fit document flow
   - Header/footer integration with photo metadata
   - Consistent spacing and alignment throughout document

5. **Photo Metadata Inclusion**
   - Embed capture timestamp, device info, and GPS coordinates
   - Include photographer identification for legal evidence chain
   - Add photo sequence numbers and total count
   - Preserve original file checksums for integrity verification

6. **Multiple Format Support**
   - Generate high-resolution PDF for legal archival (PDF/A-1b compliant)
   - Create compressed version for email distribution
   - Support individual photo extraction from PDF
   - Export options for different use cases (court, insurance, customer)

7. **Template Integration**
   - Use predefined contract templates with photo placeholders
   - Support multiple template types (standard rental, luxury vehicle, commercial)
   - Dynamic template selection based on vehicle type or contract value
   - Customizable branding and company logo integration

8. **Quality Assurance**
   - Validate photo resolution and quality before embedding
   - Check for missing required photos and alert staff
   - Verify annotation readability in PDF format
   - Generate quality report for document completeness

9. **Batch Processing**
   - Process multiple contracts with photos simultaneously
   - Queue system for large volume processing
   - Progress tracking and status notifications
   - Error handling and retry mechanisms for failed processes

10. **Legal Compliance Features**
    - Digital signature integration for photo authenticity
    - Tamper-evident PDF generation with security features
    - Audit trail embedded in PDF metadata
    - Swiss legal standard compliance for evidence documents

11. **Performance Optimization**
    - Fast PDF generation (<10 seconds for complete contract)
    - Efficient memory usage during processing
    - Caching of processed templates and layouts
    - Asynchronous processing for large photo sets

12. **Version Control**
    - Track PDF document versions with embedded photos
    - Maintain history of photo additions or modifications
    - Support re-generation of PDFs with updated photos
    - Archive original photos separately from PDF versions

## Technical Implementation Notes

### PDF Generation Architecture
- **PDFGenerator.js**: Core PDF creation with photo embedding
- **PhotoProcessor.js**: Image optimization and preparation
- **TemplateManager.js**: Dynamic template selection and layout
- **MetadataEmbedder.js**: Photo and document metadata handling

### PDF Library Integration
```javascript
// Using PDF-lib for advanced PDF generation
import { PDFDocument, rgb } from 'pdf-lib'

class ContractPDFGenerator {
  async generateWithPhotos(contractData, photos, annotations) {
    const pdfDoc = await PDFDocument.create()
    
    // Add photos with annotations
    for (const photo of photos) {
      const page = pdfDoc.addPage()
      const imageBytes = await this.optimizeImage(photo)
      const image = await pdfDoc.embedJpg(imageBytes)
      
      // Scale image to fit page while maintaining aspect ratio
      const { width, height } = this.calculateDimensions(image, page)
      page.drawImage(image, { x: 50, y: 50, width, height })
      
      // Render annotations on top of image
      await this.renderAnnotations(page, annotations[photo.id], image)
    }
    
    return pdfDoc.save()
  }
  
  async optimizeImage(photo, targetSizeKB = 200) {
    // Smart compression based on photo content
    const quality = photo.type === 'document' ? 0.95 : 0.85
    return await this.compressImage(photo, quality, targetSizeKB)
  }
}
```

### Image Processing Pipeline
```typescript
interface PhotoEmbeddingConfig {
  maxWidth: number
  maxHeight: number
  compressionQuality: number
  targetFileSizeKB: number
  maintainAspectRatio: boolean
}

class PhotoProcessor {
  async prepareForPDF(photo: Photo, config: PhotoEmbeddingConfig): Promise<ProcessedPhoto> {
    let processedImage = await this.loadImage(photo.path)
    
    // Resize if needed
    if (this.needsResizing(processedImage, config)) {
      processedImage = await this.resizeImage(processedImage, config)
    }
    
    // Apply compression
    processedImage = await this.compressImage(processedImage, config)
    
    // Add metadata
    const metadata = this.extractMetadata(photo)
    
    return {
      imageData: processedImage,
      metadata: metadata,
      finalSize: processedImage.length
    }
  }
}
```

## API Endpoints Needed

### PDF Generation
```
POST /api/v1/contracts/{contract_id}/generate-pdf
- Generate complete contract PDF with photos
- Request: template_type, include_annotations, compression_level
- Response: pdf_url, file_size, generation_time

GET /api/v1/contracts/{contract_id}/pdf-status
- Check PDF generation status for async processing
- Response: status, progress_percentage, estimated_completion

POST /api/v1/contracts/{contract_id}/regenerate-pdf
- Regenerate PDF with updated photos or annotations
- Request: reason, updated_photo_ids
- Response: new_pdf_version, changes_summary

GET /api/v1/contracts/{contract_id}/pdf-versions
- List all PDF versions generated for contract
- Response: array of PDF version objects with metadata
```

### Template Management
```
GET /api/v1/pdf-templates
- Retrieve available PDF templates
- Response: array of template objects

POST /api/v1/pdf-templates/{template_id}/preview
- Generate preview of contract with template and sample photos
- Request: sample_data, photo_ids
- Response: preview_pdf_url

PUT /api/v1/pdf-templates/{template_id}
- Update PDF template configuration
- Request: template_data, layout_config
- Response: updated template object
```

## Database Schema Requirements

### contract_pdfs Table
```sql
CREATE TABLE contract_pdfs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    pdf_version INTEGER NOT NULL DEFAULT 1,
    template_id UUID NOT NULL REFERENCES pdf_templates(id),
    file_path VARCHAR(500) NOT NULL,
    file_size_bytes INTEGER NOT NULL,
    total_photos INTEGER NOT NULL DEFAULT 0,
    photos_with_annotations INTEGER DEFAULT 0,
    compression_ratio DECIMAL(4,2), -- e.g., 0.25 for 25% of original size
    generation_duration_ms INTEGER,
    quality_score DECIMAL(3,2), -- 0.00-1.00 quality assessment
    is_legal_compliant BOOLEAN DEFAULT true,
    generated_by UUID NOT NULL REFERENCES users(id),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    checksum VARCHAR(64) NOT NULL, -- SHA-256 for integrity
    metadata JSONB, -- generation parameters, photo IDs, etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contract_pdfs_contract ON contract_pdfs(contract_id);
CREATE INDEX idx_contract_pdfs_version ON contract_pdfs(contract_id, pdf_version);
CREATE UNIQUE INDEX idx_contract_pdfs_current ON contract_pdfs(contract_id) 
    WHERE pdf_version = (SELECT MAX(pdf_version) FROM contract_pdfs cp2 WHERE cp2.contract_id = contract_pdfs.contract_id);
```

### pdf_templates Table
```sql
CREATE TABLE pdf_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    template_file_path VARCHAR(500) NOT NULL,
    vehicle_category VARCHAR(50), -- 'standard', 'luxury', 'commercial'
    layout_config JSONB NOT NULL, -- photo positions, sizes, page breaks
    default_compression_quality DECIMAL(3,2) DEFAULT 0.85,
    max_file_size_mb INTEGER DEFAULT 2,
    is_active BOOLEAN DEFAULT true,
    legal_compliance_level VARCHAR(20) DEFAULT 'standard', -- 'standard', 'court', 'archive'
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pdf_templates_category ON pdf_templates(vehicle_category);
CREATE INDEX idx_pdf_templates_active ON pdf_templates(is_active);
```

### pdf_photo_embeddings Table
```sql
CREATE TABLE pdf_photo_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_pdf_id UUID NOT NULL REFERENCES contract_pdfs(id) ON DELETE CASCADE,
    photo_id UUID NOT NULL REFERENCES photos(id),
    page_number INTEGER NOT NULL,
    position_x INTEGER NOT NULL, -- PDF coordinates
    position_y INTEGER NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    original_file_size INTEGER NOT NULL,
    compressed_file_size INTEGER NOT NULL,
    compression_ratio DECIMAL(4,2),
    embedded_annotations_count INTEGER DEFAULT 0,
    embedding_quality DECIMAL(3,2), -- quality assessment 0.00-1.00
    processing_duration_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pdf_embeddings_contract_pdf ON pdf_photo_embeddings(contract_pdf_id);
CREATE INDEX idx_pdf_embeddings_photo ON pdf_photo_embeddings(photo_id);
```

### pdf_generation_queue Table
```sql
CREATE TABLE pdf_generation_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    priority INTEGER DEFAULT 5, -- 1-10, higher = more urgent
    status VARCHAR(20) DEFAULT 'queued', -- 'queued', 'processing', 'completed', 'failed'
    template_id UUID NOT NULL REFERENCES pdf_templates(id),
    generation_params JSONB, -- compression, photo selection, etc.
    assigned_worker VARCHAR(100), -- worker process handling the job
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    retry_count INTEGER DEFAULT 0,
    max_retries INTEGER DEFAULT 3,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pdf_queue_status ON pdf_generation_queue(status);
CREATE INDEX idx_pdf_queue_priority ON pdf_generation_queue(priority DESC, created_at ASC);
```

## UI/UX Considerations

### PDF Generation Interface
- Progress indicator showing generation stages
- Real-time preview during generation process
- Quality slider for compression vs. file size trade-off
- Template selection with visual previews

### Embedded Photo Layout
- Drag-and-drop interface for photo positioning in templates
- Visual guides for optimal photo placement
- Automatic layout suggestions based on photo count
- Preview mode showing final PDF appearance

### Quality Control Dashboard
- Visual quality assessment with before/after comparisons
- File size optimization recommendations
- Compliance status indicators
- Batch processing status with error reporting

### Mobile Considerations
- Simplified PDF generation interface for mobile
- Quick template selection optimized for touch
- Progress notifications for background processing
- Mobile-optimized PDF viewer for generated documents

## Testing Scenarios

### Scenario 1: Standard Contract PDF Generation
**Given** a complete rental contract with pickup and return photos  
**When** staff generates PDF with annotations  
**Then** PDF is created with all photos properly embedded  
**And** file size is under 2MB  
**And** annotations are clearly visible and readable

### Scenario 2: High-Volume Batch Processing
**Given** multiple contracts need PDF generation simultaneously  
**When** batch processing is initiated  
**Then** all PDFs are generated without errors  
**And** processing completes within reasonable time limits  
**And** system performance remains stable

### Scenario 3: Template Customization
**Given** different vehicle categories require different templates  
**When** PDF is generated for luxury vehicle  
**Then** appropriate template is automatically selected  
**And** layout accommodates additional photos  
**And** branding elements are properly positioned

### Scenario 4: Photo Quality Optimization
**Given** mix of high and low resolution photos  
**When** PDF generation processes all photos  
**Then** compression is optimized for each photo type  
**And** document photos maintain high readability  
**And** overall file size stays within limits

### Scenario 5: Legal Compliance Validation
**Given** PDF needs to meet Swiss legal standards  
**When** generation includes legal compliance mode  
**Then** PDF includes all required metadata  
**And** digital signatures are properly embedded  
**And** tamper-evident features are active

### Scenario 6: Error Recovery
**Given** PDF generation fails due to corrupted photo  
**When** system attempts retry  
**Then** problematic photos are identified and skipped  
**And** partial PDF is generated with available photos  
**And** clear error report is provided

### Scenario 7: Version Management
**Given** contract needs updated PDF with new photos  
**When** regeneration is requested  
**Then** new version is created maintaining history  
**And** changes are clearly documented  
**And** original version remains accessible

### Scenario 8: Performance Under Load
**Given** peak usage with multiple simultaneous PDF generations  
**When** system processes queue  
**Then** response times remain acceptable  
**And** memory usage stays within limits  
**And** queue processing is fair and efficient

## Definition of Done

- [ ] PDF generation engine with photo embedding capability
- [ ] Image compression optimized for legal document quality
- [ ] Template system supporting multiple contract types
- [ ] Annotation rendering in PDF format maintaining accuracy
- [ ] Metadata embedding for legal compliance and evidence chain
- [ ] Batch processing system with queue management
- [ ] Quality assurance validation before PDF finalization
- [ ] Performance optimization for large photo sets
- [ ] Legal compliance features for Swiss standards
- [ ] Version control and document history tracking
- [ ] Error handling and recovery mechanisms
- [ ] API endpoints for PDF operations implemented
- [ ] Database schema for tracking PDF generations
- [ ] User interface for PDF generation and preview
- [ ] Mobile optimization for PDF generation features
- [ ] Unit tests covering PDF generation algorithms
- [ ] Integration tests with real contract and photo data
- [ ] Load testing for concurrent PDF generation
- [ ] Security testing for tamper-evident features
- [ ] Documentation for template customization and maintenance

## Estimated Effort
**8 Story Points** (2 Developer Days)

### Breakdown:
- PDF generation engine: 3 points
- Image optimization and embedding: 2 points
- Template system and layout: 2 points
- Legal compliance and metadata: 1 point

### Dependencies:
- Photo capture system (Story 1) completed
- Photo annotation tools (Story 2) completed
- PDF generation library selection (PDF-lib, jsPDF, or similar)
- Contract template designs
- Image compression library
- Digital signature integration capability