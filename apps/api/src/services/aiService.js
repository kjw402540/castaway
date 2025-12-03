// --------------------------------------------------------
// apps/api/src/services/aiService.js
// Emotion + Notification + BGM 통합 Workflow
// --------------------------------------------------------

import prisma from "../lib/prisma.js";
import * as notificationService from "./notificationService.js";
import path from "path"; 

// 환경 변수 (8000번 포트 하나만 사용)
// ⚠️ 실제 배포 시 EC2 2의 Private IP로 변경해야 합니다.
//const AI_BASE_URL = "http://172.31.19.26:8000"; 
const AI_BASE_URL = "http://127.0.0.1:8000";

const LOCAL_BGM_DIR = path.join(process.cwd(), "local_bgm_files");


/**
 * 🔢 [Helper] 감정 라벨(String) -> DB 코드(Int) 변환
 */
function mapEmotionToInt(label) {
   if (!label) return 2; // 기본값: 중립
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
   let bgmFileLocation = null; 

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

      console.log(`📡 [Step 1] 감정 분석 요청...`);

      // =========================================================
      // STEP 1: 감정 분석 요청
      // =========================================================
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
      
      // ✅ [수정됨] Softmax 값 추출 및 Score 계산
      // DB에 저장할 원본 배열 (API 응답에 포함되어 있다고 가정)
      const emotionSoftmax = analyzeResult.emotion_softmax || []; 
      
      // BGM 생성에 쓸 점수 (배열 중 가장 큰 값 = 확신도)
      // 값이 없으면 기본값 0.5
      const emotionScore = emotionSoftmax.length > 0 
          ? Math.max(...emotionSoftmax) 
          : 0.5;

      const durationSeconds = 30; 

      // =========================================================
      // STEP 1.5: MusicGen BGM 생성 요청
      // =========================================================
      console.log(`📡 [Step 1.5] BGM 생성 및 SFTP 전송 시작 요청... (Score: ${emotionScore})`);
      
      const musicGenResponse = await fetch(`${AI_BASE_URL}/musicgen/generate`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({
            emotion_label: emotionLabel,
            emotion_score: emotionScore, // 👈 계산된 최대 확률값 전달
            duration_seconds: durationSeconds,
         }),
      });

      if (!musicGenResponse.ok) {
         console.warn(`MusicGen BGM 생성 API 실패 (HTTP ${musicGenResponse.status}). 다음 단계로 진행.`);
      }

      const musicGenResult = musicGenResponse.ok
         ? await musicGenResponse.json()
         : null;

      const bgmFileName = musicGenResult?.file_name ?? null;

      if (bgmFileName) {
         bgmFileLocation = path.join(LOCAL_BGM_DIR, bgmFileName);
         console.log(`✅ [Step 1.5] BGM 생성 요청 완료. DB 저장 경로: ${bgmFileLocation}`);
      } else {
         console.log(`⚠️ [Step 1.5] BGM 생성 결과 없음.`);
      }


      // =========================================================
      // STEP 2: EmotionResult DB 저장 (트랜잭션 적용)
      // =========================================================
      
      const savedEmotion = await prisma.$transaction(async (tx) => {
          // 1. 일단 벡터 없이 레코드 생성 (tx 사용)
          const emotion = await tx.emotionResult.create({
             data: {
                diary_id: Number(diaryId),
                summary_text: analyzeResult.cause_sentence ?? "",
                main_emotion: emotionInt,
                // emotion_softmax 제외
                keyword_1: analyzeResult.cause_keywords?.[0] ?? null,
                keyword_2: analyzeResult.cause_keywords?.[1] ?? null,
                keyword_3: analyzeResult.cause_keywords?.[2] ?? null,
             },
          });

          // 2. 퓨어 SQL로 벡터 데이터 업데이트 (tx 사용)
          if (emotionSoftmax && emotionSoftmax.length > 0) {
              const vectorString = JSON.stringify(emotionSoftmax);
              
              // 같은 트랜잭션(tx) 내에서 실행되므로 안전함
              await tx.$executeRawUnsafe(
                  `UPDATE "EmotionResult" SET emotion_softmax = '${vectorString}'::vector WHERE emotion_id = ${emotion.emotion_id}`
              );
          }

          return emotion;
      });

      console.log(`💉 [Step 2] Softmax Vector 데이터 SQL로 주입 및 저장 완료`);
      console.log(`💾 [Step 2] EmotionResult 저장 완료 (ID: ${savedEmotion.emotion_id})`);

      // =========================================================
      // STEP 2-BGM: BGM 테이블 DB 저장
      // =========================================================
      if (bgmFileLocation) {
         await prisma.bGM.create({
            data: {
               user_id: userId,
               emotion_id: savedEmotion.emotion_id,
               diary_id: Number(diaryId),
               bgm_url: bgmFileLocation, 
            },
         });
         console.log(`🎵 [Step 2-BGM] BGM 로컬 경로 저장 완료`);
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
         title: "오늘의 감정 분석 완료",
         message: `오늘 감정은 '${emotionLabelKor}'입니다.`,
         type: 2,
      });

      console.log(`📬 [Step 4] Notification 발송 성공!`);
      console.log(`🏁 [AI Workflow] 최종 완료!`);
   } catch (err) {
      console.error(`❌ [AI Workflow] 에러:`, err.message);
   }
};