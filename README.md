# Strike Force App

A web application for tracking and analyzing punch force, heart rate, and workout metrics.

## Project Structure

```
strikeforce-app-dynamic/
├── assets/               # Static assets like images and icons
├── components/          # Reusable UI components
│   ├── core/           # Base components (SFCard, SFMetricCard)
│   ├── charts/         # Chart components
│   ├── form/           # Form controls
│   └── utils/          # Component utilities
├── data/               # Data models and sample data
│   ├── models/         # Data model definitions
│   ├── sample/         # Sample data for development
│   └── utils/          # Data utilities
├── schemas/            # JSON schemas for data validation
├── scripts/           # Application logic
│   ├── components/     # Component implementations
│   ├── controllers/    # View controllers
│   ├── services/       # Business logic services
│   └── utils/          # General utilities
├── styles/            # CSS styles
│   ├── app.css        # Application styles
│   └── design-system.css # Design system definitions
└── views/             # HTML view templates
    └── components/    # View component templates
```

## Data Model

### Session
The core data model representing a workout session:

```typescript
interface Session {
  id: string;                 // UUID
  type: SessionType;          // ARCADE | WORKOUT | CHALLENGE | FIGHT
  mode?: string;              // Sub-mode within type
  startDate: string;          // ISO date string
  endDate: string;           // ISO date string
  duration: number;          // Seconds
  energyBurned: number;      // Calories
  samplingRate: number;      // Hz
  
  metrics: {
    maxForce: number;        // G-force
    averageForce: number;    // G-force
    punchCount: number;      // Total punches
    heartRateAvg: number;    // BPM
    heartRateMax: number;    // BPM
    heartRateMin: number;    // BPM
  };
  
  samples: {
    acceleration: Array<{    // Raw acceleration data
      timestamp: number;     // ms since epoch
      x: number;            // G-force
      y: number;            // G-force
      z: number;            // G-force
    }>;
    heartRate: Array<{      // Heart rate samples
      timestamp: number;    // ms since epoch
      value: number;        // BPM
    }>;
    punches: Array<{        // Processed punch events
      timestamp: number;    // ms since epoch
      force: number;        // G-force
      type: string;        // 'jab' | 'cross'
    }>;
  };
  
  metadata?: {             // Optional type-specific data
    [key: string]: any;
  };
}
```

## Design System

### Colors
```css
--sf-primary: #3B82F6;     /* Primary brand color */
--sf-secondary: #312E81;   /* Secondary brand color */
--sf-success: #10B981;     /* Success state */
--sf-warning: #F59E0B;     /* Warning state */
--sf-error: #EF4444;       /* Error state */
--sf-text: #FFFFFF;        /* Primary text */
--sf-text-secondary: rgba(255, 255, 255, 0.6); /* Secondary text */
```

### Typography
```css
--sf-font-family: 'Inter', system-ui, sans-serif;
--sf-font-size-xs: 0.75rem;
--sf-font-size-sm: 0.875rem;
--sf-font-size-base: 1rem;
--sf-font-size-lg: 1.125rem;
--sf-font-size-xl: 1.25rem;
--sf-font-size-2xl: 1.5rem;
--sf-font-size-3xl: 1.875rem;
```

### Spacing
```css
--sf-spacing-1: 0.25rem;
--sf-spacing-2: 0.5rem;
--sf-spacing-3: 0.75rem;
--sf-spacing-4: 1rem;
--sf-spacing-6: 1.5rem;
--sf-spacing-8: 2rem;
```

## Components

### SFCard
Base card component with consistent styling:
```html
<div class="sf-card">
  <div class="sf-card-header">Title</div>
  <div class="sf-card-content">Content</div>
  <div class="sf-card-footer">Footer</div>
</div>
```

### SFMetricCard
Card for displaying numeric metrics:
```html
<div class="sf-metric-card">
  <div class="sf-metric-icon">Icon</div>
  <div class="sf-metric-value">Value</div>
  <div class="sf-metric-label">Label</div>
</div>
```

### SFForceChart
Chart component for force visualization:
```javascript
const chart = new SFForceChart({
  container: 'chart-id',
  data: forceData,
  options: {
    showHeartRate: true,
    timeRange: '1h'
  }
});
```

## Development Guidelines

1. **Component Creation**
   - Create components in the appropriate directory under `/components`
   - Use the SF prefix for all component names
   - Include documentation in the component file
   - Create a test file for each component

2. **Data Management**
   - All data models should be defined in `/data/models`
   - Use TypeScript-style interfaces for documentation
   - Validate data against schemas in `/schemas`
   - Use services for data operations

3. **Styling**
   - Use variables defined in `design-system.css`
   - Follow BEM naming convention
   - Keep component-specific styles with components
   - Use utility classes from Tailwind when appropriate

4. **Testing**
   - Write tests for all components and services
   - Use mock data from `/data/sample`
   - Test both success and error cases
   - Document test scenarios

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `python3 server.py`
4. Open http://localhost:8080 in your browser

## Contributing

1. Create a feature branch
2. Follow the development guidelines
3. Update documentation as needed
4. Submit a pull request
