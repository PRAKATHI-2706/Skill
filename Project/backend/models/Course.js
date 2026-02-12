// backend/models/Course.js
import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  level: { type: String, enum: ["Basic", "Intermediate", "Advanced"], default: "Basic" },
  completed: { type: Boolean, default: false },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Match Admin.jsx frontend
  topics: [topicSchema],
  enrolledStudents: { type: Number, default: 0 }, // for pie chart
});

export default mongoose.model("Course", courseSchema); // <-- ES Module export
