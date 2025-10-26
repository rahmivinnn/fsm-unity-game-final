# Energy Quest: Misteri Hemat Listrik

## Overview

Energy Quest is an educational 3D puzzle adventure game built for middle school students (ages 12-15) to learn about electrical energy efficiency. The game follows a narrative where players investigate the mysterious disappearance of Professor Teguh, an electrical scientist, by exploring his smart home and solving energy-related puzzles across four levels.

The application is a full-stack web game featuring:
- **Frontend**: React with TypeScript, Three.js for 3D rendering, TailwindCSS for styling, Radix UI components
- **Backend**: Express.js server with minimal API endpoints
- **Game Structure**: Finite State Machine (FSM) managing game flow from opening scene through 4 levels to ending
- **Educational Content**: Physics-based puzzles teaching electrical circuits, energy efficiency, billing calculations (kWh formula), and randomized quizzes using Fisher-Yates shuffle

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack**:
- React 18+ with TypeScript for type-safe component development
- Vite as the build tool and development server
- Three.js (@react-three/fiber, @react-three/drei, @react-three/postprocessing) for 3D graphics rendering
- Zustand for state management (game state, audio state)
- TailwindCSS for utility-first styling with custom design tokens
- Radix UI for accessible, unstyled component primitives

**Game State Management**:
- Finite State Machine (FSM) pattern managing transitions between: `OpeningScene → MainMenu → Level1 → Level2 → Level3 → Level4 → EndingScene`
- Zustand stores for global state (`useEnergyQuest` for game progress, `useAudio` for sound management)
- localStorage persistence for save/continue functionality tracking collected energy keys

**3D Rendering Architecture**:
- Canvas-based rendering using React Three Fiber declarative approach
- GLTF model loading for 3D assets (rooms, furniture, electrical components)
- Raycasting for mouse/touch interaction with 3D objects
- OrbitControls for camera navigation
- GLSL shader support via vite-plugin-glsl for custom visual effects

**Component Organization**:
- Game scenes as separate components (`OpeningScene`, `MainMenu`, `Level1-4`, `EndingScene`)
- Reusable UI components from Radix UI library (buttons, cards, dialogs, etc.)
- `GameUI` component for HUD overlays (messages, key counters, power meters, billing displays)

### Backend Architecture

**Express Server Structure**:
- Minimal REST API with express.json and urlencoded middleware
- Route registration system (`registerRoutes`) for API endpoints
- Development/production mode handling via Vite middleware integration
- Request logging middleware tracking API calls with duration and response data

**Storage Layer**:
- In-memory storage implementation (`MemStorage`) following IStorage interface pattern
- User CRUD operations (getUser, getUserByUsername, createUser)
- Drizzle ORM schema definitions prepared for PostgreSQL migration
- Current implementation uses Map-based temporary storage

**Server-Side Rendering & Asset Serving**:
- Vite dev server integration in development mode with HMR
- Static file serving in production from dist/public
- Custom logging system with timestamps for debugging

### Data Storage Solutions

**Database Schema** (Drizzle ORM):
- PostgreSQL dialect configuration via Neon serverless driver
- `users` table with serial ID, unique username, and password fields
- Zod schema validation for insert operations
- Migration support via drizzle-kit with schema at `shared/schema.ts`

**Client-Side Persistence**:
- localStorage for game progress (energy keys collected, current level)
- Helper functions (`getLocalStorage`, `setLocalStorage`) wrapping JSON serialization

**Future Database Migration Path**:
- Schema prepared for Drizzle push to Neon PostgreSQL
- Connection via `DATABASE_URL` environment variable
- Migrations output to `./migrations` directory

### Authentication and Authorization

**Current State**: 
- User schema defined but authentication not yet implemented
- Password field exists in schema (will require hashing in production)
- Session management prepared via connect-pg-simple (PostgreSQL session store)

**Planned Implementation**:
- Express session middleware with PostgreSQL-backed sessions
- User registration/login endpoints to be added in `server/routes.ts`

### External Dependencies

**3D Asset Sources**:
- Free GLTF models from Sketchfab, CGTrader, BlenderKit, TurboSquid
- Asset types: room interiors (living room, kitchen, lab, basement), appliances, electrical components
- Texture files (wood, tile) for environmental surfaces
- Audio files (MP3/OGG/WAV) from freesound.org for game sounds

**Third-Party Services**:
- Neon Serverless PostgreSQL (via @neondatabase/serverless) for database hosting
- CDN-hosted Three.js libraries in index.html fallback
- Font loading via @fontsource/inter

**NPM Package Dependencies**:
- **3D/Graphics**: three, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **State Management**: zustand (implied by store patterns)
- **UI Components**: All @radix-ui/* packages for accessible components
- **Styling**: tailwindcss, autoprefixer, class-variance-authority, clsx, tailwind-merge
- **Data**: @tanstack/react-query, drizzle-orm, drizzle-zod, zod
- **Build Tools**: vite, esbuild, tsx (TypeScript execution), vite-plugin-glsl
- **Utilities**: date-fns, nanoid, cmdk

**Development Tools**:
- TypeScript with strict mode and ESNext modules
- Replit-specific vite plugin for runtime error overlay
- Path aliases (@/ for client/src, @shared/ for shared)

**Educational Game Logic**:
- Fisher-Yates shuffle algorithm for quiz randomization (Level 4)
- Physics calculations: Energy (kWh) = (Power in Watts × Time in hours) / 1000
- Manual puzzle mechanics (no AI agents) - drag-and-drop cable connections, device toggling, sequential interactions

**Mobile Optimization**:
- Touch-action prevention for mobile gesture handling
- Responsive viewport meta tags with user-scalable disabled
- Orientation detection with landscape mode recommendation
- Mobile-specific breakpoint utilities (768px threshold)