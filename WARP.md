# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a React + TypeScript + Vite project named "stelar". It uses React 19.1.1 with modern TypeScript configuration, ESLint for linting, and Vite for fast development and building.

## Common Commands

### Development
```powershell
# Start development server with hot reload
npm run dev

# Preview production build locally
npm run preview
```

### Building
```powershell
# Build for production (TypeScript compilation + Vite build)
npm run build

# Type check only (without building)
npx tsc -b
```

### Code Quality
```powershell
# Run ESLint on all files
npm run lint

# Fix ESLint issues automatically
npx eslint . --fix
```

### Package Management
```powershell
# Install dependencies
npm install

# Install new dependency
npm install <package-name>

# Install new dev dependency
npm install -D <package-name>
```

## Architecture

### Project Structure
```
stelar/
├── src/                    # Source code
│   ├── assets/            # Static assets (SVGs, images)
│   ├── App.tsx            # Main App component
│   ├── App.css            # App-specific styles
│   ├── main.tsx           # Application entry point
│   └── index.css          # Global styles
├── public/                # Public static files served by Vite
├── dist/                  # Build output (generated)
└── node_modules/          # Dependencies (generated)
```

### Key Components
- **main.tsx**: Application entry point that renders the App component in React StrictMode
- **App.tsx**: Main application component with basic counter functionality
- **CSS Files**: Modular CSS with App.css for component styles and index.css for globals

### Technology Stack
- **React 19.1.1**: UI library with latest features
- **TypeScript ~5.8.3**: Type safety with strict configuration
- **Vite 7.1.7**: Fast build tool and dev server
- **ESLint**: Code linting with TypeScript and React-specific rules

## TypeScript Configuration

The project uses a composite TypeScript setup:
- **tsconfig.json**: Root configuration with project references
- **tsconfig.app.json**: App-specific config with strict settings, ES2022 target
- **tsconfig.node.json**: Node-specific configuration for build tools

Key TypeScript features enabled:
- Strict mode with unused variable detection
- React JSX transformation
- Bundler module resolution
- Verbatim module syntax

## ESLint Configuration

ESLint is configured with:
- TypeScript ESLint recommended rules
- React Hooks rules (recommended-latest)
- React Refresh rules for Vite HMR
- ES2020 syntax support
- Browser globals

## Development Notes

### Hot Module Replacement (HMR)
The project supports Vite's fast HMR. Changes to React components will update instantly without losing state.

### Build Process
The build process runs TypeScript compilation first (`tsc -b`) followed by Vite bundling. This ensures type checking before bundling.

### Code Style
- Uses React function components with hooks
- Strict TypeScript settings prevent common errors
- ESLint enforces consistent code style
- React 19 features available (concurrent features, automatic batching)

<!-- alright then , the app is now communicating with the user , now as i planned earlier . as the user expresses themselves and lets the user know what going, the ai converses the asks the user some more questionto get more details. then once when done , all the data is collocated and the user is sent to another section (report section) that shows a header "based on your report" , it list out what the user is going through , why they are possibly going through it and many more otheer reasons before it takes the user  to a conclusions section -->