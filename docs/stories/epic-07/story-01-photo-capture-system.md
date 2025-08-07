# Story 1: Photo Capture System

## Story ID
**Epic 7 - Story 1**

## User Story Statement
**As a** rental staff member  
**I want to** capture photos quickly and easily through device camera or file upload  
**So that** I can efficiently document vehicle condition and customer documents for legal protection and dispute prevention

## Detailed Acceptance Criteria

1. **Camera Integration**
   - System must integrate with device camera API (mobile and desktop webcam)
   - Support both front and rear cameras on mobile devices
   - Fallback to file upload if camera access denied or unavailable

2. **Vehicle Documentation**
   - Must capture minimum 4 vehicle angles (front, rear, driver side, passenger side)
   - Support additional detailed shots for existing damage
   - Enforce photo sequence to ensure complete documentation

3. **Document Capture**
   - Capture customer ID documents with auto-focus capability
   - Capture driver's license with readable text verification
   - Support passport and other identification document formats

4. **Photo Preview System**
   - Display preview immediately after capture
   - Allow zoom functionality to verify image quality
   - Show metadata information (timestamp, location if enabled)

5. **Retake Capability**
   - One-click retake option for each photo
   - Ability to replace specific photos in sequence
   - Maintain photo ordering during retakes

6. **Cross-Platform Support**
   - Responsive design for mobile devices (iOS/Android)
   - Desktop browser compatibility (Chrome, Firefox, Safari, Edge)
   - Touch-friendly interface for tablet usage

7. **Image Quality Control**
   - Minimum resolution enforcement (1080p for vehicles, 720p for documents)
   - Auto-brightness adjustment for low-light conditions
   - Blur detection with retake suggestion

8. **Temporary Storage**
   - Local browser storage during capture session
   - Auto-save draft photos every 30 seconds
   - Recovery of unsaved photos after session interruption

9. **Batch Operations**
   - Capture multiple photos in sequence without page reload
   - Progress indicator showing completion status
   - Bulk upload confirmation before saving

10. **Accessibility Features**
    - Voice instructions for photo capture sequence
    - High contrast mode for low-vision users
    - Keyboard navigation for camera controls

11. **Performance Requirements**
    - Photo capture response time under 3 seconds
    - Preview generation under 2 seconds
    - Support for capturing up to 20 photos per session

12. **Error Handling**
    - Clear error messages for camera access issues
    - Graceful degradation to file upload on camera failure
    - Automatic retry mechanism for failed captures

## Technical Implementation Notes

### Frontend Components
- **CameraCapture.vue**: Main camera interface component
- **PhotoPreview.vue**: Image preview with zoom/rotate functionality
- **DocumentCapture.vue**: Specialized interface for document photography
- **PhotoSequence.vue**: Guided photo capture workflow

### Camera API Integration
```javascript
// Camera access with fallback
const constraints = {
  video: { 
    width: { ideal: 1920 }, 
    height: { ideal: 1080 },
    facingMode: 'environment' // rear camera preferred
  }
}
await navigator.mediaDevices.getUserMedia(constraints)
```

### Image Processing
- Canvas API for image manipulation
- WebP format with JPEG fallback
- Client-side compression before upload
- EXIF data preservation for legal evidence

## API Endpoints Needed

### Photo Capture Endpoints
```
POST /api/v1/photos/capture
- Upload captured photo with metadata
- Request: multipart/form-data with image file
- Response: photo_id, url, metadata

GET /api/v1/photos/session/{session_id}
- Retrieve photos from current capture session
- Response: array of photo objects

POST /api/v1/photos/session/complete
- Finalize photo capture session
- Move photos from temporary to permanent storage

DELETE /api/v1/photos/{photo_id}
- Remove photo from session (before finalization)
- Soft delete with recovery option
```

### Device Capability Endpoints
```
GET /api/v1/device/camera-support
- Check camera API availability
- Return supported resolutions and features

POST /api/v1/device/upload-fallback
- Alternative upload for devices without camera access
```

## Database Schema Requirements

### photos Table
```sql
CREATE TABLE photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    session_id UUID NOT NULL,
    photo_type VARCHAR(50) NOT NULL, -- 'vehicle_front', 'vehicle_rear', 'id_document', etc.
    sequence_number INTEGER NOT NULL,
    original_filename VARCHAR(255),
    stored_filename VARCHAR(255) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(50) NOT NULL,
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    capture_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    captured_by UUID NOT NULL REFERENCES users(id),
    device_info JSONB, -- browser, OS, camera specs
    location_data JSONB, -- GPS if available
    checksum VARCHAR(64) NOT NULL, -- SHA-256 for integrity
    is_temporary BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photos_contract_id ON photos(contract_id);
CREATE INDEX idx_photos_session_id ON photos(session_id);
CREATE INDEX idx_photos_type ON photos(photo_type);
```

### photo_sessions Table
```sql
CREATE TABLE photo_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    session_type VARCHAR(50) NOT NULL, -- 'pickup', 'return', 'inspection'
    status VARCHAR(20) NOT NULL DEFAULT 'in_progress', -- 'in_progress', 'completed', 'cancelled'
    started_by UUID NOT NULL REFERENCES users(id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    total_photos INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## UI/UX Considerations

### Mobile-First Design
- Large touch targets for camera controls (minimum 44px)
- Swipe gestures for photo navigation
- Portrait/landscape orientation support
- Bottom sheet modal for photo options

### Visual Feedback
- Camera viewfinder with grid lines for composition
- Capture animation with sound feedback
- Progress indicators for upload status
- Success/error states with appropriate icons

### Guided Workflow
- Step-by-step photo capture checklist
- Visual prompts showing required vehicle angles
- Auto-advance to next photo type after capture
- Skip options for optional photos

### Accessibility
- Screen reader support for all camera controls
- High contrast mode for low-light environments
- Voice guidance for photo sequence
- Alternative text for all UI elements

## Testing Scenarios

### Scenario 1: Happy Path Mobile Capture
**Given** a staff member is on mobile device with camera access  
**When** they capture required vehicle photos in sequence  
**Then** all photos are captured successfully with proper metadata  
**And** preview functionality works correctly  
**And** photos are saved to temporary storage

### Scenario 2: Camera Permission Denied
**Given** a user denies camera permission  
**When** they attempt to capture photos  
**Then** system displays fallback file upload option  
**And** file upload works with same validation rules  
**And** user can complete photo documentation

### Scenario 3: Poor Lighting Conditions
**Given** a user captures photos in low light  
**When** image quality is below threshold  
**Then** system suggests retake with flash  
**And** provides lighting tips  
**And** allows override if necessary

### Scenario 4: Network Interruption
**Given** photos are being uploaded  
**When** network connection is lost  
**Then** photos remain in local storage  
**And** upload resumes when connection restored  
**And** no data is lost during interruption

### Scenario 5: Multiple Device Types
**Given** different devices (iPhone, Android, desktop)  
**When** accessing photo capture functionality  
**Then** interface adapts appropriately  
**And** core functionality works consistently  
**And** device-specific features are utilized

### Scenario 6: Large File Handling
**Given** high-resolution photos are captured  
**When** file size exceeds normal limits  
**Then** automatic compression is applied  
**And** quality remains acceptable  
**And** upload completes within timeout limits

### Scenario 7: Batch Photo Operations
**Given** multiple photos need to be captured  
**When** user captures photos in sequence  
**Then** all photos are tracked correctly  
**And** batch operations complete successfully  
**And** session state is maintained

### Scenario 8: Error Recovery
**Given** photo capture fails due to technical error  
**When** user attempts retry  
**Then** system recovers gracefully  
**And** previously captured photos are preserved  
**And** clear error messages are displayed

## Definition of Done

- [ ] Camera API integration working on all target devices
- [ ] Photo capture workflow tested on iOS, Android, and desktop
- [ ] File upload fallback implemented and tested
- [ ] Photo preview with zoom functionality operational
- [ ] Temporary storage system implemented
- [ ] All API endpoints created and documented
- [ ] Database schema deployed to all environments
- [ ] UI/UX tested with real users
- [ ] Error handling covers all identified scenarios
- [ ] Performance meets specified response times
- [ ] Accessibility features implemented
- [ ] Unit tests achieve 90% code coverage
- [ ] Integration tests cover all happy path scenarios
- [ ] Load testing completed for concurrent photo uploads
- [ ] Documentation updated for staff training

## Estimated Effort
**8 Story Points** (2 Developer Days)

### Breakdown:
- Frontend camera integration: 3 points
- API development: 2 points
- Database schema: 1 point
- Testing and validation: 2 points

### Dependencies:
- Camera API compatibility research
- File storage infrastructure setup
- Image processing library selection
- Mobile device testing environment