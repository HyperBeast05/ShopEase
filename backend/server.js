import express from "express";
import dotenv from "dotenv";
import pool from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import cors from "cors";
import "./utils/email.js";

dotenv.config();

const app = express();

//1. Validate required environment variables
const requiredEnvVars = [
  "DB_HOST",
  "DB_USER",
  "DB_NAME",
  "JWT_SECRET",
  "FRONTEND_URL",
];

const missingEnvVars = requiredEnvVars.filter(
  (variable) => !process.env[variable],
);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  process.exit(1);
}

//2. Server configuration
const PORT = Number(process.env.PORT) || 5000;

//3. Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  }),
);

app.use(express.json());

//4. Root route

app.get("/", (req, res) => {
  res.status(200).send("E-commerce API is running");
});

//5.API Routes
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);

//6. Database test route
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 AS result");

    res.json({
      success: true,
      message: "Database connected successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

//7. 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

//8. Global error handler
app.use((error, req, res, next) => {
  console.error("Unhandled server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

//9. Start server after checking database connectivity
let server;

const startServer = async () => {
  try {
    await pool.query("SELECT 1");

    console.log("Database connected successfully");

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to database:", error);

    await pool.end();
    process.exitCode = 1;
  }
};

//10. Graceful shutdown
const shutdown = (signal) => {
  console.log(`${signal} received. Shutting down server...`);

  if (!server) {
    pool
      .end()
      .then(() => {
        process.exitCode = 0;
      })
      .catch((error) => {
        console.error("Error closing database pool:", error);
        process.exitCode = 1;
      });
    return;
  }

  server.close(async (error) => {
    if (error) {
      console.error("Error closing HTTP server:", error);
      process.exitCode = 1;
    }

    try {
      await pool.end();
      console.log("Database connection pool closed successfully");
    } catch (dbError) {
      console.error("Error closing database pool:", dbError);
      process.exitCode = 1;
    }
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Start the application
startServer();
