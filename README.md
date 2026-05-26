# MindGrow

MindGrow is a personal mental wellbeing and interpersonal skills coach built as a Progressive Web Application (PWA). It is designed to map out users' strengths and growth areas via a personality test, provide daily bite-sized training exercises, and track progress over time.

## 🚀 Features
- **Interpersonal Skills Assessment**: A 20-question test evaluating 6 key areas: Humour, Empathy, Conflict Resolution, Listening, Assertiveness, and Warmth.
- **Personalized Training**: Real-world scenarios with instant AI-driven feedback utilizing Anthropic's Claude.
- **Skill Radar & Tracking**: Visual tracking of user progress through Recharts radar charts.
- **Resource Library**: Curated recommendations for books and TED talks tailored to specific interpersonal skills.
- **Progressive Web App**: Installable locally with a custom minimalistic brain logo and dark-styled bottom navigation.

## 🏗️ Architecture

MindGrow is a single-page React application scaffolded with [Vite](https://vitejs.dev/).

### Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Vanilla CSS with custom inline React styles and the 'Inter' web font.
- **Data Visualization**: Recharts (for the Skill Radar displaying profile stats).
- **AI Integration**: Direct integration with Anthropic's Claude API to provide context-aware feedback for interpersonal exercises.
- **State Management**: React Hooks (`useState`, `useEffect`, `useMemo`) and `localStorage` to persist all user data per device.
- **Deployment**: Currently configured for continuous delivery on [Vercel](https://vercel.com/).

### File Structure Overview

```bash
mindgrow/
├── src/
│   ├── App.jsx          # All screens, components, and app logic
│   ├── App.css          # Global styles
│   ├── index.css        # Base CSS reset
│   ├── main.jsx         # React entry point
│   └── assets/          # Static assets (icons, images)
├── public/              # PWA manifest, favicon
├── index.html
├── vite.config.js
└── package.json
```

### App Structure Description
- `src/App.jsx`
  The core of the application housing all logic and UI components:
  - **Data Definitions (`SKILL_META`, `TEST_QUESTIONS`, `EXERCISES`, `RESOURCES_DATA`)**: Static content powering the test, exercises, and library.
  - **Screens**:
    - `HomeScreen`: Shows daily streak, top 3 weakest skills to train, and overall snapshot. First-time users see an assessment CTA instead of placeholder scores.
    - `TestScreen`: The 20-question interpersonal skills assessment.
    - `ResultsScreen`: Displays the comprehensive skill radar and focus areas.
    - `TrainScreen`: The hub to pick exercises across different categories.
    - `ExerciseScreen`: Interactive scenarios where users choose the best response and receive AI feedback on their choice. Answer options are randomised each session.
    - `ProfileScreen`: Shows user achievements, general scores, and full skill radar. Displays an empty state prompt for first-time users.
    - `ResourcesScreen`: A curated list of clickable books and videos for further learning.
    - `OnboardingScreen`: Introduction to the app with the ability to bypass if previously seen.
  - **Routing/Navigation**: Handled via simple state management (`screen`, `prevScreen`) and a custom `BottomNav` component.

## 🛠️ Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Run the development server**:
   ```bash
   npm run dev
   ```
3. **Build for production**:
   ```bash
   npm run build
   ```

## 🧠 Design Philosophy
The UI relies heavily on a clean, modern aesthetic utilizing glassmorphism-inspired transparency, warm dynamic colors assigned to individual skills, scalable vector graphics (SVG) for the primary brain icon, and responsive layouts capable of running seamlessly on both mobile devices and desktops.

---

## 📋 Changelog

### [v1.2] — 2026-05-26

#### 🐛 Bug Fixes
- **Per-device data isolation**: All user data (scores, completed exercises, streak) is now persisted to `localStorage`. Each device/browser has completely independent state — no shared defaults across users.
- **First-launch empty state**: New users no longer see placeholder/dummy scores on the Home and Profile screens. Instead, they are shown a prominent "Take your first assessment" call-to-action. Scores only appear after the test is completed.
- **Randomised exercise answer positions**: Correct answers in exercises are now shuffled using a Fisher-Yates algorithm each session, so the correct option is no longer always option B.

#### ✨ Improvements
- **Time-based greeting**: The home screen greeting now dynamically reflects the time of day — *Good Morning ☀️*, *Good Afternoon 👋*, *Good Evening 🌆*, or *Good Night 🌙*.
- **Interactive resource links**: Books in the Learn tab now open a Google search when tapped. TED Talk videos open directly on ted.com, and YouTube videos open on YouTube — all in a new tab. Each card also shows a hover effect and an ↗ external link indicator.
- **Daily streak tracking**: Streak is now calculated from actual daily visit timestamps stored in `localStorage`, replacing the previous hardcoded value.
- **Offline-ready**: Since all state is stored locally, the app works fully offline after the initial load.

---

### [v1.0] — Initial Release

- 20-question interpersonal skills assessment across 6 skill areas
- Skill radar chart and score breakdown on results screen
- Daily exercise hub with scenario-based training and AI coach feedback (Claude)
- Resource library with curated books and videos per skill
- User profile with achievements and skill breakdown
- Onboarding flow for new users
- Deployed on Vercel
