# AgileAI Simulator

## Overview

This is a full-stack TypeScript application that provides an interactive agile methodology training simulator. The application allows users to practice agile scenarios (Scrum, Kanban, SAFe) through interactive decision-making exercises with AI-powered feedback and insights.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and building

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API with JSON responses
- **Session Management**: Basic middleware for request logging and error handling

### Data Storage Solutions
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured via Neon serverless)
- **Schema**: Type-safe database schema with Zod validation
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

## Key Components

### Database Schema
- **Users**: User profiles with progress tracking (streak, completion rate, time invested)
- **Scenarios**: Comprehensive Agile training scenarios across 8 frameworks (Scrum, Kanban, SAFe, DSDM, FDD, Lean, XP) with difficulty levels and rich interactive content
- **User Progress**: Tracks individual scenario progress with step completion and decisions
- **AI Insights**: Stores AI-generated feedback and recommendations
- **Learning Paths**: Structured learning progression through scenarios organized by framework

### API Endpoints
- `GET /api/user/current` - Get current user profile
- `GET /api/scenarios` - List scenarios with optional framework filtering
- `GET /api/scenarios/:id` - Get specific scenario details
- `POST /api/scenarios/:id/progress` - Update user progress
- `GET /api/user/progress` - Get user's progress across all scenarios
- `POST /api/ai/feedback` - Generate AI insights based on user decisions

### Frontend Components
- **Navigation**: Responsive navigation with mobile menu support
- **Dashboard**: Overview of user stats, current progress, and recommendations
- **Scenario Library**: Filterable list of available training scenarios
- **Scenario Modal**: Interactive scenario player with decision tracking
- **AI Feedback Panel**: Real-time AI insights and recommendations
- **Stats Cards**: Visual representation of user achievements and metrics

## Data Flow

1. **User Interaction**: Users browse scenarios through the library or dashboard
2. **Scenario Execution**: Selected scenarios load interactive content with decision points
3. **Progress Tracking**: User decisions and progress are stored in real-time
4. **AI Processing**: OpenAI integration generates personalized feedback based on decisions
5. **Insights Display**: AI recommendations are presented through the feedback panel
6. **Analytics**: User performance metrics are calculated and displayed on the dashboard

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Router (Wouter)
- **State Management**: TanStack Query for server state
- **UI Components**: Radix UI primitives, Shadcn/ui components
- **Styling**: Tailwind CSS, Class Variance Authority, clsx
- **Forms**: React Hook Form with Hookform Resolvers

### Backend Dependencies
- **Server**: Express.js with TypeScript support
- **Database**: Drizzle ORM, Neon PostgreSQL driver
- **Validation**: Zod for schema validation
- **AI Integration**: OpenAI SDK for generating insights
- **Development**: tsx for TypeScript execution, Vite for building

### Development Tools
- **Build Tools**: Vite, esbuild for server bundling
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: PostCSS, Autoprefixer
- **Replit Integration**: Cartographer plugin, runtime error overlay

## Deployment Strategy

### Development Mode
- **Frontend**: Vite dev server with HMR
- **Backend**: tsx with nodemon-like behavior
- **Database**: Development database with Drizzle migrations
- **Environment**: NODE_ENV=development with debug logging

### Production Build
- **Frontend**: Vite production build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Database**: Production PostgreSQL via DATABASE_URL
- **Serving**: Express serves both API and static files
- **Environment**: NODE_ENV=production with optimized settings

### Database Management
- **Migrations**: Drizzle Kit for schema migrations in `./migrations`
- **Schema**: Centralized in `shared/schema.ts` for type safety
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Development**: `db:push` command for rapid schema iteration

### Environment Configuration
- **Database**: `DATABASE_URL` for PostgreSQL connection
- **AI Service**: `OPENAI_API_KEY` for AI feedback generation
- **Build Process**: Automatic static file serving in production
- **TypeScript**: Shared types between client and server via `shared/` directory

The application follows a clean separation of concerns with shared types, modular components, and a scalable database design that supports both development and production environments.