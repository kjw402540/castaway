// src/index.js
import express from "express";
import cors from "cors";

// Routes
import diaryRoutes from "./routes/diaryRoutes.js";
import objectRoutes from "./routes/objectRoutes.js";
import bgmRoutes from "./routes/bgmRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import emotionRoutes from "./routes/emotionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

// API 등록
app.use("/diary", diaryRoutes);
app.use("/object", objectRoutes);
app.use("/bgm", bgmRoutes);
app.use("/notification", notificationRoutes);
app.use("/emotion", emotionRoutes);
app.use("/report", reportRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.listen(3000, () => {
  console.log("API server running at http://localhost:3000");
});
