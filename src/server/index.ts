import "dotenv/config";
import express from "express";
import { errorMiddleWare } from "./api/middleware.js";
import authRouter from "./routes/authRoutes.js"
import billsRouter from "./routes/billsRoutes.js"


const app = express();
const PORT = process.env.PORT ?? 3000;

// Built-in middleware to parse JSON request bodies
app.use(express.json());

// Route all /api/auth/* requests to authRouter
app.use("/api/auth", authRouter);

app.use("/api/bills", billsRouter);

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