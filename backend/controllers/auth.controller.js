import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import axios from 'axios';

const generateAvatarUrl = async (username, gender) => {
  try {
    // Define gender and style for DiceBear
    const genderStyle = gender === 'male' ? 'male' : 'female';
    const apiUrl = `https://api.dicebear.com/6.x/avataaars/svg?seed=${username}&gender=${genderStyle}`;

    // Fetch the avatar
    const response = await axios.get(apiUrl);
    if (response.status === 200) {
      return apiUrl; // Return the avatar URL
    } else {
      console.error('Failed to fetch avatar, status code:', response.status);
      return ''; // Return a default URL or fallback
    }
  } catch (error) {
    console.error('Error generating avatar', error.message);
    return ''; // Return a default URL or fallback
  }
};

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords don't match" });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate avatar URL using DiceBear API
    const profilePic = await generateAvatarUrl(username, gender);

    // Create new user with the generated avatar URL
    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic, // Use the generated avatar URL
    });

    // Save the user and set token
    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
