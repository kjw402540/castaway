// apps/api/src/services/aiService.js

import prisma from "../lib/prisma.js";
import * as notificationService from "./notificationService.js";
import path from "path"; 

// 환경 변수 설정
// const AI_BASE_URL = process.env.AI_BASE_URL || "http://172.31.19.26:8000"; // EC2 내부 IP
const LOCAL_BGM_DIR = path.join(process.cwd(), "local_bgm_files");
// ▼ [추가] Node 서버 내 오브제 파일이 위치할 가상의 경로 (DB 저장용 정보)
// 실제 파일은 main.py가 SFTP로 EC2 1의 특정 폴더에 꽂아줍니다.
const LOCAL_OBJECT_DIR = "/home/ubuntu/apps/castaway_ai/generated_objects"; 

/**
 * 🔢 [Helper] 감정 라벨(String) -> DB 코드(Int) 변환
 */
function mapEmotionToInt(label) {
   if (!label) return 2; 
   const lowerLabel = label.toLowerCase();
   if (lowerLabel.includes("anger") || lowerLabel.includes("disgust")) return 0;
   if (lowerLabel.includes("joy") || lowerLabel.includes("happy")) return 1;
   if (lowerLabel.includes("neutral")) return 2;
   if (lowerLabel.includes("sad")) return 3;
   if (lowerLabel.includes("surprise") || lowerLabel.includes("fear")) return 4;
   return 2;
}

/**
 * 🚀 [AI Workflow] 전체 프로세스 실행
 */
export const runFullAnalysisWorkflow = async (diaryId, text) => {
   console.log(`🚀 [AI Workflow] 시작 (Diary ID: ${diaryId})`);
   const AI_BASE_URL = process.env.AI_BASE_URL || "http://127.0.0.1:8000";
   
   // 결과 파일명을 담을 변수
   let bgmFileName = null;
   let objectFileName = null;

   try {
      // =========================================================
      // STEP 0: 작성자(User ID) 조회
      // =========================================================
      const currentDiary = await prisma.diary.findUnique({
         where: { diary_id: Number(diaryId) },
         select: { user_id: true }, 
      });

      if (!currentDiary) {
         throw new Error(`일기를 찾을 수 없습니다. diary_id=${diaryId}`);
      }
      const userId = currentDiary.user_id;

      // =========================================================
      // STEP 1: 감정 분석 요청
      // =========================================================
      console.log(`📡 [Step 1] 감정 분석 요청...`);
      const analyzeResponse = await fetch(`${AI_BASE_URL}/emotion/analyze`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ text }),
      });

      if (!analyzeResponse.ok) throw new Error("감정 분석 API 실패");

      const analyzeResult = await analyzeResponse.json();
      console.log(`✅ [Step 1] 분석 완료: ${analyzeResult.emotion_label}`);

      const emotionInt = mapEmotionToInt(analyzeResult.emotion_label);
      const emotionLabel = analyzeResult.emotion_label; 
      const emotionSoftmax = analyzeResult.emotion_softmax || []; 
      
      const emotionScore = emotionSoftmax.length > 0 
          ? Math.max(...emotionSoftmax) 
          : 0.5;

      const durationSeconds = 30; 

      // =========================================================
      // STEP 1.5 ~ 1.6: BGM & 오브제 생성 요청 (병렬 처리)
      // =========================================================
      console.log(`📡 [Step 1.5 & 1.6] BGM 및 오브제 생성 요청 (Parallel)...`);

      // ▼ 두 요청을 동시에 보내서 시간 절약 (Promise.all)
      const [musicGenResult, objectGenResult] = await Promise.all([
          // 1. MusicGen 요청
          fetch(`${AI_BASE_URL}/musicgen/generate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  emotion_label: emotionLabel,
                  emotion_score: emotionScore,
                  duration_seconds: durationSeconds,
              }),
          }).then(res => res.ok ? res.json() : null).catch(err => {
              console.warn("⚠️ BGM 생성 실패:", err.message);
              return null;
          }),

          // 2. ObjectGen 요청 (추가됨)
          fetch(`${AI_BASE_URL}/object/generate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                  // TODO: 사용자별 카테고리가 있다면 DB User 테이블에서 가져와야 함. 현재는 기본값
                  user_category: "study_future_extended", 
                  emotion: emotionLabel,
                  keywords: analyzeResult.cause_keywords || []
              }),
          }).then(res => res.ok ? res.json() : null).catch(err => {
              console.warn("⚠️ 오브제 생성 실패:", err.message);
              return null;
          })
      ]);

      // 결과 처리
      if (musicGenResult?.file_name) {
          bgmFileName = musicGenResult.file_name;
          console.log(`✅ [BGM Generated] ${bgmFileName}`);
      }
      if (objectGenResult?.file_name) {
          objectFileName = objectGenResult.file_name;
          console.log(`✅ [Object Generated] ${objectFileName}`);
      }

      // =========================================================
      // STEP 2: EmotionResult DB 저장 (트랜잭션 적용)
      // =========================================================
      const savedEmotion = await prisma.$transaction(async (tx) => {
         // 1. EmotionResult 생성
         const emotion = await tx.emotionResult.create({
            data: {
               diary_id: Number(diaryId),
               summary_text: analyzeResult.cause_sentence ?? "",
               main_emotion: emotionInt,
               keyword_1: analyzeResult.cause_keywords?.[0] ?? null,
               keyword_2: analyzeResult.cause_keywords?.[1] ?? null,
               keyword_3: analyzeResult.cause_keywords?.[2] ?? null,
            },
         });

         // 2. Vector 데이터 주입
         if (emotionSoftmax && emotionSoftmax.length > 0) {
            const vectorString = JSON.stringify(emotionSoftmax);
            await tx.$executeRawUnsafe(
               `UPDATE "EmotionResult" SET emotion_softmax = '${vectorString}'::vector WHERE emotion_id = ${emotion.emotion_id}`
            );
         }
         return emotion;
      });

      console.log(`💾 [Step 2] EmotionResult 저장 완료 (ID: ${savedEmotion.emotion_id})`);

      // =========================================================
      // STEP 2-BGM: BGM 테이블 저장
      // =========================================================
      if (bgmFileName) {
         // 로컬 풀 경로 생성 (BGM은 기존 로직 유지)
         const bgmPath = path.join(LOCAL_BGM_DIR, bgmFileName);
         
         await prisma.bGM.create({
            data: {
               user_id: userId,
               emotion_id: savedEmotion.emotion_id,
               diary_id: Number(diaryId),
               bgm_url: bgmPath, 
            },
         });
         console.log(`🎵 [Step 2-BGM] BGM DB 저장 완료`);
      }

      // =========================================================
      // STEP 2-Object: Object 테이블 저장 (▼ 추가됨)
      // =========================================================
      if (objectFileName) {
         // Object 테이블 스키마에 맞춰 저장
         await prisma.object.create({
            data: {
               emotion_id: savedEmotion.emotion_id,
               user_id: userId,
               diary_id: Number(diaryId),
               object_name: `오늘의 오브제 (${analyzeResult.emotion_label})`, // 이름 자동 생성
               object_image: objectFileName, // 파일명만 저장 (라우터에서 filename으로 찾음)
            }
         });
         console.log(`🖼️ [Step 2-Object] 오브제 DB 저장 완료: ${objectFileName}`);
      }

      // =========================================================
      // STEP 3: Diary 테이블 emotion_id 업데이트
      // =========================================================
      await prisma.diary.update({
         where: { diary_id: Number(diaryId) },
         data: { emotion_id: savedEmotion.emotion_id },
      });

      console.log(`🔗 [Step 3] Diary 연결 완료`);

      // =========================================================
      // STEP 4: Notification 생성
      // =========================================================
      const emotionLabelKor =
         ["분노/혐오", "기쁨", "중립", "슬픔", "놀람/공포"][emotionInt] ?? "감정";

      await notificationService.create({
         user_id: userId,
         title: "오늘의 기록 완료",
         message: `감정 분석과 나만의 오브제가 도착했습니다! (${emotionLabelKor})`,
         type: 2,
      });

      console.log(`📬 [Step 4] Notification 발송 성공!`);
      console.log(`🏁 [AI Workflow] 최종 완료!`);

   } catch (err) {
      console.error(`❌ [AI Workflow] 에러:`, err.message);
   }
};