import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { errorMiddleWare } from "./api/middleware.js";
import authRouter from "./routes/authRoutes.js";
import billsRouter from "./routes/billsRoutes.js";
import usersRouter from "./routes/usersRoutes.js"


const app = express();
const PORT = process.env.PORT ?? 3000;

// Built-in middleware to parse JSON request bodies
app.use(express.json());
// Parse incoming cookies (needed to read the refresh token cookie)
app.use(cookieParser());


// Route all (e.g.) /api/auth/* requests to authRouter
app.use("/api/auth", authRouter);
app.use("/api/bills", billsRouter);
app.use("/api/users", usersRouter);
// Error handling middleware in non-async code
app.use(errorMiddleWare);

async function main() {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});