// adminRoutes.js
import express from "express";
import * as adminController from "../controllers/adminController.js"; // ES Module import

const router = express.Router();


router.post("/add-course", adminController.addCourse);
router.post("/add-topic", adminController.addTopic);
router.get("/courses", adminController.getCourses);
router.get("/student/:rollNumber", adminController.getStudent);
router.post("/enroll-student", adminController.enrollStudent);
router.put("/update-topic", adminController.updateTopic);

export default router; // <-- ES Module default export
