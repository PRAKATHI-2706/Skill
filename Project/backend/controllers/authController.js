// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { email, name, linkedin, github, leetcode, mobile } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.fullName = name || user.fullName;
    user.linkedin = linkedin || user.linkedin;
    user.github = github || user.github;
    user.leetcode = leetcode || user.leetcode;
    user.mobile = mobile || user.mobile;
    await user.save();

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
// backend/controllers/authController.js
import User from "../models/User.js"; // ES module import

// Register a new user
export const register = async (req, res) => {
  try {
    const { fullName, registerNo, department, mobile, email, password } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user
    const newUser = new User({
      fullName,
      registerNo,
      department,
      mobile,
      email,
      password,
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check password (plain text for now)
    if (user.password !== password) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
