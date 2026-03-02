// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Import local modules
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const globalErrorHandler = require('./middleware/errorMiddleware');
const { sanitizeMongoParams } = require("./middleware/validationMiddleware");
const connectDBMiddleware = require("./middleware/connectDBMiddleware");


// Initialize express app
const app = express();

// Enable gzip compression for all responses to reduce bandwidth usage
app.use(compression());

// Apply Helmet middleware for security headers
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Enable Cross-Origin Resource Sharing (CORS) early
// This allows the frontend to make requests to the backend, including preflight OPTIONS requests
const allowedOrigins = (process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : ["http://localhost:5173", "http://localhost:5174"])
  .map(url => url.trim()); // Trim whitespace from each URL

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Allow any Vercel deployment (preview or production)
      if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        // Log the disallowed origin for debugging
        console.error(`CORS: Origin '${origin}' not allowed.`);
        callback(null, false); // Explicitly disallow the origin
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"], // Allowed headers
    credentials: true, // Allow credentials
  }),
);

// Rate limiting for general API endpoints
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000, // limit each IP to 5000 requests per windowMs (Relaxed for Dev)
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limiting for authentication endpoints (login and register)
const loginRegisterLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 attempts per windowMs
  message: "Too many login or registration attempts from this IP, please try again later.",
  skipSuccessfulRequests: false,
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for image uploads
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 upload attempts per windowMs
  message: "Too many image upload attempts from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Trust the proxy (required for Vercel/Heroku/etc to pass secure cookies)
app.set("trust proxy", 1);

// Apply general rate limiting to all requests except auth and upload
app.use((req, res, next) => {
  if (req.path.startsWith("/api/v1/auth/login") || req.path.startsWith("/api/v1/auth/register")) {
    return loginRegisterLimiter(req, res, next);
  }
  if (req.path.startsWith("/api/v1/auth/upload-image")) {
    return uploadLimiter(req, res, next);
  }
  return generalLimiter(req, res, next);
});

// Parse incoming JSON requests
app.use(express.json());

// Ensure Database Connection for every request (Serverless fix)
app.use(connectDBMiddleware);

// Sanitize MongoDB parameters to prevent NoSQL injection
app.use(sanitizeMongoParams);

// Root route to check if server is running
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

// Define API routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/budgets", budgetRoutes);
app.use("/api/v1/transactions", transactionRoutes);

// Serve static files (Optional: mostly for local dev or if you keep backend/frontend together)
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// app.use(express.static(path.join(__dirname, "../Frontend/dist")));

// Catch-all for React app - commented out for Vercel deployment as it handles routing
// app.use((req, res, next) => {
//   if (req.path.startsWith('/api')) {
//     return next();
//   }
//   res.sendFile(path.resolve(__dirname, "../Frontend/dist", "index.html"));
// });

// Global error handling middleware
app.use(globalErrorHandler);

// Export the app for Vercel
module.exports = app;

// --- Server Startup ---
const startServer = async () => {
  try {
    await connectDB(); // Ensure DB is connected before starting the server
    const PORT = process.env.PORT || 5000;
    // Only listen if not running in a serverless environment (i.e., running for local development)
    if (require.main === module) {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

// Only run the server startup in local development (not in Vercel serverless)
if (require.main === module) {
  startServer();
}