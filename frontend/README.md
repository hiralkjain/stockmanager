# StockPilot AI – Modern Financial Intelligence Frontend

**StockPilot AI** is a minimal, premium-grade financial technology and stock analysis dashboard built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**. It integrates directly with the existing **Spring Boot backend** running at `http://localhost:8081`.

---

## 🚀 Key Highlights & Architectural Features

- **Strict Separation of Concerns**: Zero modifications made to the Spring Boot backend (`src/main/java`). The frontend operates as a self-contained, enterprise-grade React client in `/frontend`.
- **Light Fintech Aesthetic**: Clean white (`#FFFFFF`) and slate (`#F8FAFC`) surfaces, subtle emerald accents (`#10B981`) for positive financial yields, crisp charcoal headings (`#0F172A`), tabular numbers, and zero clutter or excessive gradients.
- **Backend-Synchronized DTOs**: 1-to-1 parity with Spring Boot records and entities:
  - `UserRegisterRequest`, `UserResponse`
  - `LoginRequest`, `AuthResponse`
  - `StockRequest`, `StockResponse`
  - `Watchlist`
- **Axios Interceptor Architecture**:
  - Automatically attaches `Authorization: Bearer <jwt_token>` to every authenticated request.
  - Intercepts `401 Unauthorized` responses and automatically triggers clean session termination and login redirection.
  - Normalized backend error parser translating `GlobalExceptionHandler` error maps into user-friendly notifications.
- **Future-Ready Modules**:
  - Full UI workspaces for **Portfolio Management** and **AI Insights**.
  - Distinctive `DemoBadge` pills clearly identifying simulated metrics and previews without faking backend endpoints.
- **Responsive Everywhere**:
  - Desktop: Collapsible sidebar navigation, comprehensive data tables, and rich interactive Recharts.
  - Mobile & Tablet: Slide-out navigation drawer, persistent bottom navigation thumb bar, touch-friendly horizontally scrollable cards and tables with zero horizontal overflow.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 18** | High-performance reactive component framework |
| **TypeScript** | Strict compile-time type safety across all DTOs and models |
| **Vite 6** | Ultra-fast next-gen build tool and development server |
| **Tailwind CSS** | Custom design system tailored for minimal fintech UI |
| **React Router 6** | Client-side routing with protected route guards |
| **Axios** | HTTP client with centralized interceptors & error handlers |
| **Lucide React** | Clean, modern iconography |
| **Recharts** | Interactive SVG financial area, line, and donut charts |
| **Context API** | Global session authentication and notification toast system |

---

## 📁 Project Structure

```
frontend/
├── index.html                   # HTML entry point with Inter & JetBrains Mono fonts
├── vite.config.ts               # Vite configuration with path aliases & chunk splitting
├── tailwind.config.js           # Minimal fintech color palette and typography
├── tsconfig.json                # Strict TypeScript configuration
├── .env                         # Centralized environment variables (VITE_API_BASE_URL)
├── .env.example                 # Environment template
└── src/
    ├── main.tsx                 # React application mounting point
    ├── App.tsx                  # Root router with protected layout hierarchy
    ├── index.css                # Tailwind directives & financial styling
    ├── vite-env.d.ts            # Vite environment typing declarations
    ├── types/                   # Backend DTOs & frontend state interfaces
    │   └── index.ts
    ├── services/                # Modular API services
    │   ├── api.ts               # Axios instance with Bearer interceptors
    │   ├── authService.ts       # Register & login APIs
    │   ├── stockService.ts      # Stocks CRUD APIs
    │   └── watchlistService.ts  # Watchlist APIs
    ├── context/                 # Global React contexts
    │   ├── AuthContext.tsx      # Token lifecycle, user session, logout
    │   └── ToastContext.tsx     # Toast notification system
    ├── utils/                   # Formatting and local caching
    │   ├── cn.ts                # Class merging utility
    │   ├── formatters.ts        # Currency ($), %, and date formatters
    │   └── storage.ts           # LocalStorage helpers (tokens, recents)
    ├── components/
    │   ├── common/              # Reusable atomic UI components
    │   │   ├── Button.tsx       # Primary, secondary, outline, ghost, danger
    │   │   ├── Input.tsx        # Styled input with icons & validation
    │   │   ├── Card.tsx         # Card container with title & actions
    │   │   ├── Badge.tsx        # Status pills
    │   │   ├── DemoBadge.tsx    # "Demo Preview" badge with tooltips
    │   │   ├── Modal.tsx        # Accessible dialog with escape & backdrop
    │   │   ├── Spinner.tsx      # Loading spinners & skeleton states
    │   │   └── EmptyState.tsx   # Polished empty list placeholders
    │   ├── layout/              # App shells & responsive navigation
    │   │   ├── Navbar.tsx       # Top bar with ticker search & market status
    │   │   ├── Sidebar.tsx      # Desktop navigation & API gateway status
    │   │   ├── MobileNav.tsx    # Responsive drawer menu for small screens
    │   │   ├── Layout.tsx       # Main responsive app wrapper & bottom bar
    │   │   └── ProtectedRoute.tsx # Route guard redirecting to /login
    │   ├── dashboard/           # Dashboard KPI widgets & quick actions
    │   ├── stocks/              # Stock tables, cards, and add/edit modal
    │   ├── watchlist/           # Watchlist tables and quick-add modal
    │   └── charts/              # Recharts financial visualizations
    └── pages/
        ├── Login/LoginPage.tsx          # Authentication login
        ├── Register/RegisterPage.tsx    # Account registration
        ├── Dashboard/DashboardPage.tsx  # Main analytics dashboard
        ├── Stocks/StocksPage.tsx        # Complete equities catalog
        ├── StockDetails/StockDetailsPage.tsx # Stock deep dive & charts
        ├── Watchlist/WatchlistPage.tsx  # User watchlist manager
        ├── Portfolio/PortfolioPage.tsx  # Future-ready portfolio tracker
        └── AIInsights/AIInsightsPage.tsx # AI stock analysis & chat workspace
```

---

## ⚙️ Backend API Integration

The frontend connects to the Spring Boot REST backend:

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users/register` | Register new user account | No |
| `POST` | `/api/users/login` | Authenticate & receive JWT token | No |
| `GET` | `/api/stocks` | Fetch all registered stocks | **Yes** (Bearer) |
| `GET` | `/api/stocks/{id}` | Fetch individual stock details | **Yes** (Bearer) |
| `POST` | `/api/stocks` | Create a new stock in database | **Yes** (Bearer) |
| `PUT` | `/api/stocks/{id}` | Update existing stock | **Yes** (Bearer) |
| `DELETE` | `/api/stocks/{id}` | Delete stock from database | **Yes** (Bearer) |
| `GET` | `/api/watchlist` | Retrieve user's personal watchlist | **Yes** (Bearer) |
| `POST` | `/api/watchlist/{stockId}` | Add stock to user's watchlist | **Yes** (Bearer) |
| `DELETE` | `/api/watchlist/{stockId}` | Remove stock from watchlist | **Yes** (Bearer) |

---

## 🏃 Getting Started & Execution Instructions

### Prerequisites
- **Node.js** (v18.0.0 or later, v20+ recommended)
- **npm** (v9+ or later)
- **Spring Boot Backend** running on port `8081` (`mvn spring-boot:run` from root)

### Step 1: Configure Environment Variables
Inside the `frontend` folder, verify `.env`:
```env
VITE_API_BASE_URL=http://localhost:8081
```

### Step 2: Install Dependencies
```bash
cd frontend
npm install
```

### Step 3: Run the Development Server
```bash
npm run dev
```
The application will launch at:
```
http://localhost:3000
```

### Step 4: Build for Production
To generate an optimized production bundle:
```bash
npm run build
```
Production assets are output to `frontend/dist/`.

To preview the production build locally:
```bash
npm run preview
```

---

## 💡 Quick Tips for First-Time Run
1. If the Spring Boot backend database is fresh, register a user account at `/register` (passwords require 8+ characters per backend validation).
2. On first login, visit the **Stocks** page. A convenient **"Seed Sample Tickers"** button is available to instantly pre-populate popular market stocks (AAPL, NVDA, MSFT, AMZN, GOOGL, TSLA, etc.) into your Spring Boot database with one click.
3. Add any ticker to your **Watchlist** to see live synchronization across the Dashboard and Watchlist pages!
