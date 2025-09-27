# STELAR PROJECT DOCUMENTATION

## PROJECT OVERVIEW
- **Name**: Stelar
- **Type**: Personal Welfare Helper Web Application
- **Purpose**: Mental wellbeing and support companion
- **Current Version**: 0.0.0 (Development)

## TECHNOLOGY STACK

### Core Framework
- React 19.1.1
- TypeScript ~5.8.3
- Vite 7.1.7 (build tool)

### Styling & Animation
- Tailwind CSS 4.1.13 (utility-first CSS framework)
- GSAP 3.13.0 (professional animation library)
- Geist font family (Google Fonts)

### Development Tools
- ESLint with React/TypeScript rules
- PostCSS & Autoprefixer
- TypeScript strict mode configuration

## PROJECT STRUCTURE
```
stelar/
├── src/
│   ├── components/
│   │   └── WelcomeScreen.tsx    # Main animated landing component
│   ├── App.tsx                  # Main app with navigation logic
│   ├── main.tsx                 # React 19 entry point
│   ├── index.css                # Global styles with Geist fonts
│   └── App.css                  # Component styles
├── public/
│   ├── StelarLogo.svg          # Custom brand logo
│   └── vite.svg
├── package.json                 # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── vite.config.ts              # Vite configuration
└── tsconfig.*.json             # TypeScript configurations
```

## APPLICATION ARCHITECTURE

### Navigation System
- State-based routing using React useState
- Three main screens: welcome, about, chat
- Screen transitions with GSAP exit animations

### Component Hierarchy
```
App (main router)
└── WelcomeScreen (fully implemented)
    ├── Animated logo
    ├── Title with slide-up animation
    ├── Typewriter subtitle
    └── Interactive buttons with hover effects
```

## IMPLEMENTED FEATURES

### WelcomeScreen Component
- **Advanced GSAP animations**: Timeline-based entrance sequence
- **Interactive elements**: Hover/click animations on buttons
- **Smooth transitions**: Blur-to-clear effects with scale transforms
- **Exit animations**: Before screen navigation
- **Performance optimizations**: force3D enabled, nullTargetWarn disabled

### Styling Implementation
- **Tailwind CSS utilities**: Responsive design, gradient backgrounds
- **Custom font integration**: Geist font family system-wide
- **Glassmorphism effects**: Semi-transparent buttons with backdrop blur
- **Animation keyframes**: Custom fade-in-up animations

### TypeScript Configuration
- **Strict mode**: Unused variable detection enabled
- **Composite setup**: Separate configs for app and build tools
- **React JSX**: Modern transformation for optimal bundling
- **ES2022 target**: Modern JavaScript feature support

## DEVELOPMENT COMMANDS
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## CURRENT STATUS

### Completed
✅ Welcome screen with professional GSAP animations
✅ Navigation system between screens
✅ Tailwind CSS styling with custom configuration
✅ TypeScript setup with strict mode
✅ Development environment with Vite HMR
✅ Geist font integration

### Pending Implementation
🔄 About screen (placeholder exists)
🔄 Chat screen (placeholder exists)
🔄 Backend integration for chat functionality
🔄 Additional animation sequences

## KEY DEPENDENCIES
```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "gsap": "^3.13.0",
    "@tailwindcss/vite": "^4.1.13"
  },
  "devDependencies": {
    "typescript": "~5.8.3",
    "vite": "^7.1.7",
    "tailwindcss": "^4.1.13",
    "eslint": "^9.36.0"
  }
}
```

## DESIGN SYSTEM

### Typography
- Primary: Geist font family (100-900 weights)
- Fallback: System UI font stack
- Loaded via Google Fonts CDN

### Color Scheme
- Primary gradient: blue-200 via blue-600 to blue-500
- Interactive elements: white with opacity variations
- Text: white on gradient backgrounds

### Animation Style
- Smooth, professional transitions
- Staggered element entrances
- Scale-based hover feedback (0.95-1.02 range)
- Timeline orchestration for complex sequences

## TECHNICAL NOTES
- Uses React 19 concurrent features and automatic batching
- Vite provides fast HMR during development
- ESLint enforces React hooks and TypeScript best practices
- Build process includes TypeScript compilation + Vite bundling
- Responsive design with mobile-first approach

## PROJECT VISION
Stelar is positioned as a mental health and wellness companion featuring:
- Conversational AI interface (planned)
- Professional, calming user experience
- Smooth, accessible interactions
- Personal wellbeing support focus