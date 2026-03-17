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
- **State Management**: React Hooks (`useState`, `useEffect`) and `localStorage` to persist the onboarding state.
- **Deployment**: Currrently configured for continuous delivery on [Vercel](https://vercel.com/).

### File Structure Overview

```text
mindgrow/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── dashboard/page.tsx
│   ├── train/
│   │   ├── page.tsx
│   │   └── [exerciseId]/page.tsx
│   ├── test/
│   │   ├── page.tsx
│   │   └── results/page.tsx
│   ├── resources/page.tsx
│   ├── profile/page.tsx
│   └── api/
│       ├── feedback/route.ts       ← Claude API call
│       ├── generate-exercises/route.ts
│       └── test-results/route.ts
├── components/
│   ├── ui/                         ← Buttons, cards, badges
│   ├── exercises/                  ← ExerciseCard, ExerciseFeed
│   ├── charts/                     ← RadarChart, StreakCalendar
│   └── test/                       ← QuestionCard, ProgressBar
├── lib/
│   ├── anthropic.ts                ← Claude client setup
│   ├── db.ts                       ← Supabase client
│   └── scoring.ts                  ← Test scoring algorithm
└── tailwind.config.ts
```

### App Structure Description
- `src/App.jsx`
  The core of the application housing all logic and UI components:
  - **Data Definitions (`SKILL_META`, `TEST_QUESTIONS`, `EXERCISES`, `RESOURCES_DATA`)**: Static content powering the test, exercises, and library.
  - **Screens**:
    - `HomeScreen`: Shows daily streak, top 3 weakest skills to train, and overall snapshot.
    - `TestScreen`: The 20-question interpersonal skills assessment.
    - `ResultsScreen`: Displays the comprehensive skill radar and focus areas.
    - `TrainScreen`: The hub to pick exercises across different categories.
    - `ExerciseScreen`: Interactive scenarios where users choose the best response and receive AI feedback on their choice.
    - `ProfileScreen`: Shows user achievements, general scores, and full skill radar.
    - `ResourcesScreen`: A curated list of books and videos for further learning.
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
