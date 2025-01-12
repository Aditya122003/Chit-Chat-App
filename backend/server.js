import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve(); // Correct the directory path

// PORT should be assigned after calling dotenv.config() because we need to access the env variables.
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "https://chit-chat-lite.netlify.app",
      "https://chit-chat-app-o9xj.onrender.com",
    ], // your frontend's origin
    methods: ["GET", "POST", "PUT", "DELETE"], // allowed methods
    credentials: true, // if you need to send cookies or authorization headers
  })
);
app.use(express.json()); // to parse the incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

// Content-Security-Policy to allow fonts to load from data URLs
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; font-src 'self' data:;"
  );
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Serve static files from the 'frontend/build' directory (or 'frontend/dist' based on your setup)
app.use(express.static(path.join(__dirname, "frontend", "build"))); // Adjust 'build' or 'dist' as needed

// Serve the React index.html for any request that doesn't match an API route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});
