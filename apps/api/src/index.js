// src/index.js
import "dotenv/config";  

import express from "express";
import cors from "cors";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/authRoutes.js";
import diaryRoutes from "./routes/diaryRoutes.js";
import objectRoutes from "./routes/objectRoutes.js";
import bgmRoutes from "./routes/bgmRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import emotionRoutes from "./routes/emotionRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import clusterRoutes from "./routes/clusterRoutes.js";

// cron
import { startEmotionPredictionJob, runBatchPrediction } from "./jobs/emotionPredictJob.js";
import { initScheduledJobs } from './jobs/reportJob.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// API prefix
app.use("/api/auth", authRoutes);
app.use("/api/diary", diaryRoutes);
app.use("/api/object", objectRoutes);
app.use("/api/bgm", bgmRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/emotion", emotionRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cluster", clusterRoutes);

app.get('/test/force-prediction', async (req, res) => {
  try {
    console.log("🚀 [Manual] 감정 예측 강제 실행!");
    await runBatchPrediction();
    res.send("✅ 배치 작업 실행 완료! 로그 확인하세요.");
  } catch (e) {
    console.error(e);
    res.status(500).send("에러: " + e.message);
  }
});

// 기본 404 핸들러 (선택)
app.use((req, res) => {
  res.status(404).json({ message: "API endpoint not found" });
});

// 기본 에러 핸들러
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ message: err.message });
});

startEmotionPredictionJob();
initScheduledJobs();

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});


