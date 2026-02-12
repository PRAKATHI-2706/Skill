// backend/controllers/studentController.js
import User from "../models/User.js";
import Course from "../models/Course.js";

// 1️⃣ Get Profile & Enrolled Courses
export const getStudentDashboard = async (req, res) => {
  try {
    const { studentId } = req.params; // Usually passed from Auth/JWT
    const student = await User.findById(studentId);
    
    if (!student) return res.status(404).json({ message: "Student not found" });
    
    res.json({
      fullName: student.fullName,
      registerNo: student.registerNo,
      ongoing: student.ongoing,
      completed: student.completed
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2️⃣ Mark Topic as Completed (Self-Update)
export const completeTopic = async (req, res) => {
  try {
    const { studentId, courseId, topicTitle } = req.body;
    const student = await User.findById(studentId);

    if (!student) return res.status(404).json({ message: "Student not found" });

    const courseIndex = student.ongoing.findIndex(c => c.courseId.toString() === courseId);
    if (courseIndex === -1) return res.status(404).json({ message: "Course not found in ongoing" });

    // Update current topic to the one just completed or move to next
    student.ongoing[courseIndex].currentTopic = topicTitle;
    
    await student.save();
    res.json({ message: "Progress saved", ongoing: student.ongoing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
