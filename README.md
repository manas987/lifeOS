# 🧬 LifeOS

A personal life management dashboard built with React and TypeScript. Track your tasks, habits, and finances — all in one place with a clean, glassmorphic UI.

## ✨ Features

### 📊 Dashboard
- Unified overview of tasks, habits, and finances at a glance
- **Income vs Expense** area chart with time-range filters (week / month / all)
- **Expense & Income breakdowns** via pie charts by category
- **Productivity overview** chart tracking habits and tasks completed over time
- **Smart alerts** — overdue tasks, overspending warnings, broken habit streaks, upcoming subscriptions
- Account balances summary and today's due tasks

### ✅ Tasks
- **Inbox** — capture all incoming tasks
- **Today** — focus on what's due now
- **Upcoming** — plan ahead with future tasks
- **Completed** — review what you've accomplished
- **Projects** — organize tasks under named projects with dedicated project pages
- Sidebar navigation with project management
- Drag-and-drop support via `@dnd-kit`

### 💰 Finances
- **Dashboard** — financial overview with charts and summaries
- **Transaction logs** — record income and expenses with categories
- **Debt tracking** — keep tabs on money owed
- **Subscriptions** — track recurring payments and due dates
- Multi-account support with balance tracking
- Custom categories for income and expenses

### 🔁 Habits
- Create and track daily habits
- **Streak tracking** — see how many consecutive days you've maintained a habit
- **Day-of-week scheduling** — set which days each habit repeats on
- Completion history with date-based tracking
- All habits view and inbox view

### 🌗 Dark Mode
- Toggle between light and dark themes
- Gradient backgrounds that adapt to the current mode
- Glassmorphism card styling throughout

## 🛠 Tech Stack

| Layer        | Technology                                         |
| ------------ | -------------------------------------------------- |
| Framework    | [React 19](https://react.dev) + TypeScript         |
| Build Tool   | [Vite 7](https://vite.dev)                         |
| Routing      | [React Router v7](https://reactrouter.com)         |
| Styling      | [Tailwind CSS 3](https://tailwindcss.com)          |
| UI Library   | [shadcn/ui](https://ui.shadcn.com) (Radix + CVA)  |
| Charts       | [Recharts](https://recharts.org)                   |
| Icons        | [Lucide React](https://lucide.dev)                 |
| Drag & Drop  | [@dnd-kit](https://dndkit.com)                     |
| Date Utils   | [date-fns](https://date-fns.org)                   |
| Deployment   | [Vercel](https://vercel.com)                       |

## 📁 Project Structure

```
src/
├── App.tsx                  # Root component with route definitions
├── main.tsx                 # Entry point with providers
├── navbar.tsx               # Top navigation bar with theme toggle
├── index.css                # Global styles & Tailwind config
│
├── context/
│   └── AppContext.tsx        # Global state provider (tasks, habits, finance)
│
├── components/
│   └── ui/                  # shadcn/ui primitives (Button, Calendar, Popover)
│
├── lib/
│   └── utils.ts             # Utility helpers (cn, etc.)
│
└── pages/
    ├── dashboard/
    │   └── dashboard.tsx     # Main dashboard with charts & stats
    │
    ├── tasks/
    │   ├── tasks.tsx         # Tasks layout shell
    │   ├── sidebar.tsx       # Task sidebar navigation
    │   ├── taskcard.tsx      # Reusable task card component
    │   ├── logic/
    │   │   ├── tasklogic.tsx  # Task state management hook
    │   │   ├── taskutils.ts  # Task helper functions
    │   │   └── types.ts      # Task type definitions
    │   └── subpages/
    │       ├── taskinbox.tsx
    │       ├── tasktoday.tsx
    │       ├── taskupcom.tsx
    │       ├── taskcompleted.tsx
    │       └── projects.tsx
    │
    ├── finance/
    │   ├── finance.tsx       # Finance layout shell
    │   ├── finsidebar.tsx    # Finance sidebar navigation
    │   ├── financecards.tsx  # Reusable finance card components
    │   ├── logic/
    │   │   ├── logic.tsx     # Finance state management hook
    │   │   └── types.ts      # Finance type definitions
    │   └── pages/
    │       ├── dashboard.tsx
    │       ├── logs.tsx
    │       ├── Debt.tsx
    │       └── subscriptions.tsx
    │
    └── habits/
        ├── habits.tsx        # Habits layout shell
        ├── hsidebar.tsx      # Habits sidebar navigation
        ├── habitscard.tsx    # Reusable habit card component
        ├── logic/
        │   ├── logic.tsx     # Habits state management hook
        │   └── types.ts      # Habit type definitions
        └── pages/
            ├── habbits.tsx   # All habits view
            └── inbox.tsx     # Habits inbox view
```

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 18
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/life-tracker.git
cd life-tracker

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview   # Preview the production build locally
```

### Lint

```bash
npm run lint
```

## 🌐 Deployment

The project includes a `vercel.json` with SPA rewrites configured. Deploy to Vercel with:

```bash
npx vercel
```

Or connect the GitHub repository to [Vercel](https://vercel.com) for automatic deployments.

## 📄 License

This project is for personal use. Feel free to fork and adapt it to your own needs.
