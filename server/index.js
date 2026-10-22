import dns from "node:dns";
import projectsRouter from "./routes/projects.js";
dns.setServers(["8.8.8.8"]);
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "server/.env" });

const app = express();

app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use("/api/projects", projectsRouter);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "WebCraft API is running" });
});

app.get("/api/db-health", (req, res) => {
  res.json({
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from server/.env");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`WebCraft API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
