// backend/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  registerNo: { type: String, required: true },
  department: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  linkedin: { type: String, default: "" },
  github: { type: String, default: "" },
  leetcode: { type: String, default: "" },

  ongoing: [
    {
      courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      title: String,
      currentTopic: String,
      allTopics: [String],
    },
  ],
  completed: [String], // completed course titles
});

export default mongoose.model("User", userSchema); // <-- ES module export
