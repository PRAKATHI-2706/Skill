// backend/routes/auth.js
import express from "express";
import * as authController from "../controllers/authController.js"; // ES module import

const router = express.Router();


// POST /api/auth/register
router.post("/register", authController.register);

// POST /api/auth/login
router.post("/login", authController.login);

// PUT /api/auth/update-profile
router.put("/update-profile", authController.updateProfile);

export default router; // <-- ES module default export
