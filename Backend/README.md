# Expense Tracker

A comprehensive, full-stack web application for personal finance management, designed to help users track income, manage expenses, and monitor budgets with an intuitive and responsive interface. Built with modern technologies and deployed on Vercel for seamless scalability.

---
[![Node.js](https://img.shields.io/badge/Backend-Node.js-informational?logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/Frontend-React-blue?logo=react)](https://react.dev/)
[![Express.js](https://img.shields.io/badge/API-Express.js-90C53F?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Cloudinary](https://img.shields.io/badge/Cloud-Cloudinary-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

---

## ✨ Features

- 🔐 **Secure Authentication:** JWT-based login with **Show/Hide Password** toggle, biometric support (WebAuthn), and secure profile management.
- 📊 **Interactive Dashboard:** Real-time financial overview with recent transactions and data visualization through multiple chart types (bar, line, doughnut charts).
- 💰 **Complete Income & Expense Management:** Full CRUD operations for financial records with categorization, dates, descriptions, and notes.
- 💵 **Budget Tracking:** Create and manage budgets with recurring options (daily, weekly, monthly, annually) to monitor spending limits.
- 📈 **Advanced Analytics:** Multiple visualization options including Recharts and Chart.js for comprehensive financial insights.
- 🔍 **Advanced Filtering:** Powerful search and date range filtering for precise transaction tracking.
- 📄 **PDF Reports:** Generate professional PDF reports with embedded charts and transaction tables.
- 📱 **Enhanced UI/UX:** v2.1.1 features a completely redesigned Dashboard with responsive table layouts, optimized Dark/Light mode, and polished card designs.
- 🛡️ **Robust Security:** 
  - JWT token authentication with 1-hour expiration
  - Rate limiting on authentication and upload endpoints
  - Input validation and sanitization with express-validator
  - Security headers via Helmet middleware
  - CORS configuration for secure cross-origin requests
  - Comprehensive error handling middleware
- ⚡ **Optimized Performance:** 
  - Efficient frontend development with Vite
  - Lazy loading for React components
  - Gzip compression on backend responses
  - MongoDB connection pooling
  - Optimized database indexes
- 🌐 **Cross-Platform Support:** Supports both web browsers and mobile applications.
- 🚀 **Vercel Deployment Ready:** Serverless function architecture for scalable deployment.

---

## 🛠️ Tech Stack & Libraries

### Frontend Dependencies (`Frontend/package.json`)
| Library | Version | Purpose |
|:--------|:--------|:--------|
| **react** | ^19.2.0 | Core UI library |
| **react-dom** | ^19.2.0 | DOM bindings for React |
| **react-router-dom** | ^7.12.0 | Client-side routing |
| **vite** | ^7.0.4 | Fast build tool & dev server |
| **tailwindcss** | ^4.1.16 | Utility-first CSS framework |
| **@tailwindcss/vite** | ^4.1.16 | Tailwind integration for Vite |
| **axios** | ^1.11.0 | HTTP client for API requests |
| **recharts** | ^3.3.0 | Charting library |
| **chart.js** | ^4.5.1 | Core charting engine |
| **react-chartjs-2** | ^5.3.1 | React wrapper for Chart.js |
| **framer-motion** | ^12.23.24 | Animation library |
| **react-icons** | ^5.5.0 | Icon library (Feather, Lucide, etc.) |
| **lucide-react** | ^0.548.0 | Lucide icons |
| **moment** | ^2.30.1 | Date formatting |
| **jspdf** | ^4.0.0 | PDF generation |
| **jspdf-autotable** | ^5.0.7 | Table plugin for jsPDF |
| **html2canvas** | ^1.4.1 | Canvas creation from DOM |
| **emoji-picker-react** | ^4.14.2 | Emoji picker component |
| **base64url** | ^3.0.1 | Base64 URL encoding |
| **prettier** | ^3.6.2 | Code formatter |

### Backend Dependencies (`Backend/package.json`)
| Library | Version | Purpose |
|:--------|:--------|:--------|
| **express** | ^5.1.0 | Web framework for Node.js |
| **mongoose** | ^8.19.2 | MongoDB object modeling |
| **jsonwebtoken** | ^9.0.2 | JWT implementation |
| **bcryptjs** | ^3.0.2 | Password hashing |
| **cors** | ^2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | ^17.2.3 | Environment variable loader |
| **multer** | ^2.0.1 | File upload middleware |
| **cloudinary** | ^2.8.0 | Cloud image management |
| **exceljs** | ^4.4.0 | Excel spreadsheet creation |
| **express-rate-limit** | ^8.2.1 | API rate limiting |
| **helmet** | ^8.1.0 | Security headers |
| **express-validator** | ^7.3.1 | Request validation |
| **compression** | ^1.7.4 | Response compression |
| **express-session** | ^1.18.2 | Session management |
| **node-cache** | ^5.1.2 | In-memory caching |
| **speakeasy** | ^2.0.0 | 2FA / OTP generation |
| **base64url** | ^3.0.1 | Base64 URL encoding |
| **cbor** | ^10.0.11 | CBOR encoding (WebAuthn) |
| **nodemon** | ^3.1.10 | Dev server auto-restart |
| **supertest** | ^7.1.4 | HTTP assertion for testing |

---


## 📦 Project Structure

```
Expense_Tracker/
├── .git/                   # Git version control
├── .gitignore              # Global Git ignore file
├── package.json            # Root package configuration
├── README.md             # Project documentation
├── SECURITY.md             # Security guidelines
├── vercel.json             # Vercel monorepo configuration
│
├── Backend/                # Node.js/Express API Server
│   ├── server.js           # Main application entry point with middleware setup
│   ├── package.json        # Backend dependencies (express, mongoose, jwt, etc.)
│   ├── eslint.config.js    # ESLint configuration
│   ├── vercel.json         # Serverless deployment configuration
│   │
│   ├── api/
│   │   └── index.js        # Vercel serverless function entry point
│   │
│   ├── config/
│   │   ├── cloudinary.js   # Cloudinary service configuration
│   │   └── db.js           # MongoDB connection with pooling settings
│   │
│   ├── models/             # Mongoose schemas
│   │   ├── User.js         # User schema with password hashing middleware
│   │   ├── Expense.js      # Expense schema with category and date indexing
│   │   ├── Income.js       # Income schema with source tracking
│   │   └── Budget.js       # Budget schema with recurring options
│   │
│   ├── controllers/        # Business logic handlers
│   │   ├── authController.js           # Registration, login, password management
│   │   ├── expenseController.js        # CRUD operations for expenses
│   │   ├── incomeController.js         # CRUD operations for income
│   │   ├── budgetController.js         # Budget creation and management
│   │   ├── dashboardController.js      # Dashboard statistics and analytics
│   │   └── transactionController.js    # Combined transaction handling
│   │
│   ├── routes/             # API endpoints
│   │   ├── authRoutes.js               # /api/v1/auth endpoints
│   │   ├── expenseRoutes.js            # /api/v1/expense endpoints
│   │   ├── incomeRoutes.js             # /api/v1/income endpoints
│   │   ├── budgetRoutes.js             # /api/v1/budgets endpoints
│   │   ├── dashboardRoutes.js          # /api/v1/dashboard endpoints
│   │   └── transactionRoutes.js        # /api/v1/transactions endpoints
│   │
│   ├── middleware/         # Express middleware
│   │   ├── authMiddleware.js           # JWT token verification
│   │   ├── errorMiddleware.js          # Global error handling
│   │   ├── validationMiddleware.js     # Input validation with express-validator
│   │   └── uploadMiddleware.js         # Multer file upload configuration
│   │
    └── utils/              # Helper utilities
        ├── asyncHandler.js # Wrapper for async route handlers
        ├── AppError.js     # Custom error class
        └── queryValidator.js # Utility for query parameter validation
│
├── Frontend/               # React/Vite Web Application
│   ├── index.html          # Main HTML entry point
│   ├── package.json        # Frontend dependencies (react, vite, tailwind, etc.)
│   ├── vite.config.js      # Vite build configuration with React plugin
│   ├── eslint.config.js    # ESLint configuration
│   ├── vercel.json         # Static site deployment configuration
│   │
    ├── public/
    │   ├── favicon.svg     # Frontend favicon
    │   ├── robots.txt      # SEO robots configuration
    │   └── vite.svg        # Vite logo asset
│   │
│   └── src/
│       ├── main.jsx        # React DOM root entry point
│       ├── App.jsx         # Main app component with routing and providers
│       ├── index.css       # Global styles and Tailwind directives
│       │
        ├── assets/
        │   ├── images/     # Static image assets
        │   └── react.svg   # React logo asset
│       │
│       ├── components/     # Reusable React components
│       │   ├── ErrorBoundary.jsx           # Error boundary for error handling
│       │   ├── LoadingSpinner.jsx          # Loading state component
│       │   │
│       │   ├── Budget/                     # Budget-related components
    │   │   ├── AddBudgetForm.jsx       # Budget creation form
    │   │   ├── BudgetList.jsx          # Budget list display
    │   │   ├── BudgetOverview.jsx      # Budget statistics
    │   │   └── SimpleBudgetList.jsx    # Simplified budget list display
│       │   │
│       │   ├── Expense/                    # Expense-related components
│       │   │   ├── AddExpenseForm.jsx      # Expense entry form
│       │   │   ├── ExpenseList.jsx         # Expense list display
│       │   │   └── ExpenseOverview.jsx     # Expense statistics
│       │   │
│       │   ├── Income/                     # Income-related components
│       │   │   ├── AddIncomeForm.jsx       # Income entry form
│       │   │   ├── IncomeList.jsx          # Income list display
│       │   │   └── IncomeOverview.jsx      # Income statistics
│       │   │
│       │   ├── Cards/                      # Card components
│       │   │   ├── CharAvatar.jsx          # Character avatar display
│       │   │   ├── InfoCard.jsx            # Generic info card
│       │   │   └── TransactionInfoCard.jsx # Transaction card
│       │   │
│       │   ├── Charts/                     # Chart visualization components
│       │   │   ├── ChartJsBarChart.jsx     # Bar chart using Chart.js
│       │   │   ├── ChartJsDoughnutChart.jsx# Doughnut chart using Chart.js
│       │   │   ├── ChartJsLineChart.jsx    # Line chart using Chart.js
│       │   │   ├── CustomLegend.jsx        # Custom legend component
│       │   │   └── CustomTooltip.jsx       # Custom tooltip for charts
│       │   │
│       │   ├── Dashboard/                  # Dashboard-specific components
│       │   │   ├── DashboardWidget.jsx     # Reusable dashboard widget container
│       │   │   ├── FinanceOverview.jsx     # Financial summary dashboard
│       │   │   ├── ExpenseTransactions.jsx # Expense transaction display
│       │   │   ├── RecentIncome.jsx        # Recent income section
│       │   │   ├── RecentIncomeWithChart.jsx# Income with chart visualization
│       │   │   ├── RecentTransactions.jsx  # All recent transactions
│       │   │   └── CustomTooltip.jsx       # Dashboard-specific tooltip
│       │   │
│       │   ├── Inputs/                     # Input components
│       │   │   ├── ModernDatePicker.jsx    # Date selection component
│       │   │   └── ProfilePhotoSelector.jsx# Profile photo upload
│       │   │
│       │   └── layouts/                    # Layout components
│       │       ├── Navbar.jsx              # Top navigation bar
│       │       ├── SideMenu.jsx            # Sidebar navigation
│       │       ├── DashboardLayout.jsx     # Main dashboard layout wrapper
│       │       ├── Modal.jsx               # Modal dialog component
│       │       ├── AuthBranding.jsx        # Auth page branding
│       │       └── EmojiPickerPopup.jsx    # Emoji selection popup
│       │
│       ├── context/        # React Context API providers
│       │   ├── UserContext.jsx             # User context provider with state management
│       │   ├── UserContextDefinition.js    # User context definition
│       │   └── ThemeContext.jsx            # Dark/light theme provider
│       │
│       ├── hooks/          # Custom React hooks
│       │   ├── useTheme.js  # Theme toggle hook
│       │   └── useUserAuth.jsx # Authentication state hook
│       │
│       ├── pages/          # Page components (routes)
│       │   ├── Auth/
│       │   │   ├── Login.jsx               # Login page
│       │   │   └── SignUp.jsx              # Registration page
│       │   │
│       │   └── Dashboard/  # Protected dashboard pages
│       │       ├── Home.jsx                # Dashboard home page
│       │       ├── Income.jsx              # Income management page
│       │       ├── Expense.jsx             # Expense management page
│       │       ├── Budget.jsx              # Budget management page
│       │       ├── Settings.jsx            # User settings page
│       │       └── RecentTransactionsPage.jsx # Detailed transactions page
│       │
│       └── utils/          # Utility functions
│           ├── apiPath.js              # API endpoint configurations
│           ├── axiosInstance.js        # Axios configuration with interceptors
│           ├── data.js                 # Hardcoded data and constants
│           ├── helper.js               # General helper functions
│           └── uploadImage.js          # Image upload utility
```

## 📊 Data Models

### User Model
```javascript
{
  fullName: String (required),
  email: String (required, unique),
  password: String (hashed, required),
  profileImageUrl: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Model
```javascript
{
  user: ObjectId (ref: User, required),
  title: String (required),
  amount: Number (required),
  category: String (required),
  description: String,
  notes: String,
  icon: String,
  date: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `{user: 1, date: -1}`, `{user: 1}`, `{date: -1}`

### Income Model
```javascript
{
  user: ObjectId (ref: User, required),
  title: String (required),
  amount: Number (required),
  source: String (required),
  note: String,
  icon: String,
  date: Date (default: now),
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `{user: 1, date: -1}`, `{user: 1}`, `{date: -1}`

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
  createdAt: Date,
  updatedAt: Date
}
```
Indexes: `{user: 1, startDate: 1, endDate: 1}`, `{user: 1, category: 1, startDate: 1}`

---

## ⚙️ Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (local installation or cloud service like MongoDB Atlas)
- [Cloudinary Account](https://cloudinary.com/) (for image storage)

### 1. Clone the Repository

```bash
git clone https://github.com/ByteOps02/Expense_Tracker.git
cd Expense_Tracker
```

### 2. Backend Setup

Navigate to the `Backend` directory, install dependencies, and configure environment variables:

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory (refer to the `.env.example` file and the Environment Variables section below):

```bash
npm run dev
```

The backend server will start on `http://localhost:5000` (or your specified PORT).

**Backend Scripts:**
- `npm run dev` - Start development server with Nodemon (auto-restart on file changes)
- `npm start` - Start production server

### 3. Frontend Setup

Navigate to the `Frontend` directory, install dependencies, and configure environment variables:

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory (refer to the `.env.example` file):

```bash
npm run dev
```

The frontend development server will start on `http://localhost:5173`.

**Frontend Scripts:**
- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks

### 4. Access the Application

Open your browser and navigate to `http://localhost:5173` to access the expense tracker application.

---

## 🔑 Environment Variables

### Backend (`Backend/.env`)

> **⚠️ Important:** Never commit `.env` files with actual credentials. Copy `.env.example` to `.env` and fill in your actual values.

| Variable                     | Description                                | Example Value |
|:---------                    |:------------                               |:--------------|
| `MONGO_URI`                  | MongoDB connection string (Atlas or local) | `mongodb+srv://your_username:your_password@your_cluster.mongodb.net/expense_tracker` |
| `JWT_SECRET`                 | Secret key for JWT token signing           | `your_super_secret_jwt_key_min_32_characters_recommended` |
| `PORT`                       | Backend server port                        | `5000` |
| `CLIENT_URL`                 | Frontend application URL(s) for CORS       | `http://localhost:5173` or `http://localhost:5173,https://yourdomain.com` |
| `CLOUDINARY_CLOUD_NAME`      | Cloudinary cloud name                      | `your_cloud_name` |
| `CLOUDINARY_API_KEY`         | Cloudinary API key                         | `your_api_key` |
| `CLOUDINARY_API_SECRET`      | Cloudinary API secret                      | `your_api_secret_key` |
| `NODE_ENV`                   | Environment mode                           | `development` or `production` |

**Setup Instructions:**
1. Copy the example file: `cp Backend/.env.example Backend/.env`
2. Fill in your actual values from the services:
   - MongoDB Atlas credentials
   - JWT secret (generate with: `openssl rand -base64 32`)
   - Cloudinary credentials

**Example `.env` file:**
```env
MONGO_URI=mongodb+srv://your_username:your_password@your_cluster.mongodb.net/expense_tracker
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_recommended
PORT=5000
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret_key
NODE_ENV=development
```

### Frontend (`Frontend/.env`)

| Variable        | Description          | Example Value |
|:---------       |:------------         |:--------------|
| `VITE_BASE_URL` | Backend API base URL | `http://localhost:5000` |

**Example `.env` file:**
```env
VITE_BASE_URL=http://localhost:5000
```

## 🔒 Security Features

- **JWT Authentication:** Tokens expire after 1 hour for enhanced security
- **Rate Limiting:** 
  - General API: 100 requests per 15 minutes
  - Authentication: 50 requests per 15 minutes
  - Image Upload: 20 uploads per 15 minutes
- **Helmet Middleware:** Protects against common web vulnerabilities by setting HTTP headers
- **CORS Security:** Configurable allowed origins with dynamic verification
- **Password Hashing:** Bcryptjs with salt rounds for secure password storage
- **Input Validation:** Express-validator for sanitization and validation of all inputs
- **Error Handling:** Comprehensive error middleware prevents information leakage
- **WebAuthn Support:** Optional biometric authentication for enhanced security

## 🚀 API Endpoints

### Authentication Routes (`/api/v1/auth`)
- `POST /register` - Register a new user
- `POST /login` - Login with credentials
- `GET /getUser` - Get current user info (protected)
- `PUT /update` - Update user profile (protected)
- `POST /change-password` - Change user password (protected)
- `POST /upload-image` - Upload profile image

### Expense Routes (`/api/v1/expense`)
- `GET /` - Get all expenses (protected)
- `POST /` - Create new expense (protected)
- `GET /:id` - Get specific expense (protected)
- `PUT /:id` - Update expense (protected)
- `DELETE /:id` - Delete expense (protected)

### Income Routes (`/api/v1/income`)
- `GET /` - Get all income records (protected)
- `POST /` - Create new income record (protected)
- `GET /:id` - Get specific income record (protected)
- `PUT /:id` - Update income record (protected)
- `DELETE /:id` - Delete income record (protected)

### Budget Routes (`/api/v1/budgets`)
- `GET /` - Get all budgets (protected)
- `POST /` - Create new budget (protected)
- `GET /:id` - Get specific budget (protected)
- `PUT /:id` - Update budget (protected)
- `DELETE /:id` - Delete budget (protected)

### Dashboard Routes (`/api/v1/dashboard`)
- `GET /` - Get dashboard overview data (protected)
- `GET /statistics` - Get financial statistics (protected)

### Transaction Routes (`/api/v1/transactions`)
- `GET /` - Get all transactions (protected)
- `GET /export` - Export transactions as Excel (protected)

## 🚀 Deployment (Vercel)

This project is configured for seamless deployment on Vercel, utilizing its monorepo support for both frontend (static site) and backend (serverless functions).

### Deployment Architecture

- **Frontend:** Static site deployment to Vercel's CDN (automatic builds from `/Frontend` directory)
- **Backend:** Serverless functions deployment using `/Backend/api/index.js` entry point

### Prerequisites for Deployment

1. Create a [Vercel Account](https://vercel.com/signup)
2. Connect your GitHub repository to Vercel
3. Set up environment variables in Vercel project dashboard

### Configuration Files

Both directories contain `vercel.json` files configured for optimal deployment:

**Backend (Backend/vercel.json):**
- Configures serverless function routes
- Sets build directory and output settings

**Frontend (Frontend/vercel.json):</b>
- Configures static site settings
- Sets up rewrites for client-side routing

### Setting Up Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add all required backend environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLIENT_URL`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Add frontend environment variables:
   - `VITE_BASE_URL` (set to your Vercel backend API URL)

### Deployment Steps

1. **Initial Setup:**
   ```bash
   # Ensure both vercel.json files exist
   # Update environment variables in Vercel dashboard
   ```

2. **Automatic Deployment:**
   - Push changes to your `main` branch
   - Vercel automatically builds and deploys both frontend and backend
   - Frontend builds from `Frontend/` directory
   - Backend builds serverless functions from `Backend/` directory

3. **Manual Deployment:**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy from project root
   vercel
   ```

### Post-Deployment Verification

- Access your frontend at `https://your-project.vercel.app`
- Backend API endpoints available at `https://your-project.vercel.app/api/v1/*`
- Check Vercel dashboard for deployment logs and analytics

### Troubleshooting Deployment

- **CORS Issues:** Verify `CLIENT_URL` environment variable includes your Vercel domain
- **Database Connection:** Ensure `MONGO_URI` is accessible from Vercel servers
- **Missing Images:** Verify Cloudinary credentials are correctly set
- **Build Failures:** Check Vercel build logs for specific error messages

---

## 🔧 Development Workflow

### Running Both Frontend and Backend Locally

**Terminal 1 - Backend:**
```bash
cd Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

The application will be available at `http://localhost:5173` with the backend running on `http://localhost:5000`.

### Hot Module Replacement (HMR)

Both frontend and backend support HMR during development:
- **Frontend:** Vite provides instant HMR for React components
- **Backend:** Nodemon automatically restarts the server on file changes

### Testing API Endpoints

Use tools like:
- [Postman](https://www.postman.com/) - GUI-based API testing
- [Thunder Client](https://www.thunderclient.com/) - VS Code extension
- `curl` - Command-line API testing

Example:
```bash
# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"John Doe","email":"john@example.com","password":"password123"}'

# Login user
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

---

## 📈 Performance Optimization

### Frontend Optimizations
- **Code Splitting:** Lazy loading of page components with React.lazy and Suspense
- **Tree Shaking:** Unused code removal during Vite build
- **Component Optimization:** React.memo for preventing unnecessary re-renders
- **CSS Optimization:** Tailwind CSS purges unused styles in production

### Backend Optimizations
- **Database Indexing:** Strategic indexes on frequently queried fields
- **Connection Pooling:** MongoDB connection pool with min/max settings
- **Response Compression:** Gzip compression on all API responses
- **Caching:** Node-cache for frequently accessed data
- **Rate Limiting:** Prevents abuse and DDoS attacks

---

## 👨‍💻 Author

**Ram Krishna** - Initial project development

---

## 🙏 Acknowledgments

- React and Vite communities
- Cloudinary for cloud storage
- MongoDB for database solutions
- All open-source libraries used in this project