// backend/routes/studentRoutes.js
import express from "express";
import * as studentController from "../controllers/studentController.js";

const router = express.Router();

// Get dashboard data for a specific student
router.get("/dashboard/:studentId", studentController.getStudentDashboard);

// Update progress from student side
router.post("/update-progress", studentController.completeTopic);

export default router; // <-- ES Module default export
