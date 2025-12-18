# Personal Finance Tracker

A modern, feature-rich personal finance tracking application built with Next.js, TypeScript, and Material UI. This application demonstrates professional front-end development practices including authentication, state management, API architecture, form validation, and comprehensive user experience features.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [Demo Credentials](#-demo-credentials)
- [Project Structure](#-project-structure)
- [Architecture Decisions](#-architecture-decisions)
- [API Architecture](#-api-architecture)
- [State Management](#-state-management)
- [Development Guidelines](#-development-guidelines)
- [Deployment](#-deployment)

## 🎯 Features

### Core Requirements (Assignment)
✅ **Login & Authentication**
- Email/password authentication with validation
- Session persistence
- Protected routes
- User-friendly error messages

✅ **Dashboard**
- Total income, expenses, and net balance summary
- Transaction list with filtering and sorting
- Real-time updates

✅ **Transaction Management**
- Add, edit, and delete transactions
- Form validation
- Immediate summary updates
- Advanced filtering and sorting

### Bonus Features
- **Budgets**: Create, manage, and share budgets
- **Financial Goals**: Track savings and debt payoff goals
- **Reports & Analytics**: Comprehensive financial reports
- **Recurring Transactions**: Automated transaction scheduling
- **Custom Categories**: Personalized category management
- **Global Search**: Quick search across all data
- **Keyboard Shortcuts**: Productivity shortcuts
- **Tutorial & Demo Mode**: Interactive onboarding
- **Multi-language**: English and Spanish support
- **Dark Mode**: Modern theme with light/dark modes

## 🧱 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v7
- **State Management**: Zustand with persist middleware
- **Internationalization**: i18next & react-i18next
- **Data Persistence**: localStorage (via Zustand persist)
- **Styling**: Material UI theming system
- **Typography**: Inter (UI) + JetBrains Mono (numbers)
- **Animations**: Framer Motion
- **Charts**: Recharts

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18 or higher ([Download](https://nodejs.org/))
- **npm**: Comes with Node.js (or use yarn/pnpm)
- **Git**: For cloning the repository

### Verify Installation

```bash
node --version  # Should be v18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

## 🚀 Installation

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd financeapp
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies listed in `package.json`. The installation process may take a few minutes.

### Step 3: Verify Installation

After installation, you should see a `node_modules` folder in your project directory. If you encounter any errors, try:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 🏃 Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at:
- **Local**: [http://localhost:3000](http://localhost:3000)
- **Network**: The terminal will display the network URL

The development server includes:
- Hot Module Replacement (HMR) for instant updates
- Error overlay for debugging
- Fast Refresh for React components

### Production Build

To create an optimized production build:

```bash
# Build the application
npm run build

# Start the production server
npm start
```

The production build will be available at [http://localhost:3000](http://localhost:3000)

### Linting

Check code quality with ESLint:

```bash
npm run lint
```

### Testing

Run unit tests:

```bash
# Run tests in watch mode
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

The test suite includes:
- **Utility Functions**: Format and category utilities
- **Store Tests**: Authentication and finance store logic
- **Component Tests**: Critical components (Login, ProtectedRoute, EmptyState)
- **Hook Tests**: Custom hooks (useKeyboardShortcuts)

## 🔑 Demo Credentials

The application includes demo users for testing different subscription plans:

| Email | Password | Plan | Description |
|-------|----------|------|-------------|
| `demo@example.com` | `demo123` | Basic | Free plan with limited features |
| `standard@example.com` | `standard123` | Standard | Standard plan with more features |
| `premium@example.com` | `premium123` | Premium | Premium plan with all features |

### First Time Setup

1. Navigate to the login page
2. Use any of the demo credentials above
3. You'll be redirected to the dashboard after successful login
4. Data persists in browser localStorage

## 📁 Project Structure

```
financeapp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── login/             # Login page
│   │   ├── register/          # Registration page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── transactions/      # Transactions management
│   │   ├── budgets/           # Budget management
│   │   ├── goals/             # Financial goals
│   │   ├── reports/           # Reports & analytics
│   │   ├── recurring/         # Recurring transactions
│   │   ├── categories/        # Custom categories
│   │   ├── profile/           # User profile & billing
│   │   ├── settings/          # Application settings
│   │   ├── blog/              # Blog articles
│   │   ├── contact/           # Contact page
│   │   ├── about/             # About page
│   │   ├── terms/             # Terms of service
│   │   ├── privacy/           # Privacy policy
│   │   └── layout.tsx         # Root layout with providers
│   │
│   ├── components/
│   │   ├── Layout/            # Layout components
│   │   │   ├── AppLayout.tsx  # Main app layout
│   │   │   ├── Navbar.tsx     # Landing navbar
│   │   │   └── Footer.tsx     # Footer component
│   │   ├── auth/                # Authentication
│   │   │   └── ProtectedRoute.tsx
│   │   └── common/            # Reusable components
│   │       ├── EmptyState.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── LanguageModal.tsx
│   │       ├── PageTransition.tsx
│   │       ├── AlertsPanel.tsx
│   │       ├── GlobalSearch.tsx
│   │       ├── KeyboardShortcutsDialog.tsx
│   │       ├── TutorialTour.tsx
│   │       ├── TutorialLauncher.tsx
│   │       └── DemoModeBanner.tsx
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useTutorial.ts
│   │   └── useKeyboardShortcuts.ts
│   │
│   ├── store/                 # Zustand state stores
│   │   ├── financeStore.ts    # Financial data store
│   │   └── authStore.ts       # Authentication store
│   │
│   ├── types/                 # TypeScript definitions
│   │   └── index.ts
│   │
│   ├── utils/                 # Utility functions
│   │   ├── categories.ts
│   │   ├── format.ts
│   │   ├── translateCategory.ts
│   │   └── tutorialSteps.ts
│   │
│   ├── i18n/                  # Internationalization
│   │   ├── config.ts
│   │   └── locales/
│   │       ├── en.json
│   │       └── es.json
│   │
│   └── theme/                 # MUI theme configuration
│       └── theme.ts
│
├── public/                    # Static assets
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── tsconfig.json
└── README.md
```

## 🏗️ Architecture Decisions

### Framework Choice: Next.js 16

**Decision**: Use Next.js 16 with App Router

**Rationale**:
- **Server-Side Rendering (SSR)**: Better SEO and initial load performance
- **File-based Routing**: Intuitive routing structure
- **API Routes**: Built-in support for API endpoints (mocked in this project)
- **Optimization**: Automatic code splitting and image optimization
- **TypeScript**: Excellent TypeScript support out of the box

**Trade-offs**:
- Learning curve for App Router (vs Pages Router)
- Some React Server Components limitations in client-heavy apps

### State Management: Zustand

**Decision**: Use Zustand for global state management

**Rationale**:
- **Simplicity**: Minimal boilerplate compared to Redux
- **TypeScript**: Excellent type inference and support
- **Persistence**: Built-in middleware for localStorage persistence
- **Performance**: Lightweight and performant
- **Developer Experience**: Easy to learn and use

**Implementation**:
- Separate stores for `authStore` (authentication) and `financeStore` (financial data)
- Persist middleware for data persistence across sessions
- Computed values as store methods for derived state

**Trade-offs**:
- Less ecosystem compared to Redux
- No built-in DevTools (though available via extension)

### UI Library: Material-UI (MUI)

**Decision**: Use Material-UI v7 for component library

**Rationale**:
- **Accessibility**: Built-in ARIA support and keyboard navigation
- **Theming**: Powerful theming system for light/dark modes
- **Components**: Comprehensive component library
- **Customization**: Flexible styling with `sx` prop and theme overrides
- **Community**: Large community and extensive documentation

**Customization**:
- Custom color palette (violet/amber for dark mode)
- Custom typography (Inter + JetBrains Mono)
- Custom component overrides

### API Architecture

**Decision**: Mock API layer with clear separation

**Rationale**:
- **Backend-Ready**: Structure allows easy integration with real backend
- **Development**: No backend dependency for development
- **Testing**: Easy to test different scenarios
- **Demonstration**: Shows understanding of API communication patterns

**Implementation**:
- Authentication: Mocked in `authStore.ts` with in-memory user database
- Financial Data: Managed through Zustand store (would be API calls in production)
- Error Handling: Graceful error handling with user-friendly messages
- Loading States: Proper loading indicators for async operations

**Production Migration**:
To integrate with a real backend:
1. Replace store actions with API calls
2. Use Next.js API routes or external API
3. Add proper error handling and retry logic
4. Implement authentication tokens (JWT, etc.)

### Internationalization: i18next

**Decision**: Use i18next for internationalization

**Rationale**:
- **Flexibility**: Supports multiple languages easily
- **Browser Detection**: Automatic language detection
- **Namespace Support**: Organized translation files
- **React Integration**: Excellent react-i18next integration

**Implementation**:
- English (en) and Spanish (es) support
- Translation files in JSON format
- Language switcher in UI
- Browser language detection

### Data Persistence: localStorage

**Decision**: Use localStorage via Zustand persist middleware

**Rationale**:
- **Simplicity**: No backend required
- **Persistence**: Data survives browser sessions
- **Performance**: Fast read/write operations
- **Demo Purpose**: Suitable for demonstration

**Limitations**:
- Limited storage (~5-10MB)
- Browser-specific (not synced across devices)
- No server backup

**Production Considerations**:
- Would use backend API for data persistence
- Implement data synchronization
- Add backup/export functionality

## 🔌 API Architecture

### Current Implementation (Mocked)

The application uses a mocked API layer that simulates backend communication:

#### Authentication API

```typescript
// Mocked in authStore.ts
login(email: string, password: string): Promise<{ success: boolean; error?: string }>
register(email: string, password: string, name: string): Promise<{ success: boolean; error?: string }>
logout(): void
```

#### Financial Data API

```typescript
// Mocked in financeStore.ts
addTransaction(transaction: Omit<Transaction, 'id'>): void
updateTransaction(id: string, updates: Partial<Transaction>): void
deleteTransaction(id: string): void
addBudget(budget: Omit<Budget, 'id'>): void
// ... etc
```

### Production API Integration

To integrate with a real backend:

1. **Create API Service Layer**:
```typescript
// src/services/api.ts
export const api = {
  transactions: {
    getAll: () => fetch('/api/transactions'),
    create: (data) => fetch('/api/transactions', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => fetch(`/api/transactions/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => fetch(`/api/transactions/${id}`, { method: 'DELETE' }),
  },
  // ... other endpoints
}
```

2. **Update Store Actions**:
```typescript
// Replace direct state updates with API calls
addTransaction: async (transaction) => {
  const response = await api.transactions.create(transaction);
  const data = await response.json();
  set((state) => ({ transactions: [...state.transactions, data] }));
}
```

3. **Add Error Handling**:
```typescript
try {
  const response = await api.transactions.create(transaction);
  if (!response.ok) throw new Error('Failed to create transaction');
  // ... handle success
} catch (error) {
  // ... handle error with user-friendly message
}
```

## 🗄️ State Management

### Store Structure

#### authStore
- **Purpose**: Authentication and user management
- **Data**: User info, authentication state, payments, subscriptions
- **Persistence**: User session and authentication state

#### financeStore
- **Purpose**: Financial data management
- **Data**: Transactions, budgets, goals, categories, settings
- **Persistence**: All financial data

### State Updates

State updates follow a unidirectional data flow:
1. User action triggers store method
2. Store method updates state
3. Components re-render with new state
4. Persist middleware saves to localStorage

### Computed Values

Derived state is computed via store methods:
```typescript
getBalance: () => getTotalIncome() - getTotalExpenses()
getCategorySpending: (category) => { /* calculation */ }
```

## 💻 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended configuration
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions

### Component Structure

```typescript
// Component structure template
'use client';

import { useState } from 'react';
import { ComponentProps } from '@/types';

interface ComponentNameProps {
  // Props definition
}

export default function ComponentName({ props }: ComponentNameProps) {
  // Hooks
  // State
  // Handlers
  // Effects
  // Render
}
```

### File Organization

- **Pages**: One file per route in `src/app/`
- **Components**: Grouped by feature in `src/components/`
- **Utils**: Pure functions in `src/utils/`
- **Types**: Shared types in `src/types/`

### Best Practices

1. **Type Safety**: Always use TypeScript types
2. **Error Handling**: Graceful error handling with user feedback
3. **Loading States**: Show loading indicators for async operations
4. **Validation**: Client-side validation for all forms
5. **Accessibility**: Use semantic HTML and ARIA labels
6. **Performance**: Use `useMemo` and `useCallback` appropriately

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Vercel auto-detects Next.js
4. Deploy!

### Other Platforms

The application can be deployed to any platform supporting Next.js:
- **Netlify**: Similar to Vercel
- **AWS Amplify**: AWS hosting
- **Docker**: Containerized deployment
- **Self-hosted**: Node.js server

### Environment Variables

Currently, no environment variables are required. For production with a backend:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_API_KEY=your-api-key
```

## 📚 Additional Resources

### Keyboard Shortcuts

- `Ctrl+Shift+K` / `Cmd+Shift+K`: Open global search (also available via search icon)
- `Ctrl+?` / `Cmd+?`: Open keyboard shortcuts dialog
- `Esc`: Close modals/dialogs
- `Enter`: Save forms
- `Esc`: Cancel forms

**Note**: All keyboard shortcuts are also accessible via visible UI icons, making the application usable for users who don't know keyboard shortcuts.

### Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design

## 🐛 Troubleshooting

### Common Issues

**Issue**: `npm install` fails
- **Solution**: Clear cache and reinstall: `npm cache clean --force && npm install`

**Issue**: Port 3000 already in use
- **Solution**: Use different port: `npm run dev -- -p 3001`

**Issue**: TypeScript errors
- **Solution**: Run `npm run lint` to identify issues

**Issue**: Data not persisting
- **Solution**: Check browser localStorage is enabled

## 📄 License

This project is created as a technical assignment demonstration.

## 👤 Author

Built as a front-end technical assignment showcasing:
- React fundamentals and hooks
- State management patterns
- Component architecture
- UI/UX design thinking
- Clean, maintainable code
- TypeScript best practices
- Modern web development techniques
- API architecture understanding
- Error handling and validation
- Performance optimization

---

**Note**: This application is a demonstration project. In a production environment, it would include:
- Real backend API integration
- Database for data persistence
- User authentication with JWT tokens
- Server-side validation
- Rate limiting and security measures
- Comprehensive testing suite
- CI/CD pipeline
- Monitoring and logging
