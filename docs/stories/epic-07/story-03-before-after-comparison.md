# Story 3: Before/After Comparison

## Story ID
**Epic 7 - Story 3**

## User Story Statement
**As a** rental staff member  
**I want to** compare vehicle pickup and return photos side-by-side with synchronized controls  
**So that** I can quickly identify new damage and generate accurate damage reports for billing

## Detailed Acceptance Criteria

1. **Side-by-Side Display**
   - Display pickup and return photos in parallel view
   - Automatic matching of corresponding vehicle angles
   - Maintain aspect ratio consistency between photo pairs
   - Support full-screen comparison mode for detailed inspection

2. **Synchronized Navigation**
   - Zoom controls affect both photos simultaneously
   - Pan operations move both photos together
   - Coordinated scrolling for photo sets with multiple angles
   - Linked rotation controls for orientation matching

3. **Difference Highlighting**
   - Automatic detection of potential differences between photos
   - Visual highlighting of areas with significant changes
   - Adjustable sensitivity threshold for difference detection
   - False positive filtering for lighting/angle variations

4. **Toggle Functionality**
   - Quick toggle between pickup and return views
   - Overlay mode showing differences as colored highlights
   - Split-view with adjustable divider position
   - Animation effects for smooth transitions

5. **New Damage Documentation**
   - Click-to-mark new damage areas directly on comparison view
   - Automatic annotation creation with "new damage" classification
   - Integration with existing annotation tools
   - Damage severity assessment interface

6. **Report Generation**
   - Automated damage report creation from comparison results
   - Include before/after photo pairs with highlighted differences
   - Cost estimation integration for identified damage
   - PDF export with detailed findings

7. **Smart Matching Algorithm**
   - Intelligent pairing of photos based on vehicle angle
   - Handle cases where return photos don't exactly match pickup angles
   - Alternative photo suggestion when direct match unavailable
   - Manual override for photo pairing

8. **Performance Optimization**
   - Fast loading of photo pairs (<3 seconds)
   - Efficient difference calculation algorithms
   - Caching of comparison results
   - Progressive loading for large photo sets

9. **Quality Assessment**
   - Photo quality comparison between pickup and return
   - Warning for photos with significant quality differences
   - Lighting condition normalization
   - Automatic brightness/contrast adjustment for better comparison

10. **Historical Comparison**
    - Compare with previous rental return photos
    - Track damage progression over time
    - Integration with vehicle maintenance history
    - Pattern recognition for recurring damage areas

11. **Mobile Optimization**
    - Touch-friendly comparison interface
    - Swipe gestures for photo navigation
    - Responsive layout for smartphone screens
    - Optimized image loading for mobile data usage

12. **Audit Trail**
    - Log all comparison activities and decisions
    - Track staff member who performed comparison
    - Timestamp all damage identifications
    - Maintain change history for legal evidence

## Technical Implementation Notes

### Frontend Architecture
- **PhotoComparison.vue**: Main comparison interface component
- **SynchronizedViewer.vue**: Dual photo viewer with sync controls
- **DifferenceDetection.vue**: Difference highlighting overlay
- **ComparisonReport.vue**: Report generation and export

### Image Comparison Algorithm
```javascript
// Computer vision approach using canvas pixel comparison
class ImageComparator {
  async compareImages(image1, image2, threshold = 0.1) {
    const canvas1 = this.getCanvas(image1)
    const canvas2 = this.getCanvas(image2)
    
    const ctx1 = canvas1.getContext('2d')
    const ctx2 = canvas2.getContext('2d')
    
    const data1 = ctx1.getImageData(0, 0, canvas1.width, canvas1.height)
    const data2 = ctx2.getImageData(0, 0, canvas2.width, canvas2.height)
    
    return this.pixelDifference(data1, data2, threshold)
  }
  
  pixelDifference(data1, data2, threshold) {
    const diff = []
    for (let i = 0; i < data1.data.length; i += 4) {
      const r1 = data1.data[i], g1 = data1.data[i+1], b1 = data1.data[i+2]
      const r2 = data2.data[i], g2 = data2.data[i+1], b2 = data2.data[i+2]
      
      const distance = Math.sqrt((r1-r2)² + (g1-g2)² + (b1-b2)²)
      if (distance > threshold * 255) {
        diff.push({ index: i/4, distance })
      }
    }
    return diff
  }
}
```

### Synchronized Controls Implementation
```typescript
interface ComparisonState {
  zoom: number
  panX: number
  panY: number
  rotation: number
  selectedPhoto: 'pickup' | 'return'
}

class SynchronizedController {
  private state: ComparisonState = {
    zoom: 1,
    panX: 0,
    panY: 0,
    rotation: 0,
    selectedPhoto: 'pickup'
  }
  
  updateZoom(newZoom: number) {
    this.state.zoom = newZoom
    this.syncBothViews()
  }
  
  updatePan(deltaX: number, deltaY: number) {
    this.state.panX += deltaX
    this.state.panY += deltaY
    this.syncBothViews()
  }
}
```

## API Endpoints Needed

### Comparison Operations
```
POST /api/v1/contracts/{contract_id}/photo-comparison
- Initiate comparison between pickup and return photos
- Request: pickup_session_id, return_session_id
- Response: comparison_id, matched_pairs, suggestions

GET /api/v1/photo-comparison/{comparison_id}
- Retrieve comparison results and cached data
- Response: comparison object with difference data

POST /api/v1/photo-comparison/{comparison_id}/differences
- Save identified differences and new damage
- Request: array of difference objects with coordinates
- Response: created damage records

GET /api/v1/photo-comparison/{comparison_id}/report
- Generate comparison report
- Response: PDF report or structured report data

PUT /api/v1/photo-comparison/{comparison_id}/photo-pairs
- Update photo pairing manually
- Request: array of photo pair mappings
- Response: updated comparison configuration
```

### Smart Matching
```
POST /api/v1/photos/smart-match
- Get AI-suggested photo pairings
- Request: pickup_photos[], return_photos[]
- Response: suggested_pairs[], confidence_scores[]

POST /api/v1/photos/analyze-differences
- Run difference detection algorithm
- Request: photo1_id, photo2_id, sensitivity
- Response: difference_areas[], confidence_scores[]
```

## Database Schema Requirements

### photo_comparisons Table
```sql
CREATE TABLE photo_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID NOT NULL REFERENCES contracts(id),
    pickup_session_id UUID NOT NULL REFERENCES photo_sessions(id),
    return_session_id UUID NOT NULL REFERENCES photo_sessions(id),
    comparison_status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'reviewed'
    performed_by UUID NOT NULL REFERENCES users(id),
    algorithm_version VARCHAR(20) NOT NULL,
    sensitivity_threshold DECIMAL(3,2) DEFAULT 0.10,
    total_differences INTEGER DEFAULT 0,
    new_damage_count INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photo_comparisons_contract ON photo_comparisons(contract_id);
CREATE INDEX idx_photo_comparisons_status ON photo_comparisons(comparison_status);
```

### photo_pairs Table
```sql
CREATE TABLE photo_pairs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comparison_id UUID NOT NULL REFERENCES photo_comparisons(id) ON DELETE CASCADE,
    pickup_photo_id UUID NOT NULL REFERENCES photos(id),
    return_photo_id UUID NOT NULL REFERENCES photos(id),
    vehicle_angle VARCHAR(50) NOT NULL, -- 'front', 'rear', 'driver_side', etc.
    matching_confidence DECIMAL(3,2), -- AI confidence score 0.00-1.00
    is_manual_pair BOOLEAN DEFAULT false,
    pair_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'analyzed', 'reviewed'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_photo_pairs_comparison ON photo_pairs(comparison_id);
CREATE UNIQUE INDEX idx_photo_pairs_unique ON photo_pairs(pickup_photo_id, return_photo_id);
```

### detected_differences Table
```sql
CREATE TABLE detected_differences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_pair_id UUID NOT NULL REFERENCES photo_pairs(id) ON DELETE CASCADE,
    difference_type VARCHAR(50) NOT NULL, -- 'new_damage', 'lighting_change', 'angle_variation'
    coordinates JSONB NOT NULL, -- bounding box or polygon coordinates
    confidence_score DECIMAL(3,2) NOT NULL,
    pixel_difference_count INTEGER,
    severity_assessment VARCHAR(20), -- 'minor', 'moderate', 'severe'
    is_confirmed_damage BOOLEAN DEFAULT false,
    confirmed_by UUID REFERENCES users(id),
    confirmed_at TIMESTAMPTZ,
    estimated_cost DECIMAL(10,2),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_detected_differences_pair ON detected_differences(photo_pair_id);
CREATE INDEX idx_detected_differences_confirmed ON detected_differences(is_confirmed_damage);
```

### comparison_reports Table
```sql
CREATE TABLE comparison_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comparison_id UUID NOT NULL REFERENCES photo_comparisons(id),
    report_type VARCHAR(50) NOT NULL, -- 'damage_assessment', 'full_comparison', 'summary'
    file_path VARCHAR(500),
    file_size INTEGER,
    generated_by UUID NOT NULL REFERENCES users(id),
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    report_data JSONB, -- structured report data
    is_final BOOLEAN DEFAULT false
);

CREATE INDEX idx_comparison_reports_comparison ON comparison_reports(comparison_id);
```

## UI/UX Considerations

### Split-Screen Layout
- Adjustable divider for different screen sizes
- Responsive breakpoints for mobile/tablet/desktop
- Full-screen mode for detailed inspection
- Thumbnail strip for quick photo navigation

### Visual Feedback
- Color-coded difference highlighting (red for damage, yellow for uncertain)
- Progressive disclosure of difference details
- Loading indicators for comparison processing
- Success/warning states for comparison results

### Interactive Controls
- Slider controls for zoom synchronization
- Toggle buttons for overlay modes
- Drag-and-drop for manual photo pairing
- Context menus for damage marking

### Mobile Considerations
- Swipe gestures for photo navigation
- Touch-friendly zoom and pan controls
- Portrait/landscape mode optimization
- Simplified interface for smaller screens

## Testing Scenarios

### Scenario 1: Perfect Photo Match Comparison
**Given** pickup and return photos of same vehicle angle with new damage  
**When** staff initiates comparison  
**Then** photos are automatically paired correctly  
**And** new damage is highlighted accurately  
**And** synchronized controls work properly

### Scenario 2: Algorithm Difference Detection
**Given** before/after photos with subtle damage  
**When** automatic difference detection runs  
**Then** algorithm identifies damage areas correctly  
**And** false positives are minimized  
**And** confidence scores are accurate

### Scenario 3: Manual Photo Pairing
**Given** return photos don't match pickup angles exactly  
**When** staff manually pairs photos  
**Then** manual pairing override works  
**And** comparison still functions correctly  
**And** pairing decisions are saved

### Scenario 4: Mobile Comparison Interface
**Given** staff using mobile device for comparison  
**When** they navigate the comparison interface  
**Then** touch controls work smoothly  
**And** photos load quickly on mobile data  
**And** difference highlighting is clearly visible

### Scenario 5: Multiple Damage Areas
**Given** vehicle with multiple new damage areas  
**When** comparison analysis completes  
**Then** all damage areas are identified  
**And** each can be individually assessed  
**And** total damage cost is calculated

### Scenario 6: Poor Quality Photo Handling
**Given** photos with different lighting or blur  
**When** comparison algorithm processes them  
**Then** quality differences are normalized where possible  
**And** warnings are shown for unreliable comparisons  
**And** manual review is flagged

### Scenario 7: Report Generation
**Given** completed photo comparison with identified damage  
**When** staff generates damage report  
**Then** PDF includes before/after photo pairs  
**And** highlighted differences are clearly shown  
**And** cost estimates are included

### Scenario 8: Performance with Large Photo Sets
**Given** rental with 20+ photos for comparison  
**When** comparison process is initiated  
**Then** performance remains acceptable (<5 seconds)  
**And** memory usage stays within limits  
**And** all photo pairs are processed correctly

## Definition of Done

- [ ] Side-by-side photo comparison interface implemented
- [ ] Synchronized zoom, pan, and navigation controls working
- [ ] Automatic difference detection algorithm functional
- [ ] Manual damage marking integrated with comparison view
- [ ] Smart photo pairing based on vehicle angles
- [ ] Toggle and overlay modes for different viewing preferences
- [ ] Report generation with before/after documentation
- [ ] Mobile-optimized comparison interface
- [ ] Performance optimization for large photo sets
- [ ] API endpoints for comparison operations implemented
- [ ] Database schema for comparison tracking deployed
- [ ] Quality assessment and normalization features
- [ ] Audit trail for all comparison activities
- [ ] Error handling for edge cases (missing photos, quality issues)
- [ ] Unit tests covering comparison algorithms
- [ ] Integration tests for end-to-end comparison workflow
- [ ] User acceptance testing with real damage scenarios
- [ ] Performance testing with concurrent comparisons
- [ ] Documentation for staff training on comparison features

## Estimated Effort
**8 Story Points** (2 Developer Days)

### Breakdown:
- Comparison algorithm implementation: 3 points
- Synchronized UI controls: 2 points
- Report generation system: 2 points
- Mobile optimization and testing: 1 point

### Dependencies:
- Photo capture system (Story 1) completed
- Photo annotation tools (Story 2) completed
- Image processing library with comparison capabilities
- Report generation infrastructure
- Computer vision library for difference detection