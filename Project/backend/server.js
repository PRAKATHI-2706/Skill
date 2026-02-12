import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js"; // default import now works
import adminRoutes from "./routes/adminRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

console.log("Checking DB URL:", process.env.MONGO_URL ? "URL Found ✅" : "URL NOT FOUND ❌");

const MONGO_URI = process.env.MONGO_URL;

if (!MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URL is not defined in .env file!");
    process.exit(1);
}

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/student", studentRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
        app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err.message);
    });
