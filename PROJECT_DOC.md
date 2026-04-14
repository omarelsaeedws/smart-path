# Smart Path Project Documentation

## 1. Project Overview

### Project Name
Smart Path

### Purpose
Smart Path is an AI-assisted learning platform that helps users discover, start, and progress through structured learning roadmaps. It addresses a common self-learning problem: learners know the outcome they want, but not the best order of topics, resources, and practice projects.

### Problem It Solves
- Reduces confusion when choosing what to learn next.
- Organizes learning into roadmap -> weeks -> lessons.
- Tracks learner progress and enforces sequential completion.
- Uses quizzes before a lesson is marked complete.
- Gives admins a way to curate categories, resources, roadmaps, and project ideas.

### Target Users
- Students and self-learners.
- Beginners and intermediate learners who need guided paths.
- Admins/instructors who manage content and users.

### Main Features
- Public marketing landing page.
- Firebase Authentication with email/password and Google sign-in.
- Mandatory email verification.
- Onboarding flow for level, study time, and interests.
- Personalized dashboard with roadmap, tools, and applications suggestions.
- Roadmap catalog with category filtering and rating.
- Roadmap learning view with weekly lessons, locking, and progress tracking.
- AI-generated lesson quiz through Firebase Cloud Functions.
- Resources/tools catalog.
- Applications/projects catalog.
- Settings page for profile updates, password reset, and account deletion.
- Admin dashboard for users, categories, resources, roadmaps, lessons, and applications.

### Tech Stack

#### Frontend
- React 19
- React Router DOM 7
- Vite 7
- Tailwind CSS 4
- Font Awesome

#### Backend / Platform
- Firebase Authentication
- Cloud Firestore
- Firebase Cloud Functions v2
- Firebase Storage configured but effectively disabled by rules
- Firebase Emulator Suite for local development

#### AI Integration
- Groq SDK in Cloud Functions
- `generateQuiz` callable function uses `llama-3.3-70b-versatile`
- Firestore `quizCache` collection for quiz caching

#### Tooling
- ESLint 9 for frontend
- Separate ESLint setup for `functions/`

## 2. Project Structure

### Top-Level Layout

```text
smart-path/
├─ functions/
├─ public/
├─ src/
├─ firebase.json
├─ firestore.rules
├─ storage.rules
├─ vite.config.js
├─ eslint.config.js
├─ package.json
└─ README.md
```

### Root Files

#### `package.json`
- Frontend dependency manifest.
- Defines `dev`, `build`, `lint`, and `preview`.
- Includes some packages not currently used by the main runtime flow, such as `express`, `axios`, `openai`, and `nodemon`.

#### `firebase.json`
- Configures emulators for auth, functions, Firestore, storage, and emulator UI.
- Points Firestore and Storage to their rules files.
- Configures `functions/` as the Cloud Functions source.

#### `firestore.rules`
- Defines access rules for users, resources, roadmaps, progress, ratings, categories, applications, and quiz cache.
- Currently broad for many collections: most writes are allowed for any authenticated user, with admin enforcement handled mostly in the UI, not strictly in rules.

#### `storage.rules`
- Denies all reads and writes.

#### `firestore.indexes.json`
- Empty, so no custom Firestore indexes are defined.

#### `vite.config.js`
- Minimal Vite configuration using React and Tailwind plugins.

#### `eslint.config.js`
- Frontend lint config.
- Ignores `dist` and `functions`.

#### `fix_rules.js`
- Standalone script that rewrites Firestore rules to allow everything.
- Not used by runtime and should be treated as a maintenance/debug artifact.

### `functions/`

#### `functions/index.js`
- Main Cloud Functions entry point.
- Exposes one callable function: `generateQuiz`.
- Initializes Admin SDK and Firestore.
- Loads environment variables through `dotenv`.

#### `functions/package.json`
- Functions-specific dependency manifest.
- Uses Node 20 runtime.

#### `functions/seedDatabase.js`
- Node script for populating the Firestore emulator with sample categories, roadmaps, lessons, tools, and applications.

### `public/`
- Static assets.
- Includes `logo.png` and `logo-white.png`.

### `src/`

#### `src/main.jsx`
- React client entry point.
- Wraps app with `BrowserRouter`.

#### `src/App.jsx`
- Application route map.
- Wraps everything in `AuthProvider`.
- Mounts `GlobalLoader`.
- Defines public, protected, and admin routes.

#### `src/lib/`

##### `src/lib/firebase.js`
- Initializes Firebase app.
- Exports `db`, `auth`, `storage`, and `functions`.
- Auto-connects to local emulators when hostname is `localhost` or `127.0.0.1`.

#### `src/contexts/`

##### `src/contexts/AuthContext.jsx`
- Central auth/profile state.
- Subscribes to Firebase Auth changes.
- Loads or creates `users/{uid}` profile documents after email verification.
- Injects admin role for `admin@smartpath.com`.

#### `src/components/`

##### Core routing/layout
- `ProtectedRoute.jsx`: blocks unauthenticated or unverified users; redirects incomplete users to onboarding.
- `PublicRoute.jsx`: redirects authenticated users away from auth pages.
- `AdminRoute.jsx`: requires admin role.
- `MainLayout.jsx`: shared shell with sidebar and animated backgrounds.
- `Sidebar.jsx`: app navigation and logout.
- `GlobalLoader.jsx`: temporary page transition/loading overlay.

##### Shared UI
- `AnimatedBackground.jsx`: reusable auth-page background wrapper.
- `Popup.jsx`: modal success/error popup.
- `QuizModal.jsx`: quiz experience for lessons; calls Cloud Function.

#### `src/auth/`
- `Login.jsx`
- `Register.jsx`
- `ForgotPassword.jsx`

These handle authentication UI and auth actions.

#### `src/pages/`
- `Landing.jsx`: public marketing page.
- `VerifyEmail.jsx`: email verification waiting room.
- `Onboarding.jsx`: initial learner profile setup.
- `Dashboard.jsx`: personalized main screen.
- `RoadmapsPage.jsx`: roadmap catalog and rating modal.
- `RoadmapLearning.jsx`: lesson-by-lesson roadmap runner.
- `ResourcesPage.jsx`: tools/resources catalog.
- `ApplicationsPage.jsx`: project ideas catalog.
- `Settings.jsx`: profile/security/account actions.
- `AdminPage.jsx`: content and user management.
- `NotFound.jsx`: 404 page.

#### `src/services/`

This folder is the data-access layer for Firestore:

- `adminService.js`: subscribe to users and manage user role/status/doc deletion.
- `applicationService.js`: CRUD + realtime subscription for `applications`.
- `categoryService.js`: CRUD + realtime subscription for `categories`.
- `progressService.js`: user roadmap progress, active roadmap, unlock logic.
- `ratingService.js`: roadmap rating and average recalculation.
- `resourceService.js`: realtime resources list and add/delete.
- `roadmapService.js`: roadmaps, weeks, and lessons CRUD/fetching.

#### `src/utils/`

##### `src/utils/seedRealData.js`
- Frontend-triggered seed utility used by the Admin page.
- Populates more extensive demo data than the backend seed script.

### Important Entry Points and Config Files
- App bootstrap: `src/main.jsx`
- Route definition: `src/App.jsx`
- Firebase setup: `src/lib/firebase.js`
- Auth profile orchestration: `src/contexts/AuthContext.jsx`
- Cloud function entry: `functions/index.js`
- Rules/config: `firebase.json`, `firestore.rules`, `storage.rules`

## 3. How the Project Works

### Architecture
The project is a client-heavy React SPA backed by Firebase. It is not a traditional MVC backend. The effective architecture is:

- React pages/components for UI and interaction.
- Service modules as the frontend data-access layer.
- Firebase Auth for identity.
- Firestore as the main database.
- Callable Cloud Function for AI quiz generation.

### High-Level Data Model

#### Main Firestore Collections
- `users/{uid}`
- `categories/{categoryId}`
- `resources/{resourceId}`
- `applications/{appId}`
- `roadmaps/{roadmapId}`
- `roadmaps/{roadmapId}/weeks/{weekId}`
- `roadmaps/{roadmapId}/weeks/{weekId}/lessons/{lessonId}`
- `userProgress/{uid}`
- `userProgress/{uid}/roadmaps/{roadmapId}`
- `ratings/{userId_roadmapId}`
- `quizCache/{lessonId}`

### Frontend -> Backend -> Database Flow

#### Authentication flow
1. User signs up or signs in through Firebase Auth.
2. `AuthContext` listens via `onAuthStateChanged`.
3. If the user is verified, it loads `users/{uid}` from Firestore.
4. If no profile exists, it creates one with fields like `isOnboarded`, `firstLogin`, `email`, `role`, `status`, and `createdAt`.
5. Route guards use auth/profile state to decide navigation.

#### Onboarding flow
1. Verified non-admin users who are not onboarded are forced to `/onboarding`.
2. Onboarding loads categories in realtime.
3. User selects:
   - `level`
   - `dailyStudyHours`
   - `interests` (category IDs)
4. These are merged into `users/{uid}`.
5. User is redirected to `/dashboard`.

#### Dashboard flow
1. Loads the user’s active roadmap ID from `userProgress/{uid}`.
2. Loads current roadmap details from `roadmaps/{activeRoadmapId}`.
3. Loads progress from `userProgress/{uid}/roadmaps/{roadmapId}`.
4. Subscribes to categories, resources, and applications.
5. Filters suggestions using user interests.

#### Roadmap browsing flow
1. `RoadmapsPage` fetches all roadmaps.
2. Loads categories for filtering.
3. For each roadmap, loads current user progress to show per-roadmap progress.
4. User can open roadmap details modal.
5. User can rate roadmap, which writes to `ratings` and updates the roadmap aggregate.
6. User can start a roadmap, which writes `activeRoadmapId` under `userProgress/{uid}`.

#### Roadmap learning flow
1. `RoadmapLearning` loads roadmap metadata, weeks, lessons, and user progress.
2. Lessons are flattened to compute sequential unlock status.
3. A lesson becomes available only if the previous lesson is completed.
4. User opens a lesson and launches a quiz to complete it.
5. On pass, `markLessonComplete` updates `completedLessons`, `progress`, and `updatedAt`.

#### Quiz flow
1. `QuizModal` calls `httpsCallable(functions, "generateQuiz")`.
2. Cloud Function checks `quizCache/{lessonId}`.
3. If cached, cached questions are returned.
4. Otherwise Groq generates JSON quiz content.
5. Function normalizes questions and stores them in `quizCache`.
6. Frontend requires a score of at least 60% to mark the lesson complete.

### Authentication and Authorization

#### Authentication
- Implemented with Firebase Auth.
- Supports email/password.
- Supports Google sign-in.
- Email verification is mandatory before the main app is usable.

#### Authorization
- App-side route gating is based on `userProfile.role`.
- `AdminRoute` checks `isAdmin`.
- Firestore rules are more permissive than the UI and do not fully enforce admin-only writes.
- The current design therefore relies heavily on client behavior and should not be treated as strong security.

### API Communication

#### Frontend to Firestore
- Done directly from the browser using Firebase SDK service modules.
- Reads use `getDoc`, `getDocs`, or `onSnapshot`.
- Writes use `setDoc`, `addDoc`, `updateDoc`, and `deleteDoc`.

#### Frontend to Cloud Functions
- Done with Firebase callable functions.
- Current callable API:
  - `generateQuiz`

#### Cloud Function to AI Provider
- `functions/index.js` calls Groq chat completions.
- Uses strict JSON prompting and caches output in Firestore.

## 4. Code Explanation

### Authentication Context

#### `src/contexts/AuthContext.jsx`
What it does:
- Holds `currentUser`, `userProfile`, `isAdmin`, `loading`, and `refreshUserProfile`.

How it works:
- On auth state changes, it loads the Firestore profile only for verified users.
- If no profile exists, it creates one automatically.
- If the user email is `admin@smartpath.com`, it force-merges `role: "admin"`.

Key logic:
- Email verification controls whether profile data is even loaded.
- Initial render is blocked until the first auth check completes.

### Route Guards

#### `ProtectedRoute.jsx`
- Redirects unauthenticated users to `/login`.
- Redirects unverified users to `/verify-email`.
- Redirects non-admin users without onboarding to `/onboarding`.

#### `PublicRoute.jsx`
- Prevents signed-in users from seeing login/register/forgot-password pages.
- Sends admins to `/admin`.
- Sends onboarded users to `/dashboard`.

#### `AdminRoute.jsx`
- Allows access only if `userProfile.role === "admin"`.

### Auth Screens

#### `Login.jsx`
- Uses Firebase `signInWithEmailAndPassword`.
- If login succeeds but email is unverified, user is signed out and prompted to resend verification.
- Supports Google popup sign-in.

#### `Register.jsx`
- Validates email format and password strength.
- Creates user, updates display name, sends verification email, then redirects to `/verify-email`.
- Also supports Google sign-in.
- Important implementation detail: it calls `connectAuthEmulator(auth, ...)` directly in the module, which is redundant and risky because emulator wiring already exists in `src/lib/firebase.js`.

#### `ForgotPassword.jsx`
- Sends password reset email using Firebase Auth.

#### `VerifyEmail.jsx`
- Lets user resend verification emails with cooldown.
- Lets user manually re-check verification by reloading `auth.currentUser`.
- On success, forces a hard redirect to `/dashboard`.

### Onboarding

#### `Onboarding.jsx`
What it does:
- Collects learner preferences after first verified login.

How it works:
- Step 1: level
- Step 2: daily study hours
- Step 3: interests from `categories`
- Saves values into the `users/{uid}` profile.

Key fields written:
- `level`
- `dailyStudyHours`
- `interests`
- `isOnboarded`
- `onboardingCompleted`

### Dashboard

#### `Dashboard.jsx`
What it does:
- Personalized home screen after onboarding.

How it works:
- Loads active roadmap and progress.
- Loads all roadmaps, tools, applications, and categories.
- Filters recommendations by `userProfile.interests`.

Key logic:
- Uses current progress to display a circular progress indicator.
- Falls back to general content if no interest-based match exists.

Reusable pattern:
- Local category lookup map with `Object.fromEntries`.

### Roadmaps Catalog

#### `RoadmapsPage.jsx`
What it does:
- Shows all roadmaps with category filter, progress snippets, and detail modal.

How it works:
- Fetches roadmaps and categories.
- Builds a `progressMap` per roadmap for current user.
- Opens a modal for full details and rating.

Key logic:
- `handleStart` writes active roadmap through `setActiveRoadmap`.
- `handleRate` writes a personal rating and updates local UI with the recalculated average.

### Roadmap Learning

#### `RoadmapLearning.jsx`
What it does:
- Executes the actual learning journey.

How it works:
- Loads roadmap, weeks, lessons, and progress.
- Flattens all lessons for unlock sequencing.
- Opens one lesson at a time.
- Uses `QuizModal` before completion.

Key logic:
- `isLessonUnlocked(completedLessons, allLessons, lessonId)` gates access.
- Completion only happens after `handleQuizPass`.
- Supports YouTube embed extraction from lesson URLs.

Critical behavior:
- Lesson ordering depends on the order of the flattened `allLessons` list returned by week/lesson queries.

### Quiz System

#### `QuizModal.jsx`
What it does:
- Fetches, displays, grades, and resolves lesson quizzes.

How it works:
- Calls the callable function with `lessonId`, `title`, and `description`.
- Accepts either cached or newly generated quiz data.
- Requires all answers before submit.
- Passing score is `>= 60`.

#### `functions/index.js`
What it does:
- Generates or returns cached multiple-choice quizzes.

How it works:
- Validates request.
- Reads `quizCache/{lessonId}`.
- If missing, builds a system prompt and user prompt for Groq.
- Parses JSON response, normalizes it, caches it, and returns it.

Fallback behavior:
- If AI generation fails, it returns a hardcoded fallback quiz item.

### Resources and Applications

#### `ResourcesPage.jsx`
- Subscribes to tools/resources in realtime.
- Filters by text and category.
- Displays external links.

#### `ApplicationsPage.jsx`
- Subscribes to applications in realtime.
- Filters by search, level, and category.
- Shows a card-based project gallery with external links.

### Settings

#### `Settings.jsx`
What it does:
- Lets users edit profile basics, request password reset, and delete the account.

How it works:
- Syncs `displayName` in Firebase Auth and Firestore.
- Writes level and study hours to Firestore.
- Sends password reset email through Firebase Auth.
- Deletes:
  - `users/{uid}/learningPaths/*`
  - `users/{uid}`
  - Firebase Auth user

Important implementation note:
- Settings reads/writes `dailyHours`, while onboarding writes `dailyStudyHours`.
- This creates a profile field inconsistency that can cause settings values not to reflect onboarding values correctly.

### Admin Panel

#### `AdminPage.jsx`
What it does:
- Central management panel for all curated data and users.

Tabs:
- Categories
- Users
- Resources
- Roadmaps
- Applications

How it works:
- Uses realtime subscriptions for users, resources, applications, and categories.
- Loads roadmaps on-demand when the tab is active.
- Loads weeks and lessons when roadmap/week selections change.

Key admin actions:
- Promote/demote users.
- Activate/suspend users.
- Delete Firestore user document.
- CRUD categories.
- Add/delete resources.
- Create/delete roadmaps.
- Create/delete weeks and lessons within a selected roadmap.
- Add/edit/delete applications.
- Trigger demo data seeding via `seedRealData.js`.

Important limitation:
- User deletion here only removes the Firestore user document, not the Auth account.

### Service Layer

#### `roadmapService.js`
- CRUD wrappers for roadmaps, weeks, and lessons.
- Encapsulates collection paths and sorting.

#### `progressService.js`
- Reads roadmap progress.
- Writes active roadmap.
- Marks lessons complete.
- Contains lesson unlock algorithm.

#### `ratingService.js`
- Stores one rating per `userId + roadmapId`.
- Recomputes roadmap average/rating count on the client.
- Does not use Firestore transactions, so concurrent writes may drift under load.

#### `resourceService.js`, `applicationService.js`, `categoryService.js`
- Realtime subscription + basic create/update/delete wrappers.

#### `adminService.js`
- Realtime users subscription and basic user document mutations.

### Reusable Components and Patterns
- `MainLayout`: standard authenticated shell.
- `Sidebar`: shared navigation.
- `Popup` and local toast patterns: shared feedback model.
- Service modules: consistent Firestore access abstraction.
- Category lookup maps and `useMemo`: repeated filtering pattern.

## 5. AI Working Guidelines

### How to Understand the Project Before Changes
1. Read `src/App.jsx` for route flow.
2. Read `src/contexts/AuthContext.jsx` to understand profile lifecycle.
3. Read `src/lib/firebase.js` to understand emulator/runtime behavior.
4. Read the relevant service file before editing a page.
5. Check `firestore.rules` before assuming access constraints are enforced server-side.
6. If touching quizzes, also read `functions/index.js`.

### Coding Style and Conventions
- React function components only.
- Heavy use of hooks and local state.
- Tailwind utility classes inline in JSX.
- Service-layer access pattern for Firestore logic.
- Naming is mostly descriptive and imperative:
  - `handleSaveProfile`
  - `getRoadmaps`
  - `subscribeToCategories`
  - `markLessonComplete`
- Arabic UI text is common even when variable names are English.

### Naming Conventions
- Components: PascalCase.
- Hooks/context helpers: camelCase.
- Service methods: verb-first camelCase.
- Firestore collections use plural nouns:
  - `users`
  - `roadmaps`
  - `resources`
  - `applications`
  - `categories`
  - `ratings`
  - `userProgress`
  - `quizCache`

### How to Safely Modify or Extend Features
- Prefer editing service modules before embedding Firestore calls directly into pages.
- Preserve route-guard assumptions between `AuthContext`, `ProtectedRoute`, `PublicRoute`, and `AdminRoute`.
- Keep roadmap progress compatible with existing Firestore paths.
- When adding lesson behavior, preserve sequential unlock logic.
- When adding admin features, remember current security is UI-driven; document any new risk if rules are not updated too.
- When changing profile fields, keep onboarding, settings, and dashboard field names aligned.

### Debugging Approach
- Reproduce from the relevant route first.
- Verify whether the issue is:
  - auth state
  - Firestore document shape
  - route guard redirect
  - realtime subscription timing
  - callable function failure
- Check browser console for frontend errors.
- Check Firebase emulator logs when running locally.
- For quiz issues, inspect:
  - callable request payload
  - Groq API env variable
  - `quizCache`
  - Cloud Functions logs

### Critical Parts That Must Not Be Broken
- `AuthContext` profile creation/loading logic.
- Email verification gate.
- Onboarding redirect logic.
- `userProgress` document structure and active roadmap behavior.
- Sequential lesson unlock logic.
- Quiz completion flow.
- Admin content hierarchy:
  - roadmap -> weeks -> lessons

### How to Add New Features Properly
- Add any new Firestore access through `src/services/`.
- If the feature affects routing, update `src/App.jsx` and relevant route guards.
- If it affects user profile shape, update onboarding, settings, dashboard, auth profile defaults, and rules if needed.
- If it requires privileged logic, prefer Cloud Functions instead of trusting the client.
- If the feature depends on roles, enforce it in rules or backend, not just UI.

### Best Practices Already Used
- Central auth state in context.
- Firestore paths hidden behind service functions.
- Realtime subscriptions for admin/content lists.
- Clear separation between public, protected, and admin routes.
- Cached AI outputs to reduce repeated generation cost.

## 6. Setup and Running

### Prerequisites
- Node.js 20+ recommended
- npm
- Firebase CLI if using emulators or deployment

### Installation

```bash
npm install
cd functions
npm install
cd ..
```

### Environment Variables

#### Frontend
The frontend Firebase config is hardcoded in `src/lib/firebase.js`, but some values are still placeholders:

- `apiKey`
- `messagingSenderId`
- `appId`

Production readiness therefore requires replacing placeholder values with real Firebase project config.

#### Cloud Functions
Expected in `functions/.env`:

```env
GROQ_API_KEY=your_groq_api_key
```

### Running the Frontend

```bash
npm run dev
```

### Running Firebase Emulators

```bash
firebase emulators:start
```

Configured ports:
- Auth: `9099`
- Functions: `5001`
- Firestore: `8080`
- Storage: `9199`

### Running Cloud Functions Only

```bash
cd functions
npm run serve
```

### Seeding Demo Data

#### Emulator seeding from Node script
```bash
node functions/seedDatabase.js
```

#### In-app admin seeding
- Sign in as admin.
- Open `/admin`.
- Use the seed button that calls `src/utils/seedRealData.js`.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment

Likely deployment targets:
- Frontend: Firebase Hosting or another static host
- Backend: Firebase Cloud Functions
- Database/Auth: Firebase project services

Functions deployment:

```bash
cd functions
npm run deploy
```

Notes:
- No explicit hosting deployment script is defined in root `package.json`.
- Hosting configuration is not present in `firebase.json`, so frontend deployment setup appears incomplete or externalized.

## 7. Suggestions and Improvements

### Code Quality
- Unify profile field naming:
  - `dailyStudyHours` vs `dailyHours`
  - `isOnboarded` vs `onboardingCompleted` vs `profileCompleted`
- Remove duplicate or unsafe emulator connection in `Register.jsx`.
- Replace placeholder Firebase config values with environment-driven config.
- Normalize text encoding in docs/source comments if Arabic encoding issues come from terminal/file handling.
- Reduce duplicated loading spinners and modal patterns into shared UI primitives.

### Performance
- Avoid loading progress for every roadmap one-by-one on the roadmap listing if the list grows large.
- Consider storing aggregated progress or using batched reads.
- Consider lazy-loading admin tabs with code splitting.
- Add Firestore indexes if filtering and ordering become more complex.

### Security
- Tighten Firestore rules so admin-only writes are truly enforced server-side.
- Move rating aggregate recalculation to Cloud Functions or Firestore transactions.
- Move privileged user management to backend functions.
- Remove or isolate `fix_rules.js` from normal workflows.
- Review direct client write access to roadmaps, resources, categories, and applications.

### Scalability
- Introduce server-side admin APIs/functions for moderation and content management.
- Add structured schema/versioning for roadmap documents.
- Add pagination to admin tables and large catalogs.
- Use subcollections or denormalized summary docs intentionally for dashboards if dataset grows.
- Track audit metadata for admin changes.

- `seedRealData.js` appears to assume category creation returns a usable ID directly; depending on the returned value, category references may be incorrect.
- Settings account deletion removes `users/{uid}/learningPaths`, but the main app currently stores progress under `userProgress`, so user data cleanup is incomplete.
- Firestore rules explicitly note admin enforcement is handled at app layer for some collections, which is not strong protection.
- Storage is configured but unusable because all rules deny access.

---

## UI Enhancements & Fixes

### Hover Animation System (v1.1)

A unified hover-lift animation system is applied globally across all interactive elements for a consistent, premium SaaS feel.

#### CSS Utilities (`src/index.css`)

| Class | Translation | Shadow | Use Case |
|---|---|---|---|
| `.hover-lift` | `-0.3rem` | `shadow-lg` | Buttons, cards, links |
| `.hover-lift-sm` | `-0.15rem` | `shadow-md` | Sidebar items, table rows, inputs |
| `.btn-primary` | `-0.5` Tailwind unit | Sky shadow lift | Primary CTA buttons |
| `.btn-ghost` | `-0.5` Tailwind unit | Border tint | Secondary buttons |
| `.card-hover` | `-1` Tailwind unit | `shadow-xl` + border tint | Content cards |

#### Animation Spec (Exact Values)
```css
transition-all duration-300 ease-out
hover:-translate-y-[0.3rem]
hover:shadow-lg
```

#### Applied To
- **Sidebar**: Nav items (`.hover-lift-sm`), logout button (`.hover-lift-sm`)
- **Landing HeroSection**: Primary CTA → 0.3rem, Secondary CTA → 0.3rem
- **FeaturesSection**: Feature cards → `hover:-translate-y-[0.3rem] duration-300 ease-out`
- **Dashboard**: All roadmap cards, app cards, tool cards (`hover:-translate-y-1`)
- **Admin Panel**: StatCard, TabButton, all action buttons

---

### Dashboard Progress Color Fix

#### Problem
`CircularProgress` component had hardcoded white text and a white SVG track circle — invisible in light mode.

#### Root Cause
```jsx
// ❌ Before (invisible in light mode)
<circle stroke="rgba(255,255,255,0.15)" ... />
<span className="text-3xl font-black text-white">{value}%</span>
```

#### Fix Applied (`src/pages/Dashboard.jsx`)
```jsx
// ✅ After — theme-aware
<circle className="text-slate-200 dark:text-slate-600" stroke="currentColor" ... />
<circle className="text-sky-500 dark:text-sky-400" stroke="currentColor" ... />
<span className="text-slate-900 dark:text-white font-black">{value}%</span>
```

---

### React Error Fixes

#### Error 1: "Cannot create components during render"

**Cause**: `DotGrid` component was declared inside the `PageBackground` render function body.

**Fix**: Moved `DotGrid` to module scope (outside the component) in `src/components/PageBackground.jsx`.

```jsx
// ❌ Wrong — inside component
const PageBackground = () => {
  const DotGrid = () => <div />;  // re-creates on every render
};

// ✅ Correct — module scope
const DotGrid = () => <div />;
const PageBackground = () => { ... };
```

#### Error 2: "Fast Refresh only works when a file only exports components"

**Cause**: `ThemeContext.jsx` exported both `ThemeProvider` (component) and `useTheme` (hook).

**Fix**:

1. Created `src/hooks/useTheme.js` — dedicated hook file:
   ```js
   import { useContext } from 'react';
   import { ThemeContext } from '../contexts/ThemeContext';
   export const useTheme = () => useContext(ThemeContext);
   ```

2. Updated `ThemeContext.jsx` to `export const ThemeContext = createContext()` so the hook file can import it.

3. Kept `useTheme` in `ThemeContext.jsx` as well for backward compatibility with existing component imports.

---

### Theme Toggle Placement Rules

`ThemeToggle` is now **strictly** placed in:
- ✅ **Sidebar footer** — visible on all authenticated pages
- ✅ **Admin Panel header** — for admin users
- ❌ **NOT** on auth pages (Login, Register, ForgotPassword, VerifyEmail)

---

### Dark/Light Mode Consistency Sweep

All remaining `white/5`, `white/10`, `black/20`, and `white/70` opacity patterns on `Dashboard`, `Settings`, and related pages were replaced with proper slate palette tokens (`dark:bg-slate-800`, `dark:border-slate-700`, `dark:text-slate-400`), ensuring consistent rendering in all themes.

---

### Hero Image Theme Switching

`HeroSection` now renders two `<img>` tags:
- `/landing.png` shown in light mode (`block dark:hidden`)
- `/landing-dark.png` shown in dark mode (`hidden dark:block`)

No flicker occurs because the anti-flicker script in `index.html` applies the `dark` class before React hydrates.

