# Story 2: Photo Annotation Tools

## Story ID
**Epic 7 - Story 2**

## User Story Statement
**As a** rental staff member  
**I want to** mark existing damage on vehicle photos with detailed annotations  
**So that** pre-existing conditions are clearly documented and future disputes can be avoided

## Detailed Acceptance Criteria

1. **Drawing Tools**
   - Support circle and rectangle shapes for marking damage areas
   - Free-form drawing tool for irregular damage shapes
   - Adjustable line thickness and opacity settings
   - Undo/redo functionality for all drawing operations

2. **Text Annotations**
   - Add text labels to marked damage areas
   - Support multi-line text with character limit (500 characters)
   - Font size adjustment for readability
   - Text positioning with drag-and-drop capability

3. **Color Coding System**
   - Different colors for damage severity levels (minor, moderate, severe)
   - Specific colors for damage types (scratch, dent, paint damage, etc.)
   - Color legend displayed for user reference
   - Customizable color palette for different damage categories

4. **Annotation Persistence**
   - Save all annotations with photo metadata
   - Associate annotations with specific photo coordinates
   - Maintain annotation data across device orientations
   - Version control for annotation modifications

5. **Edit Capabilities**
   - Select and modify existing annotations
   - Delete individual annotations or clear all
   - Copy annotations between similar photos
   - Batch edit operations for multiple annotations

6. **Mobile-Friendly Interface**
   - Touch-responsive drawing on mobile devices
   - Pinch-to-zoom with annotation scaling
   - Touch gesture support for selection and editing
   - Optimized UI for smartphone screen sizes

7. **Annotation Layers**
   - Toggle annotation visibility on/off
   - Multiple annotation layers for different inspection stages
   - Layer management with naming conventions
   - Export options with/without annotations

8. **Measurement Tools**
   - Ruler tool for damage size estimation
   - Scale reference based on known vehicle dimensions
   - Area calculation for large damage zones
   - Distance measurements between damage points

9. **Annotation Templates**
   - Pre-defined templates for common damage types
   - Quick annotation stamps (arrows, checkmarks, warning signs)
   - Custom template creation and saving
   - Template sharing between staff members

10. **Collaborative Features**
    - Multiple users can add annotations to same photo
    - Annotation author tracking and timestamps
    - Comment threads on specific annotations
    - Approval workflow for annotation validation

11. **Export Capabilities**
    - Export annotated photos in multiple formats (PNG, JPG, PDF)
    - High-resolution export maintaining annotation quality
    - Bulk export of all annotated photos for contract
    - Annotation summary report generation

12. **Performance Optimization**
    - Smooth drawing performance on all supported devices
    - Annotation rendering optimization for large photos
    - Memory management for multiple annotated photos
    - Fast switching between photos with annotations

## Technical Implementation Notes

### Frontend Architecture
- **AnnotationCanvas.vue**: Main canvas component for drawing
- **AnnotationToolbar.vue**: Tool selection and configuration
- **AnnotationLayer.vue**: Layer management component
- **AnnotationTemplates.vue**: Template selection interface

### Canvas Implementation
```javascript
// HTML5 Canvas with fabric.js for advanced drawing
import { fabric } from 'fabric'

const canvas = new fabric.Canvas('annotation-canvas', {
  isDrawingMode: true,
  freeDrawingBrush: {
    width: 3,
    color: '#ff0000'
  }
})

// Touch event handling for mobile
canvas.on('path:created', (e) => {
  // Save annotation data
  const annotation = {
    type: 'drawing',
    path: e.path,
    timestamp: new Date(),
    author: currentUser.id
  }
  saveAnnotation(annotation)
})
```

### Annotation Data Structure
```typescript
interface Annotation {
  id: string
  photoId: string
  type: 'circle' | 'rectangle' | 'freeform' | 'text' | 'arrow'
  coordinates: {
    x: number
    y: number
    width?: number
    height?: number
    points?: Point[]
  }
  style: {
    color: string
    thickness: number
    opacity: number
    fontSize?: number
  }
  content?: string // for text annotations
  damageType: string
  severity: 'minor' | 'moderate' | 'severe'
  author: string
  timestamp: Date
  lastModified: Date
}
```

## API Endpoints Needed

### Annotation Management
```
POST /api/v1/photos/{photo_id}/annotations
- Create new annotation on photo
- Request: annotation data object
- Response: created annotation with ID

PUT /api/v1/photos/{photo_id}/annotations/{annotation_id}
- Update existing annotation
- Request: updated annotation data
- Response: updated annotation object

GET /api/v1/photos/{photo_id}/annotations
- Retrieve all annotations for photo
- Response: array of annotation objects

DELETE /api/v1/photos/{photo_id}/annotations/{annotation_id}
- Remove annotation from photo
- Soft delete with recovery option

GET /api/v1/annotations/templates
- Retrieve annotation templates
- Response: array of template objects

POST /api/v1/annotations/templates
- Create custom annotation template
- Request: template definition
- Response: created template
```

### Batch Operations
```
POST /api/v1/photos/{photo_id}/annotations/batch
- Create multiple annotations in single request
- Request: array of annotation objects
- Response: array of created annotations

PUT /api/v1/photos/{photo_id}/annotations/batch
- Update multiple annotations
- Request: array of annotation updates
- Response: updated annotations

POST /api/v1/annotations/copy
- Copy annotations between photos
- Request: source_photo_id, target_photo_id, annotation_ids
- Response: copied annotations
```

## Database Schema Requirements

### annotations Table
```sql
CREATE TABLE annotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    photo_id UUID NOT NULL REFERENCES photos(id) ON DELETE CASCADE,
    contract_id UUID NOT NULL REFERENCES contracts(id),
    annotation_type VARCHAR(50) NOT NULL,
    coordinates JSONB NOT NULL, -- x, y, width, height, points array
    style_config JSONB NOT NULL, -- color, thickness, opacity, fontSize
    text_content TEXT,
    damage_type VARCHAR(100),
    severity_level VARCHAR(20) CHECK (severity_level IN ('minor', 'moderate', 'severe')),
    template_id UUID REFERENCES annotation_templates(id),
    layer_name VARCHAR(100) DEFAULT 'main',
    author_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_approved BOOLEAN DEFAULT false,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMPTZ
);

CREATE INDEX idx_annotations_photo_id ON annotations(photo_id);
CREATE INDEX idx_annotations_contract_id ON annotations(contract_id);
CREATE INDEX idx_annotations_author ON annotations(author_id);
CREATE INDEX idx_annotations_damage_type ON annotations(damage_type);
```

### annotation_templates Table
```sql
CREATE TABLE annotation_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    template_data JSONB NOT NULL, -- shape, style, default text
    damage_category VARCHAR(100),
    is_system_template BOOLEAN DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_annotation_templates_category ON annotation_templates(damage_category);
```

### annotation_comments Table
```sql
CREATE TABLE annotation_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    annotation_id UUID NOT NULL REFERENCES annotations(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_annotation_comments_annotation ON annotation_comments(annotation_id);
```

## UI/UX Considerations

### Mobile Touch Interface
- Large touch targets for tool selection (minimum 44px)
- Gesture-based drawing with palm rejection
- Two-finger pan and zoom without affecting annotations
- Context-sensitive menus for annotation editing

### Desktop Interface
- Keyboard shortcuts for common tools (C for circle, R for rectangle, T for text)
- Right-click context menus for annotation operations
- Mouse wheel zoom with annotation scaling
- Multi-monitor support for large screen workflows

### Visual Design
- Semi-transparent overlay mode for annotation visibility
- High contrast mode for better annotation visibility
- Dark/light theme support for different lighting conditions
- Animation feedback for tool selection and operations

### Workflow Integration
- Guided annotation workflow for new users
- Auto-save functionality every 30 seconds
- Annotation checklist for complete documentation
- Integration with photo capture sequence

## Testing Scenarios

### Scenario 1: Basic Damage Marking
**Given** a staff member has a vehicle photo with visible damage  
**When** they select the circle tool and mark the damage area  
**Then** a colored circle appears on the photo  
**And** they can add a text description  
**And** the annotation is saved with proper metadata

### Scenario 2: Mobile Touch Drawing
**Given** a user is on a mobile device  
**When** they use touch to draw annotations  
**Then** drawing is smooth and responsive  
**And** touch gestures work correctly  
**And** annotations scale properly with zoom

### Scenario 3: Multiple Damage Types
**Given** a vehicle has different types of damage  
**When** staff marks each damage with appropriate colors  
**Then** color coding system works correctly  
**And** legend shows damage type mappings  
**And** annotations are visually distinct

### Scenario 4: Annotation Editing
**Given** existing annotations on a photo  
**When** user selects and modifies annotation  
**Then** changes are applied correctly  
**And** edit history is maintained  
**And** undo/redo functions work properly

### Scenario 5: Template Usage
**Given** predefined damage templates exist  
**When** user applies template to photo  
**Then** template annotations are added correctly  
**And** templates can be customized  
**And** custom templates can be saved

### Scenario 6: Cross-Device Compatibility
**Given** annotations created on mobile device  
**When** viewed on desktop browser  
**Then** annotations display correctly  
**And** editing works on both platforms  
**And** no data loss occurs

### Scenario 7: Performance with Large Photos
**Given** high-resolution vehicle photos  
**When** adding multiple complex annotations  
**Then** performance remains smooth  
**And** memory usage stays within limits  
**And** annotation quality is maintained

### Scenario 8: Collaborative Annotations
**Given** multiple staff members annotating same photo  
**When** annotations are added by different users  
**Then** author information is tracked correctly  
**And** conflicting edits are handled gracefully  
**And** approval workflow functions properly

## Definition of Done

- [ ] Drawing tools (circle, rectangle, freeform) implemented and tested
- [ ] Text annotation system with positioning capability
- [ ] Color coding system with damage type mapping
- [ ] Mobile-responsive touch interface working
- [ ] Annotation persistence and retrieval functional
- [ ] Edit/delete operations for all annotation types
- [ ] Template system for common damage patterns
- [ ] Layer management for annotation organization
- [ ] Export functionality with/without annotations
- [ ] Performance optimized for large photos and multiple annotations
- [ ] Cross-browser compatibility verified
- [ ] API endpoints implemented and documented
- [ ] Database schema deployed with proper indexes
- [ ] User interface tested with real staff members
- [ ] Accessibility features for annotation tools
- [ ] Unit tests achieve 90% coverage
- [ ] Integration tests cover all annotation operations
- [ ] Load testing for concurrent annotation editing
- [ ] Documentation and training materials created

## Estimated Effort
**8 Story Points** (2 Developer Days)

### Breakdown:
- Canvas drawing implementation: 3 points
- Annotation data management: 2 points
- Mobile touch optimization: 2 points
- Templates and UI polish: 1 point

### Dependencies:
- Photo capture system (Story 1) completed
- Canvas drawing library selection (fabric.js or similar)
- Touch gesture handling research
- Color scheme definition for damage types