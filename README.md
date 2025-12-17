# Personal Finance Tracker

A clean, modern personal finance tracking application built with Next.js, TypeScript, and Material UI. Track your income, expenses, manage budgets, and monitor your financial health—all with data stored locally in your browser.

## 🎯 Features

### Dashboard
- **Total Balance**: View your current financial balance
- **Total Income**: Track all income sources
- **Total Expenses**: Monitor all expenses
- **Recent Transactions**: Quick view of your latest transactions

### Transactions
- **Add Transactions**: Record income and expenses with details
- **Transaction Fields**:
  - Type (Income/Expense)
  - Amount
  - Category
  - Date
  - Description
- **Delete Transactions**: Remove transactions you no longer need
- **Transaction List**: View all transactions sorted by date

### Budgets
- **Create Budgets**: Set spending limits per category
- **Progress Tracking**: Visual progress indicators showing used vs. remaining budget
- **Budget Alerts**: Visual indicators when you're over budget
- **Category Management**: Track spending across different categories

### Settings
- **Currency Selection**: Choose from multiple currencies (USD, EUR, GBP, JPY, CAD, AUD)
- **Language Support**: Switch between English and Spanish
- **Dark Mode**: Toggle between light and dark themes
- **Data Reset**: Clear all data with confirmation

## 🧱 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: Material UI (MUI) v7
- **State Management**: Zustand
- **Internationalization**: i18next & react-i18next
- **Data Persistence**: localStorage (via Zustand persist middleware)
- **Styling**: Material UI theming system

## 📁 Project Structure

```
financeapp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Dashboard
│   │   ├── transactions/      # Transactions page
│   │   ├── budgets/           # Budgets page
│   │   ├── settings/          # Settings page
│   │   └── layout.tsx         # Root layout with providers
│   ├── components/
│   │   ├── Layout/            # App layout components
│   │   │   └── AppLayout.tsx  # Main layout with AppBar & Drawer
│   │   └── common/            # Reusable components
│   │       ├── EmptyState.tsx
│   │       └── ConfirmDialog.tsx
│   ├── store/
│   │   └── financeStore.ts    # Zustand store with persistence
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── categories.ts     # Category utilities
│   │   └── format.ts         # Formatting utilities
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
- All state is centralized in a single store for easy management

### Internationalization
- **i18next** provides robust i18n capabilities
- Language detection from browser settings
- Currently supports English and Spanish, easily extensible

### UI/UX
- **Material UI** provides a consistent, accessible design system
- Responsive layout with mobile-friendly drawer navigation
- Dark mode support for better user experience
- Empty states and validation feedback for better UX

### Data Persistence
- All data is stored in browser's localStorage
- No backend required—fully client-side application
- Data persists across browser sessions

## 📝 Code Quality

- **TypeScript**: Full type safety throughout the application
- **Component Structure**: Reusable, well-organized components
- **Error Handling**: Form validation and user feedback
- **Accessibility**: Material UI components follow accessibility best practices
- **Responsive Design**: Mobile-first approach with breakpoints

## 🎨 Features in Detail

### Transaction Management
- Add transactions with type, amount, category, date, and description
- Categories are dynamically filtered based on transaction type
- Transactions are sorted by date (newest first)
- Delete functionality with confirmation dialog

### Budget Tracking
- Create budgets for specific categories
- Visual progress bars show spending vs. limit
- Color-coded indicators (green for on track, red for over budget)
- Prevents duplicate budgets for the same category

### Settings
- Currency formatting updates throughout the app
- Language changes apply immediately
- Dark mode toggle with theme persistence
- Data reset with confirmation to prevent accidental deletion

## 🚢 Deployment

This application is ready to deploy to Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Vercel will automatically detect Next.js and configure the build
4. Deploy!

The app works entirely client-side, so no environment variables or backend configuration is needed.

## 🔮 Future Enhancements

Potential improvements for future versions:
- Edit transaction functionality
- Edit budget functionality
- Transaction filtering and search
- Export data to CSV/JSON
- Charts and visualizations
- Recurring transactions
- Budget period selection (weekly, monthly, yearly)
- More language support
- Category icons and colors

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
