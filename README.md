# Personal Finance Tracker

A modern, feature-rich personal finance tracking application built with Next.js, TypeScript, and Material UI. Track your income, expenses, manage budgets, set financial goals, and monitor your financial health—all with data stored locally in your browser.

## 🎯 Features

### Dashboard
- **Total Balance**: View your current financial balance
- **Total Income**: Track all income sources
- **Total Expenses**: Monitor all expenses
- **Recent Transactions**: Quick view of your latest transactions
- **Financial Insights**: AI-powered insights and recommendations
- **Category Analysis**: Detailed breakdown of spending by category
- **Interactive Charts**: Visual representation of income vs expenses and category breakdowns
- **Budget Alerts**: Real-time notifications for budget overruns

### Transactions
- **Add/Edit Transactions**: Record income and expenses with full details
- **Transaction Fields**:
  - Type (Income/Expense)
  - Amount
  - Category
  - Date
  - Description
- **Advanced Filtering**: Filter by type, category, date range
- **Multi-Sort**: Sort by multiple criteria simultaneously
- **Search**: Real-time search across all transaction fields
- **Multiple View Modes**: Card, Table, Calendar, and Compact views
- **Pagination**: Efficient handling of large transaction lists
- **Import/Export**: 
  - Import from CSV
  - Export to CSV, JSON, PDF, Excel
- **Saved Filters**: Save and reuse filter configurations
- **Keyboard Shortcuts**: Enter to save, Esc to cancel in forms

### Budgets
- **Create/Edit Budgets**: Set spending limits per category
- **Period Selection**: Monthly or yearly budgets
- **Progress Tracking**: Visual progress indicators showing used vs. remaining budget
- **Budget Alerts**: Visual indicators when you're over budget
- **Budget Templates**: Save and reuse budget configurations
- **Budget History**: Track budget changes over time
- **Share Budgets**: Generate shareable links with view/edit permissions
- **Category Management**: Track spending across different categories

### Financial Goals
- **Goal Types**: Savings, Debt Payoff, Expense Limit
- **Progress Tracking**: Visual progress bars with percentage completion
- **Deadline Management**: Set and track goal deadlines
- **Category Association**: Link goals to specific categories

### Reports & Analytics
- **Monthly Reports**: Detailed monthly financial breakdowns
- **Yearly Reports**: Annual financial summaries
- **Period Comparison**: Compare two time periods side-by-side
- **Financial Projections**: Forecast future financial trends
- **Advanced Analytics**: Category analysis and spending patterns
- **Export Options**: PDF and Excel export for reports

### Recurring Transactions
- **Automated Transactions**: Set up recurring income and expenses
- **Frequency Options**: Daily, Weekly, Monthly, Yearly
- **Active/Inactive Toggle**: Control which recurring transactions are active
- **Auto-Processing**: Automatic creation of transactions based on schedule

### Custom Categories
- **Personalized Categories**: Create custom income and expense categories
- **Color Coding**: Assign colors to categories for visual organization
- **Category Management**: Full CRUD operations for custom categories

### Alerts & Notifications
- **Budget Alerts**: Automatic notifications when budgets are exceeded
- **Balance Alerts**: Warnings for low account balances
- **Alert Management**: Mark as read, delete, and manage alerts

### User Profile & Billing
- **Profile Management**: Update user information
- **Plan Management**: Upgrade to Standard or Premium plans
- **Payment History**: View all past payments
- **Subscription Management**: View, manage, and cancel subscriptions
- **Invoice History**: Download invoices in text format

### Tutorial & Demo Mode
- **Interactive Tour**: Step-by-step guided tour of the application
- **Demo Mode**: Explore the app with sample data
- **Contextual Tooltips**: Helpful hints throughout the interface
- **Multilingual Support**: Tutorial content in multiple languages

### Global Search
- **Quick Search**: Press `Ctrl+K` (or `Cmd+K` on Mac) to open global search
- **Search Everything**: Find transactions, budgets, goals, and categories instantly
- **Real-time Results**: Results update as you type
- **Quick Navigation**: Click any result to navigate directly

### Keyboard Shortcuts
- **Global Shortcuts**:
  - `Ctrl+K` / `Cmd+K`: Open global search
  - `Esc`: Close modals and dialogs
- **Form Shortcuts**:
  - `Enter`: Save form
  - `Esc`: Cancel/Close form

### Settings
- **Currency Selection**: Choose from multiple currencies (USD, EUR, GBP, JPY, CAD, AUD)
- **Language Support**: Switch between English and Spanish
- **Dark Mode**: Toggle between light and dark themes with modern color palettes
- **Data Reset**: Clear all data with confirmation

### Blog
- **Financial Articles**: Access to educational content
- **Access Control**: Free users see previews, paid users get full access
- **Plan-based Access**: Different content access based on subscription plan

### Support
- **Priority Support**: Premium users get priority support tickets
- **Ticket Management**: Create, view, and manage support tickets
- **Response Tracking**: Track support ticket status and responses

### Landing Page
- **Modern Design**: Beautiful, responsive landing page with hero section
- **Feature Showcase**: Interactive feature cards with detailed modals
- **Video Section**: Embedded demo video
- **Testimonials**: User testimonials section
- **Pricing Plans**: Clear pricing information with plan comparison

## 🧱 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v7
- **State Management**: Zustand with persist middleware
- **Internationalization**: i18next & react-i18next (English, Spanish)
- **Data Persistence**: localStorage (via Zustand persist middleware)
- **Styling**: Material UI theming system with custom dark mode palette
- **Typography**: Inter (UI) + JetBrains Mono (numbers/tables)
- **Animations**: Framer Motion
- **Charts**: Recharts

## 📁 Project Structure

```
financeapp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── dashboard/         # Dashboard page
│   │   ├── transactions/      # Transactions page
│   │   ├── budgets/           # Budgets page
│   │   ├── goals/             # Financial goals page
│   │   ├── reports/           # Reports & analytics page
│   │   ├── recurring/         # Recurring transactions page
│   │   ├── categories/       # Custom categories page
│   │   ├── profile/          # User profile & billing page
│   │   ├── settings/         # Settings page
│   │   ├── support/          # Priority support page
│   │   ├── blog/              # Blog pages
│   │   ├── contact/           # Contact page
│   │   ├── about/             # About page
│   │   ├── terms/             # Terms of service page
│   │   ├── privacy/          # Privacy policy page
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/
│   │   ├── Layout/            # App layout components
│   │   │   ├── AppLayout.tsx  # Main layout with AppBar & Drawer
│   │   │   ├── Navbar.tsx     # Landing page navbar
│   │   │   └── Footer.tsx     # Footer component
│   │   ├── auth/              # Authentication components
│   │   │   └── ProtectedRoute.tsx
│   │   └── common/            # Reusable components
│   │       ├── EmptyState.tsx
│   │       ├── ConfirmDialog.tsx
│   │       ├── LanguageModal.tsx
│   │       ├── PageTransition.tsx
│   │       ├── AlertsPanel.tsx
│   │       ├── GlobalSearch.tsx
│   │       ├── TutorialTour.tsx
│   │       ├── TutorialLauncher.tsx
│   │       └── DemoModeBanner.tsx
│   ├── hooks/
│   │   ├── useTutorial.ts
│   │   └── useKeyboardShortcuts.ts
│   ├── store/
│   │   ├── financeStore.ts    # Zustand store for financial data
│   │   └── authStore.ts       # Zustand store for auth & billing
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── categories.ts     # Category utilities
│   │   ├── format.ts         # Formatting utilities
│   │   ├── translateCategory.ts
│   │   └── tutorialSteps.ts
│   ├── i18n/
│   │   ├── config.ts         # i18n configuration
│   │   └── locales/          # Translation files
│   │       ├── en.json
│   │       └── es.json
│   └── theme/
│       └── theme.ts          # MUI theme configuration
├── public/                    # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd financeapp
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🧠 Architecture Decisions

### State Management
- **Zustand** was chosen for its simplicity and excellent TypeScript support
- The store includes built-in localStorage persistence using Zustand's persist middleware
- Separate stores for finance data and authentication for better organization
- All state is centralized for easy management

### Internationalization
- **i18next** provides robust i18n capabilities
- Language detection from browser settings
- Currently supports English and Spanish, easily extensible
- All UI text is translatable

### UI/UX
- **Material UI** provides a consistent, accessible design system
- **Inter + JetBrains Mono** typography for modern, professional look
- Responsive layout with mobile-friendly drawer navigation
- Dark mode with carefully crafted color palette
- Empty states and validation feedback for better UX
- Smooth animations with Framer Motion

### Data Persistence
- All data is stored in browser's localStorage
- No backend required—fully client-side application
- Data persists across browser sessions
- Zustand persist middleware handles serialization automatically

## 📝 Code Quality

- **TypeScript**: Full type safety throughout the application
- **Component Structure**: Reusable, well-organized components
- **Error Handling**: Form validation and user feedback
- **Accessibility**: Material UI components follow accessibility best practices
- **Responsive Design**: Mobile-first approach with breakpoints
- **Performance**: Optimized with useMemo and proper state management

## 🎨 Key Features in Detail

### Transaction Management
- Full CRUD operations for transactions
- Advanced filtering and multi-sort capabilities
- Multiple view modes (card, table, calendar, compact)
- CSV import/export functionality
- PDF and Excel export options
- Saved filter configurations
- Real-time search

### Budget Management
- Create budgets with monthly or yearly periods
- Visual progress tracking with color-coded indicators
- Budget templates for quick setup
- Budget history tracking
- **Share budgets** with view/edit permissions via shareable links
- Real-time budget alerts

### Financial Goals
- Multiple goal types (savings, debt payoff, expense limit)
- Progress tracking with visual indicators
- Deadline management
- Category association

### Reports & Analytics
- Comprehensive monthly and yearly reports
- Period comparison analysis
- Financial projections
- Category spending analysis
- Export capabilities (PDF, Excel)

### Global Search
- **Press `Ctrl+K` (or `Cmd+K`)** to open instant search
- Search across transactions, budgets, goals, and categories
- Real-time results with quick navigation

### Keyboard Shortcuts
- **Global**: `Ctrl+K`/`Cmd+K` for search, `Esc` to close modals
- **Forms**: `Enter` to save, `Esc` to cancel
- Improves productivity and user experience

### Tutorial & Demo Mode
- Interactive guided tour
- Demo mode with sample data
- Contextual help throughout the app
- Multilingual tutorial content

## 🚢 Deployment

This application is ready to deploy to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Deploy!

The app works entirely client-side, so no environment variables or backend configuration is needed.

## 🎨 Design Features

- **Modern Typography**: Inter for UI, JetBrains Mono for numbers
- **Beautiful Dark Mode**: Carefully crafted dark theme with violet/amber accents
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion for polished interactions
- **Professional UI**: Material UI components with custom styling

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
