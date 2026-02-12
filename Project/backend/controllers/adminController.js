import Course from "../models/Course.js";
import User from "../models/User.js";

// 1️⃣ Add Course
export const addCourse = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ message: "Course title required" });

    const existing = await Course.findOne({ title });
    if (existing) return res.status(400).json({ message: "Course already exists" });

    const course = await Course.create({ title, topics: [], enrolledStudents: 0 });

    res.status(201).json({ message: "Course added successfully", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2️⃣ Add Topic to Course
export const addTopic = async (req, res) => {
  try {
    const { courseId, topic } = req.body;
    if (!courseId || !topic) return res.status(400).json({ message: "Course and topic required" });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    course.topics.push({ title: topic });
    await course.save();

    res.json({ message: "Topic added successfully", course });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3️⃣ Fetch Courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4️⃣ Get Student by Roll Number
export const getStudent = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const student = await User.findOne({
      registerNo: { $regex: `^${rollNumber.trim()}$`, $options: "i" }
    });

    if (!student) return res.status(404).json({ message: "Student not found" });

    // Ensure ongoing/completed exist
    student.ongoing = student.ongoing || [];
    student.completed = student.completed || [];

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5️⃣ Update Student Progress
export const updateTopic = async (req, res) => {
  try {
    const { rollNumber, courseId, topic } = req.body;
    const student = await User.findOne({
      registerNo: { $regex: `^${rollNumber.trim()}$`, $options: "i" }
    });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const courseObj = student.ongoing.find(c => c.courseId.toString() === courseId);
    if (!courseObj) return res.status(404).json({ message: "Course not found for student" });

    // Find course in DB for topic list
    const courseDoc = await Course.findById(courseId);
    if (!courseDoc) return res.status(404).json({ message: "Course not found" });

    // Mark current topic as completed
    const currentIndex = courseObj.allTopics.indexOf(courseObj.currentTopic);
    let nextTopic = null;
    if (topic === "Completed") {
      // Move to next topic if available
      if (currentIndex < courseObj.allTopics.length - 1) {
        nextTopic = courseObj.allTopics[currentIndex + 1];
        courseObj.currentTopic = nextTopic;
        // Optionally track progress level/status
        courseObj.progressLevel = Math.round(((currentIndex + 1) / courseObj.allTopics.length) * 100);
        courseObj.status = "In Progress";
      } else {
        // All topics completed, mark course as completed
        const courseTitle = courseObj.title;
        if (!student.completed.includes(courseTitle)) student.completed.push(courseTitle);
        student.ongoing = student.ongoing.filter(c => c.courseId.toString() !== courseId);
      }
    } else {
      // Just update current topic
      courseObj.currentTopic = topic;
    }

    await student.save();
    res.json({ message: "Progress updated successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6️⃣ Enroll Student to Course
export const enrollStudent = async (req, res) => {
  try {
    const { studentId, courseId } = req.body;
    const student = await User.findById(studentId);
    const course = await Course.findById(courseId);

    if (!student || !course) return res.status(404).json({ message: "User or Course not found" });

    if (student.ongoing.some(c => c.courseId.toString() === courseId)) {
      return res.status(400).json({ message: "Student already enrolled" });
    }

    student.ongoing.push({
      courseId: course._id,
      title: course.title,
      currentTopic: course.topics[0]?.title || "Getting Started",
      allTopics: course.topics.map(t => t.title)
    });

    course.enrolledStudents = (course.enrolledStudents || 0) + 1;

    await student.save();
    await course.save();

    res.json({ message: "Student enrolled successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
