# Smart Path AI Guide

## AI Working Guidelines

### Project Summary
Smart Path is a React + Firebase learning platform with a public landing page, protected learner area, and admin panel. The core learning model is roadmap-based: each roadmap contains weeks, each week contains lessons, and lesson completion is gated by an AI-generated quiz. Authentication uses Firebase Auth with mandatory email verification. After verification, the app creates or loads a Firestore profile in `users/{uid}`. Non-admin users must complete onboarding before reaching the dashboard. User progress is stored in `userProgress`, including the active roadmap and completed lessons. The dashboard personalizes content using saved interests. Admins manage users, categories, resources, roadmaps, lessons, and applications from a single page. AI is used only in the Cloud Function `generateQuiz`, which calls Groq and caches quizzes in Firestore. The frontend talks directly to Firestore through service modules in `src/services/`.

## Key Rules AI Must Follow

### Before Making Changes
1. Read `src/App.jsx` to understand route ownership.
2. Read `src/contexts/AuthContext.jsx` before changing auth, onboarding, profile, or admin behavior.
3. Read the matching file in `src/services/` before editing a page that uses Firestore data.
4. If touching quizzes or lesson completion, also read `functions/index.js` and `src/components/QuizModal.jsx`.
5. Check `firestore.rules` before assuming a feature is truly protected.

### Coding Rules
- Keep using function components and React hooks.
- Prefer extending service modules instead of placing raw Firestore logic inside page components.
- Preserve current Firestore collection names and path structure unless a migration is intentional.
- Keep Tailwind utility styling in JSX unless refactoring to an existing shared abstraction.
- Match existing naming style: camelCase functions, PascalCase components, verb-first service methods.
- Preserve Arabic user-facing text unless the task explicitly changes content/language.

### Safe Modification Strategy
- For auth/profile changes, update all dependent layers together:
  - `AuthContext`
  - route guards
  - onboarding
  - settings
  - dashboard
- For roadmap data changes, verify compatibility across:
  - `roadmapService.js`
  - `progressService.js`
  - `RoadmapsPage.jsx`
  - `RoadmapLearning.jsx`
  - `AdminPage.jsx`
- For admin features, remember the UI currently acts as the main gate. If the task involves security, also update rules or backend logic.
- For new privileged logic, prefer Cloud Functions over client-only writes.

## Important Files to Always Check

### Routing and App Flow
- `src/App.jsx`
- `src/components/ProtectedRoute.jsx`
- `src/components/PublicRoute.jsx`
- `src/components/AdminRoute.jsx`

### Auth and User Profile
- `src/contexts/AuthContext.jsx`
- `src/lib/firebase.js`
- `src/auth/Login.jsx`
- `src/auth/Register.jsx`
- `src/pages/VerifyEmail.jsx`
- `src/pages/Onboarding.jsx`
- `src/pages/Settings.jsx`

### Learning Flow
- `src/pages/Dashboard.jsx`
- `src/pages/RoadmapsPage.jsx`
- `src/pages/RoadmapLearning.jsx`
- `src/components/QuizModal.jsx`
- `src/services/roadmapService.js`
- `src/services/progressService.js`
- `src/services/ratingService.js`

### Admin and Content
- `src/pages/AdminPage.jsx`
- `src/services/adminService.js`
- `src/services/categoryService.js`
- `src/services/resourceService.js`
- `src/services/applicationService.js`

### Backend and Rules
- `functions/index.js`
- `firebase.json`
- `firestore.rules`
- `storage.rules`

## Common Pitfalls

### Profile Field Inconsistency
- Onboarding writes `dailyStudyHours`.
- Settings reads/writes `dailyHours`.
- Some route logic checks `isOnboarded`, `onboardingCompleted`, and `profileCompleted`.
- Do not add new profile fields without reconciling these existing mismatches.

### Emulator Setup Duplication
- `src/lib/firebase.js` already connects to emulators when local.
- `src/auth/Register.jsx` also calls `connectAuthEmulator(...)` directly.
- Be careful not to introduce duplicate initialization errors.

### Security Assumptions
- Many writes are allowed to any authenticated user in Firestore rules.
- Admin-only behavior is often enforced only in the UI.
- Do not describe the app as securely admin-protected unless rules/backend are tightened.

### Progress and Completion Logic
- Lesson unlock depends on ordered lesson lists and previous lesson completion.
- Do not change lesson ordering or progress doc structure casually.
- Quiz passing is the completion gate; bypassing it changes product behavior.

### Account Deletion Is Incomplete
- Settings deletes `users/{uid}/learningPaths`, but actual learning progress is stored in `userProgress`.
- If you touch account deletion, review all user-owned collections.

### Seed Utilities Are Not Fully Safe
- `src/utils/seedRealData.js` may store category references incorrectly depending on returned values.
- Treat seeding code as helper tooling, not as a correctness reference for runtime behavior.

## Safe Modification Checklist
1. Identify the route/page affected.
2. Read the corresponding service file.
3. Confirm the Firestore document shape currently used.
4. Check route guards if auth or onboarding is involved.
5. Check admin impact if content collections are changed.
6. Check quiz/progress impact if lessons or roadmap structures are changed.
7. Update rules/functions too if the change should be privileged or validated.

## Debugging Guide for AI

### If Login/Redirects Break
- Inspect `AuthContext.jsx`.
- Verify whether the user is authenticated, verified, and has a Firestore profile.
- Check `ProtectedRoute.jsx` and `PublicRoute.jsx` conditions.

### If Onboarding or Settings Values Look Wrong
- Compare field names in `Onboarding.jsx`, `Settings.jsx`, `AuthContext.jsx`, and the Firestore profile.

### If Roadmaps or Lessons Break
- Inspect `roadmapService.js`, `progressService.js`, `RoadmapsPage.jsx`, and `RoadmapLearning.jsx`.
- Verify roadmap/week/lesson IDs and `order` values.

### If Quiz Generation Fails
- Check `functions/index.js`
- Verify `GROQ_API_KEY`
- Check Firebase Functions logs
- Inspect `quizCache` behavior

### If Admin Actions Fail
- Check whether the issue is:
  - missing client role
  - Firestore rule denial
  - invalid collection path
  - stale local UI state after mutation

## Best Practices for AI Contributions
- Make small, localized changes unless a cross-cutting fix is necessary.
- Keep data access centralized in service modules.
- Prefer preserving current UX flow over rewriting screens.
- If you discover a schema inconsistency, fix all affected consumers together or document the limitation clearly.
- When adding a feature with security implications, do not stop at the UI if backend enforcement is required.

## AI Context Memory

### Short Project Memory
- React SPA built with Vite and Tailwind.
- Firebase Auth + Firestore are the main backend services.
- Cloud Functions contains one main AI feature: quiz generation.
- Verified email is required before user profiles are loaded.
- `AuthContext` is the source of truth for auth/profile/admin state.
- Onboarding is mandatory for non-admin users.
- Roadmaps are hierarchical: roadmap -> weeks -> lessons.
- User progress lives in `userProgress`, not under `users`.
- Lesson completion is quiz-gated and sequential.
- Admin page performs content CRUD directly from the client.
- Firestore rules are currently broad and do not fully enforce admin-only writes.
- Settings/account/profile fields are not fully normalized.

### Non-Negotiable Rules
- Do not break auth redirects.
- Do not break onboarding gating.
- Do not break active roadmap storage in `userProgress/{uid}`.
- Do not break lesson unlock ordering.
- Do not bypass quiz completion unless intentionally changing product behavior.
- Do not assume UI-only admin checks are secure.

### Preferred File Read Order for Any Non-Trivial Task
1. `src/App.jsx`
2. `src/contexts/AuthContext.jsx`
3. Relevant page file
4. Relevant `src/services/*`
5. `functions/index.js` if AI/quiz/backend behavior is involved
6. `firestore.rules` if permissions matter
