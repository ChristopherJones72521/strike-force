# Strike Force Component Library

This component library follows iOS/watchOS design patterns for future portability.

## Component Categories

### Layout Components
- `SFStack` - Vertical/Horizontal stack container (like VStack/HStack)
- `SFList` - List container with consistent spacing
- `SFGrid` - Grid layout for cards and metrics
- `SFTabView` - Tab-based navigation container

### Core Components
- `SFCard` - Basic card container
- `SFMetricCard` - Specialized card for displaying metrics
- `SFChart` - Force and heart rate visualizations
- `SFNavigationBar` - Bottom navigation bar
- `SFTabBar` - Top tab bar for filtering

### Form Components
- `SFButton` - Standard button with variants
- `SFToggle` - Toggle switch
- `SFPicker` - Picker/dropdown component
- `SFSegmentedControl` - Segmented filter control

### Data Display
- `SFMetricView` - Metric display with label and value
- `SFProgressView` - Progress indicators
- `SFBadge` - Status badges and indicators

### Modifiers
Each component accepts standard modifiers similar to SwiftUI:
- `.padding()`
- `.background()`
- `.foreground()`
- `.shadow()`
- `.cornerRadius()`
