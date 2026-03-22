# Expense Tracker

A comprehensive, full-stack web application for personal finance management, designed to help users track income, manage expenses, and monitor budgets with an intuitive and responsive interface. Built with modern technologies and deployed on Vercel for seamless scalability.
---

## Key Features

- **Secure Authentication:** JWT-based login with **Show/Hide Password** toggle, biometric support (WebAuthn), and secure profile management
- **Interactive Dashboard:** Real-time financial overview with recent transactions and data visualization through multiple chart types (bar, line, doughnut charts)
- **Complete Income & Expense Management:** Full CRUD operations for financial records with categorization, dates, descriptions, and notes
- **Budget Tracking:** Create and manage budgets with recurring options (daily, weekly, monthly, annually) to monitor spending limits
- **Advanced Analytics:** Multiple visualization options including Recharts and Chart.js for comprehensive financial insights
- **Advanced Filtering:** Powerful search and date range filtering for precise transaction tracking
- **PDF Reports:** Generate professional PDF reports with embedded charts and transaction tables
- **Enhanced UI/UX:** Responsive design with optimized Dark/Light mode, polished card designs, and responsive table layouts
- **Robust Security:**
  - JWT token authentication with 1-hour expiration
  - Rate limiting on authentication and upload endpoints
  - Input validation and sanitization with express-validator
  - Security headers via Helmet middleware
  - CORS configuration for secure cross-origin requests
  - Comprehensive error handling middleware
- **Optimized Performance:**
  - Efficient frontend development with Vite
  - Lazy loading for React components
  - Gzip compression on backend responses
  - MongoDB connection pooling
  - Optimized database indexes
- **Cross-Platform Support:** Supports both web browsers and mobile applications
- **Vercel Deployment Ready:** Serverless function architecture for scalable deployment

---

## Tech Stack & Libraries

### Frontend Stack

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| **React** | ^19.2.0 | Core UI library |
| **React DOM** | ^19.2.0 | DOM bindings for React |
| **React Router** | ^7.12.0 | Client-side routing |
| **Vite** | ^7.0.4 | Fast build tool & dev server |
| **Tailwind CSS** | ^4.1.16 | Utility-first CSS framework |
| **Axios** | ^1.13.5 | HTTP client for API requests |
| **Recharts** | ^3.3.0 | Advanced charting library |
| **Chart.js** | ^4.5.1 | Core charting engine |
| **Framer Motion** | ^12.23.24 | Animation library |
| **React Icons** | ^5.5.0 | Icon library (Feather, Lucide, etc.) |
| **Lucide React** | ^0.548.0 | Beautiful SVG icons |
| **Moment.js** | ^2.30.1 | Date formatting and manipulation |
| **jsPDF** | ^4.2.0 | PDF document generation |
| **html2canvas** | ^1.4.1 | HTML to canvas conversion |

### Backend Stack

| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| **Express.js** | ^5.1.0 | Web framework for Node.js |
| **Mongoose** | ^8.19.2 | MongoDB object modeling |
| **JWT** | ^9.0.2 | JSON Web Token authentication |
| **Bcryptjs** | ^3.0.2 | Password hashing and encryption |
| **CORS** | ^2.8.5 | Cross-Origin Resource Sharing |
| **Dotenv** | ^17.2.3 | Environment variable loader |
| **Multer** | ^2.1.0 | File upload middleware |
| **Cloudinary** | ^2.8.0 | Cloud image storage and management |
| **ExcelJS** | ^4.4.0 | Excel spreadsheet generation |
| **Express Rate Limit** | ^8.2.1 | API rate limiting and DDoS protection |
| **Helmet** | ^8.1.0 | Security headers middleware |
| **Express Validator** | ^7.3.1 | Request validation and sanitization |
| **Compression** | ^1.7.4 | Gzip response compression |
| **Nodemon** | ^3.1.10 | Dev server auto-restart utility |

---

## Project Structure

```
Expense_Tracker/
├── Backend/                        # Node.js/Express API Server
│   ├── api/
│   │   └── index.js               # Vercel serverless entry point
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary service configuration
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/               # Business logic handlers
│   │   ├── authController.js      # User authentication & profile management
│   │   ├── expenseController.js   # Expense CRUD operations
│   │   ├── incomeController.js    # Income CRUD operations
│   │   ├── budgetController.js    # Budget management
│   │   ├── dashboardController.js # Dashboard statistics & analytics
│   │   └── transactionController.js # Transaction handling
│   ├── middleware/                # Express middleware
│   │   ├── authMiddleware.js      # JWT authentication
│   │   ├── errorMiddleware.js     # Global error handling
│   │   ├── validationMiddleware.js # Input validation
│   │   ├── uploadMiddleware.js    # File upload handling
│   │   └── connectDBMiddleware.js # Database connection
│   ├── models/                    # Mongoose schemas
│   │   ├── User.js                # User schema with password hashing
│   │   ├── Expense.js             # Expense schema with indexing
│   │   ├── Income.js              # Income schema with indexing
│   │   └── Budget.js              # Budget schema with recurring options
│   ├── routes/                    # API route definitions
│   │   ├── authRoutes.js          # Authentication endpoints
│   │   ├── expenseRoutes.js       # Expense endpoints
│   │   ├── incomeRoutes.js        # Income endpoints
│   │   ├── budgetRoutes.js        # Budget endpoints
│   │   ├── dashboardRoutes.js     # Dashboard endpoints
│   │   └── transactionRoutes.js   # Transaction endpoints
│   ├── utils/                     # Helper utilities
│   │   ├── AppError.js            # Custom error class
│   │   ├── asyncHandler.js        # Async route handler wrapper
│   │   └── queryValidator.js      # Query validation utility
│   ├── server.js                  # Main application entry point
│   ├── package.json               # Backend dependencies
│   ├── eslint.config.js           # ESLint configuration
│   └── README.md                  # Backend documentation
│
├── Frontend/                      # React/Vite Web Application
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   │   ├── Budget/            # Budget-related components
│   │   │   │   ├── AddBudgetForm.jsx
│   │   │   │   ├── BudgetList.jsx
│   │   │   │   ├── BudgetOverview.jsx
│   │   │   │   └── BudgetVsActualChart.jsx
│   │   │   ├── Cards/             # Information card components
│   │   │   │   ├── CharAvatar.jsx
│   │   │   │   ├── InfoCard.jsx
│   │   │   │   └── TransactionInfoCard.jsx
│   │   │   ├── Charts/            # Chart visualization components
│   │   │   │   ├── ChartJsBarChart.jsx
│   │   │   │   ├── ChartJsDoughnutChart.jsx
│   │   │   │   ├── ChartJsLineChart.jsx
│   │   │   │   └── CustomTooltip.jsx
│   │   │   ├── Dashboard/         # Dashboard-specific components
│   │   │   │   ├── DashboardWidget.jsx
│   │   │   │   ├── FinanceOverview.jsx
│   │   │   │   ├── RecentTransactions.jsx
│   │   │   │   └── ExpenseTransactions.jsx
│   │   │   ├── Expense/           # Expense-related components
│   │   │   │   ├── AddExpenseForm.jsx
│   │   │   │   ├── ExpenseList.jsx
│   │   │   │   └── ExpenseOverview.jsx
│   │   │   ├── Income/            # Income-related components
│   │   │   │   ├── AddIncomeForm.jsx
│   │   │   │   ├── IncomeList.jsx
│   │   │   │   └── IncomeOverview.jsx
│   │   │   ├── Inputs/            # Input/form components
│   │   │   │   ├── ModernDatePicker.jsx
│   │   │   │   └── ProfilePhotoSelector.jsx
│   │   │   ├── layouts/           # Layout components
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── SideMenu.jsx
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── AuthBranding.jsx
│   │   │   ├── Transactions/      # Transaction components
│   │   │   ├── ErrorBoundary.jsx  # Error boundary wrapper
│   │   │   └── LoadingSpinner.jsx # Loading indicator
│   │   ├── context/               # React Context providers
│   │   │   ├── UserContext.jsx    # User state management
│   │   │   ├── UserContextDefinition.js
│   │   │   └── ThemeContext.jsx   # Dark/light theme
│   │   ├── hooks/                 # Custom React hooks
│   │   │   ├── useTheme.js        # Theme toggle hook
│   │   │   └── useUserAuth.jsx    # Authentication hook
│   │   ├── pages/                 # Page components
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── SignUp.jsx
│   │   │   └── Dashboard/
│   │   │       ├── Home.jsx
│   │   │       ├── Income.jsx
│   │   │       ├── Expense.jsx
│   │   │       ├── Budget.jsx
│   │   │       ├── Settings.jsx
│   │   │       └── RecentTransactionsPage.jsx
│   │   ├── utils/                 # Utility functions
│   │   │   ├── apiPath.js         # API endpoint configurations
│   │   │   ├── axiosInstance.js   # Axios configuration with interceptors
│   │   │   ├── data.js            # Constants and hardcoded data
│   │   │   ├── helper.js          # General helper functions
│   │   │   ├── pdfGenerator.js    # PDF generation utilities
│   │   │   └── uploadImage.js     # Image upload utilities
│   │   ├── assets/                # Static assets
│   │   │   └── images/
│   │   ├── App.jsx                # Root application component
│   │   ├── main.jsx               # React DOM entry point
│   │   └── index.css              # Global styles
│   ├── public/
│   │   └── robots.txt             # SEO robots configuration
│   ├── index.html                 # Main HTML entry point
│   ├── package.json               # Frontend dependencies
│   ├── vite.config.js             # Vite configuration
│   ├── eslint.config.js           # ESLint configuration
│   └── vercel.json                # Vercel deployment config
│
├── .gitignore                     # Git ignore configuration
├── package.json                   # Root package config
├── README.md                      # This file
└── vercel.json                    # Monorepo deployment config
```

---

## Data Models

### User Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (hashed, bcryptjs, required),
  profileImageUrl: String (optional),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Expense Model
```javascript
{
  user: ObjectId (ref: User, required),
  title: String (required),
  amount: Number (required),
  category: String (required),
  description: String (optional),
  notes: String (optional),
  icon: String (optional),
  date: Date (default: now),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
// Indexes: {user: 1, date: -1}, {user: 1}, {date: -1}
```

### Income Model
```javascript
{
  user: ObjectId (ref: User, required),
  title: String (required),
  amount: Number (required),
  source: String (required),
  category: String (required),
  note: String (optional),
  icon: String (optional),
  date: Date (default: now),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
// Indexes: {user: 1, date: -1}, {user: 1}, {date: -1}
```

### Budget Model
```javascript
{
  user: ObjectId (ref: User, required),
  category: String (required),
  amount: Number (required, min: 0),
  startDate: Date (required),
  endDate: Date (required),
  isRecurring: Boolean (default: false),
  recurrenceType: String (enum: ['daily', 'weekly', 'monthly', 'annually', null]),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
// Indexes: {user: 1, startDate: 1, endDate: 1}
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Cloudinary Account](https://cloudinary.com/users/register/free) (for image storage)

### Installation Steps

#### 1. Clone the Repository

```bash
git clone https://github.com/ram02krishna/Expense_Tracker.git
cd Expense_Tracker
```

#### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory:

```env
# Database Configuration
MONGO_URI=

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_recommended

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret_key
```

Start the development server:

```bash
npm run dev
```

Backend will run on `http://localhost:5000`

**Backend Scripts:**
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart (Nodemon)

#### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:

```env
VITE_BASE_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

**Frontend Scripts:**
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint checks

#### 4. Access the Application

Open your browser and navigate to **`http://localhost:5173`**

---

## Environment Variables Guide

### Backend Environment Variables

| Variable | Description | Example |
|:---------|:------------|:--------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) | `openssl rand -base64 32` |
| `PORT` | Backend server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `CLIENT_URL` | Frontend URL(s) for CORS | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud identifier | Your cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Your API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Your API secret |

**Generate JWT Secret:**
```bash
# On Windows PowerShell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString() + (New-Guid).ToString())) 

# On macOS/Linux
openssl rand -base64 32
```

### Frontend Environment Variables

| Variable | Description | Example |
|:---------|:------------|:--------|
| `VITE_BASE_URL` | Backend API base URL | `http://localhost:5000` |

---

## Security Features

### Authentication & Authorization
- **JWT Tokens:** 1-hour expiration for security
- **Password Hashing:** Bcryptjs with salt rounds (10)
- **WebAuthn Support:** Optional biometric authentication

### API Security
- **Rate Limiting:**
  - General endpoints: 100 requests per 15 minutes
  - Auth endpoints: 50 requests per 15 minutes
  - Upload endpoints: 20 requests per 15 minutes
- **CORS:** Whitelist configuration with Vercel domain support
- **Helmet:** Security headers (XSS, clickjacking, etc.)
- **HTTPS:** Required in production

### Data Protection
- **Input Validation:** Express-validator with sanitization
- **MongoDB Injection Prevention:** Parameter sanitization
- **Error Handling:** Generic error messages in production
- **Secure Cookies:** HTTP-only, SameSite flags

---

## 📡 API Endpoints

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Protected |
|:-------|:---------|:------------|:----------|
| POST | `/register` | Register new user | ❌ |
| POST | `/login` | User login | ❌ |
| GET | `/getUser` | Get current user info | ✅ |
| PUT | `/update` | Update user profile | ✅ |
| POST | `/change-password` | Change password | ✅ |
| POST | `/upload-image` | Upload profile image | ✅ |

### Expenses (`/api/v1/expense`)
| Method | Endpoint | Description | Protected |
|:-------|:---------|:------------|:----------|
| GET | `/` | Get all expenses | ✅ |
| POST | `/` | Create expense | ✅ |
| GET | `/:id` | Get specific expense | ✅ |
| PUT | `/:id` | Update expense | ✅ |
| DELETE | `/:id` | Delete expense | ✅ |

### Income (`/api/v1/income`)
| Method | Endpoint | Description | Protected |
|:-------|:---------|:------------|:----------|
| GET | `/` | Get all income records | ✅ |
| POST | `/` | Create income record | ✅ |
| GET | `/:id` | Get specific income | ✅ |
| PUT | `/:id` | Update income | ✅ |
| DELETE | `/:id` | Delete income | ✅ |

### Budgets (`/api/v1/budgets`)
| Method | Endpoint | Description | Protected |
|:-------|:---------|:------------|:----------|
| GET | `/` | Get all budgets | ✅ |
| POST | `/` | Create budget | ✅ |
| GET | `/:id` | Get specific budget | ✅ |
| PUT | `/:id` | Update budget | ✅ |
| DELETE | `/:id` | Delete budget | ✅ |

### Dashboard (`/api/v1/dashboard`)
| Method | Endpoint | Description | Protected |
|:-------|:---------|:------------|:----------|
| GET | `/` | Get dashboard overview | ✅ |
| GET | `/statistics` | Get financial statistics | ✅ |

### Transactions (`/api/v1/transactions`)
| Method | Endpoint | Description | Protected |
|:-------|:---------|:------------|:----------|
| GET | `/` | Get all transactions | ✅ |
| GET | `/export` | Export as Excel | ✅ |

---

## 🧪 Testing Endpoints

Using cURL:

```bash
# Register User
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"Password123"}'

# Login User
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"Password123"}'

# Get User Info (replace TOKEN with actual JWT)
curl -X GET http://localhost:5000/api/v1/auth/getUser \
  -H "Authorization: Bearer TOKEN"
```

**Tools for API Testing:**
- [Postman](https://www.postman.com/) - Full-featured API testing GUI
- [Thunder Client](https://www.thunderclient.com/) - VS Code extension
- [REST Client Extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) - VS Code extension
- `curl` - Command-line tool

---

## 🚀 Deployment on Vercel

This project is configured for serverless deployment on Vercel with separate frontend and backend services.

### Architecture

```
Vercel Deployment:
├── Frontend (Static Site)
│   └── Deployed from /Frontend directory
├── Backend (Serverless Functions)
│   └── Deployed from /Backend/api/index.js
└── MongoDB Atlas (Cloud Database)
```

### Prerequisites

1. [Vercel Account](https://vercel.com/signup)
2. GitHub repository connected to Vercel
3. MongoDB Atlas cluster
4. Cloudinary account

### Environment Variables Setup

1. Go to Vercel Project Dashboard → **Settings** → **Environment Variables**
2. Add the following variables:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=https://your-domain.vercel.app
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NODE_ENV=production
VITE_BASE_URL=https://your-domain.vercel.app/api/v1
```

### Deployment Steps

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from project root
vercel

# Or push to GitHub and auto-deploy
git push origin main
```
