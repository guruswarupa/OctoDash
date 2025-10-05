# OctoPrint Control Interface - Design Guidelines

## Design Approach: Design System-Based
**Selected System:** Material Design + Industrial Dashboard Patterns  
**Justification:** This is a utility-focused, information-dense control application requiring clear status indicators, accessible controls, and efficient workflows. Material Design provides robust patterns for data visualization and interactive controls while maintaining performance on Raspberry Pi.

**Key Principles:**
- Clarity over decoration: Every element serves a functional purpose
- Immediate feedback: Real-time status updates and control confirmation
- Workshop-ready: Dark mode optimized for various lighting conditions
- Touch-first: Controls sized for finger interaction (min 44px touch targets)

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background Base: 220 15% 12%
- Surface Elevated: 220 15% 16%
- Primary Action: 210 100% 56% (Blue for control actions)
- Success/Active: 142 71% 45% (Green for printer ready/printing)
- Warning: 38 92% 50% (Orange for heating/attention)
- Error/Emergency: 0 84% 60% (Red for stops/errors)
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 70%

**Light Mode (Secondary):**
- Background: 220 15% 98%
- Surface: 0 0% 100%
- Maintain same accent colors with adjusted saturation for readability

### B. Typography

**Font Stack:** Inter (via Google Fonts CDN) for UI, JetBrains Mono for temperature/coordinate values

**Type Scale:**
- Display (Status Headers): text-2xl font-semibold
- Control Labels: text-sm font-medium uppercase tracking-wide
- Data Values: text-4xl font-mono font-bold (temperatures, coordinates)
- Body Text: text-base
- Helper Text: text-xs text-secondary

### C. Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, and 8 (p-2, gap-4, m-6, h-8)

**Grid Structure:**
- Dashboard Layout: CSS Grid with sidebar + main content
- Sidebar: Fixed 280px width (collapsed to 64px icon-only on mobile)
- Main Content: max-w-7xl with responsive padding (p-4 md:p-6 lg:p-8)
- Control Panels: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Status Cards: Consistent card-based layout with rounded-xl borders

### D. Component Library

**Navigation:**
- Fixed sidebar with icon + label navigation
- Sections: Dashboard, Control, Temperature, Files, Settings, Terminal
- Active state: Primary color background with icon color shift

**Dashboard Cards:**
- Printer Status Card: Large, prominent with state indicator (Idle/Printing/Error)
- Temperature Monitor: Real-time graph with current/target values
- Print Progress: Circular progress indicator + time estimates
- Quick Controls: Emergency stop, pause, resume, cancel (color-coded by severity)

**Control Interface:**
- Movement Controls: D-pad style with X/Y/Z axis controls
- Extrusion Controls: Numeric input with +/- buttons
- Temperature Sliders: Touch-friendly range inputs with preset buttons
- Settings Toggles: Material Design switches with clear labels

**Data Displays:**
- Live temperature graphs using minimal line charts
- File browser with icon-based file type indicators
- Terminal output with monospace font and syntax highlighting
- Camera feed viewport (if available) with fixed aspect ratio

**Overlays:**
- Modal dialogs for destructive actions (confirm emergency stop)
- Toast notifications for status updates (top-right, auto-dismiss)
- Bottom sheet for file upload on mobile

### E. Animations

**Minimal Motion:**
- Status pulse: Subtle opacity pulse on "Printing" indicator only
- Temperature graph: Smooth line drawing (CSS transitions, not JS animation)
- Button feedback: 100ms scale transform on press
- NO decorative animations - performance priority on Raspberry Pi

## Interface Specifics

**Dashboard View (Primary Screen):**
- Top Bar: Printer name, connection status, emergency stop button
- Left Column: Current print job card (if active) with large progress ring
- Center Grid: Temperature monitors (hotend/bed) with graphs
- Right Column: Quick controls panel + recent files list
- Bottom Status Bar: System info (CPU temp, RAM usage, network)

**Control Panel:**
- Tabbed interface: Move, Extrude, Temperature, Fan
- Movement: Visual representation of print bed with directional controls
- All numeric inputs include keyboard input + increment/decrement buttons
- Home buttons for each axis prominently displayed

**File Management:**
- Card-based file grid with thumbnails (when available)
- Sort/filter controls in sticky header
- Upload zone: Drag-and-drop area with progress indicators
- File actions: Print, delete, view GCODE accessible on hover/tap

## Images
No hero images needed - this is a functional dashboard, not a marketing page. Include:
- Printer connection icon/illustration when disconnected (empty state)
- File type icons from icon library (STL, GCODE indicators)
- Optional: Small printer model visualization in status card

**Critical:** Interface must be fully functional offline after initial load. Prioritize performance and responsiveness over visual flourishes.