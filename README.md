# Antigravity Super-Prompt: VoteIQ - Interactive Election Assistant

**Context for AI (Antigravity):**
You are tasked with building "VoteIQ", a highly interactive, uniquely designed web application that helps users understand the election process, timelines, and steps. Do not build an ordinary CRUD app. This must be an award-winning, "out-of-the-box" experience utilizing modern WebGL/3D graphics, motion UI, and seamless AI integration. You will explain every small decision during development.

## 1. Core Problem Statement & Vision
- **Goal:** Educate users on the democratic election process, critical timelines, and voting steps through a highly engaging, gamified, and interactive medium.
- **Vibe/Aesthetics:** Modern, premium, glassmorphism, highly kinetic (motion graphics). Use 3D elements (e.g., a 3D voting ballot box or an interactive 3D map/timeline). Include lighthearted, relatable graphics (meme-inspired visual analogies) to explain complex political jargon (e.g., Gerrymandering, Electoral College).

## 2. Technology Stack & Google Deployment
You MUST use the following tech stack and ensure the architecture is feasible for Google Cloud / Firebase deployment:
- **Frontend:** Next.js (React), TailwindCSS, Framer Motion (for UI micro-animations), React Three Fiber / Three.js (for 3D WebGL graphics).
- **Backend/API:** Next.js API Routes (Serverless Functions) / Firebase Cloud Functions.
- **Database:** Google Cloud Firestore (NoSQL, excellent for real-time gamification) or PostgreSQL via Google Cloud SQL. 
- **AI Integration:** Google Gemini API (for an interactive "Election Buddy" chatbot and dynamic content generation).
- **Deployment:** Firebase Hosting (for the frontend bundle) & Google Cloud Run (for containerized backend/API if needed).

## 3. Project Architecture & DB Context
### Directory Structure
```text
/vote-iq
  ├── /components
  │     ├── /3d          # React Three Fiber models and scenes (Timeline, Ballot)
  │     ├── /ui          # Reusable UI components (buttons, glassmorphism cards)
  │     └── /ai          # Gemini chat interface components
  ├── /pages             # Next.js routes (or /app if using App Router)
  ├── /api               # Next.js serverless functions (Gemini endpoints, DB operations)
  ├── /lib               # Utility functions, Firebase/Gemini client setup
  ├── /public            # 3D assets (.gltf/.glb), images, memes
  ├── /styles            # Global CSS, Tailwind configurations
  └── firebase.json      # Google Firebase deployment configuration
```

### Database Context (Firestore Schema Example)
- **`users` collection:** `uid`, `displayName`, `region`, `voter_iq_score`, `completed_modules`.
- **`election_timelines` collection:** `id`, `region`, `milestone_name` (e.g., Voter Registration Deadline), `date`, `description`, `is_completed`.
- **`myths_and_facts` collection:** `id`, `statement`, `is_fact`, `ai_explanation`.

## 4. Key "Out of the Box" Features to Implement
1. **The 3D Election Journey:** A scroll-driven 3D timeline where the user "scrolls" through a 3D space detailing the stages of an election (Registration -> Campaigning -> Voting Day -> Results).
2. **Gemini "Election Buddy":** An ever-present floating AI assistant that can answer "What if?" scenarios (e.g., "What if there's a tie?") using the Gemini API. It should respond with rich text and relatable memes/analogies.
3. **Interactive 'Myth vs. Fact' Swipe Game:** Swipeable cards (Tinder-style) for election myths, tracked in the DB to give the user a "Voter IQ" score.
4. **Dynamic Personalization:** The app asks for the user's location and dynamically queries the DB to adjust the timeline to their specific local election laws.

## 5. Step-by-Step Development Instructions for Antigravity
Execute the following steps sequentially. **For each step, stop and explain the code, architecture, and reasoning to me before moving on.**

### Phase 1: Foundation & Theming
- Initialize the Next.js project with Tailwind CSS.
- Set up a premium global CSS theme (dark mode, glassmorphism tokens, vibrant gradients).
- Configure the Google Gemini API client in `/lib`.

### Phase 2: The 3D Interactive Timeline (The "Wow" Factor)
- Install `three` and `@react-three/fiber`.
- Create a scrollable 3D timeline component. Add basic 3D geometries representing election milestones. Ensure it is responsive.

### Phase 3: The AI Integration
- Create a Next.js API route that connects to the Google Gemini API.
- Build the "Election Buddy" chat UI using Framer Motion for smooth opening/closing animations. Ensure it retains conversational context.

### Phase 4: Database & State Management
- Set up the Firebase/Firestore connection.
- Create endpoints/functions to fetch real (or mock) election timeline data based on user state selection.

### Phase 5: Gamification & Polish
- Implement the 'Myth vs. Fact' interactive quiz component using Framer Motion for swiping.
- Add micro-animations to all buttons and cards to make the app feel alive.
- Prepare the project for Google deployment by generating `firebase.json` and build scripts.

## 6. Execution Command
*Antigravity, begin with Phase 1. Scaffold the project, apply the premium design system, and explain your architectural choices.*
