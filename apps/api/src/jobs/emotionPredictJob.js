import cron from "node-cron";
import prisma from "../lib/prisma.js";

// ✅ [FIX] 환경변수가 없을 경우를 대비해 로컬 기본값(8000) 설정
// (실제 AI 서버 주소에 맞춰 포트를 변경해서 쓰셔도 됩니다)
const AI_BASE_URL = process.env.AI_BASE_URL || "http://127.0.0.1:8000";

// ---------------------------------------------------------------------
// [HELPER FUNCTIONS]
// ---------------------------------------------------------------------

// 날짜를 YYYY-MM-DD 포맷으로 변환하는 헬퍼
const toYMD = (date) => date.toISOString().split('T')[0];

/**
 * ✅ [NEW] KST 시간대 보정 Date 객체를 만들어주는 헬퍼
 * KST 00:00:00 ~ KST 23:59:59.999 범위를 정확한 UTC timestamp로 변환합니다.
 */
const getKstRange = (ymdStr) => {
    // YYYY-MM-DDT00:00:00+09:00 형태로 문자열을 구성하여, 서버 환경과 관계없이 
    // 한국 시간 00시를 가리키는 정확한 시점을 Date 객체로 만듭니다.
    const start = new Date(`${ymdStr}T00:00:00+09:00`); 
    const end = new Date(`${ymdStr}T23:59:59.999+09:00`);
    return { gte: start, lte: end };
};

/**
 * 🔢 감정 라벨(String/Int) -> DB 코드(Int) 변환
 */
function mapEmotionToInt(label) {
    if (typeof label === 'number') return label;
    if (!label) return 2;
    const l = label.toLowerCase();
    
    if (l.includes("anger") || l.includes("disgust")) return 0;
    if (l.includes("joy") || l.includes("happy")) return 1;
    if (l.includes("neutral")) return 2;
    if (l.includes("sad")) return 3;
    if (l.includes("surprise") || l.includes("fear")) return 4;
    return 2;
}

// ---------------------------------------------------------------------
// [JOB SCHEDULER & LOGIC]
// ---------------------------------------------------------------------

/**
 * 🚀 스케줄러 시작 함수 (KST 기준 02:00 실행)
 */
export const startEmotionPredictionJob = () => {
    // Cron 표현식: "0 2 * * *" (매일 02:00:00 KST)
    cron.schedule("0 2 * * *", async () => {
        console.log("⏰ [Batch] 새벽 감정 예측 작업 시작 (LSTM)...");
        await runBatchPrediction();
    }, {
        // ✅ [FIX] KST 타임존 강제 지정 (실행 시간 보정)
        timezone: "Asia/Seoul" 
    });
};

/**
 * 🏃‍♂️ 실제 배치 작업 로직
 */
export const runBatchPrediction = async () => {
    try {
        console.log(`🤖 AI API URL 확인: ${AI_BASE_URL}`);

        // ✅ [FIX] KST 기준으로 오늘 날짜를 구함
        const nowKST = new Date(new Date().getTime() + 9 * 60 * 60 * 1000); 
        
        // 1. 가입한 지 14일 지난 유저 찾기
        const fourteenDaysAgo = new Date(nowKST);
        fourteenDaysAgo.setDate(nowKST.getDate() - 14);

        const targetUsers = await prisma.user.findMany({
            where: {
                created_date: { lte: fourteenDaysAgo }, 
                used_flag: 1
            }
        });

        console.log(`👥 [Batch] 대상 유저 수: ${targetUsers.length}명`);

        for (const user of targetUsers) {
            await processUser(user);
        }

        console.log("✅ [Batch] 모든 유저 예측 작업 완료!");

    } catch (err) {
        console.error("❌ [Batch] 전체 작업 중 치명적 에러:", err);
    }
};

/**
 * 👤 개별 유저 데이터 수집 및 예측 요청
 */
const processUser = async (user) => {
    const userId = user.user_id;
    
    const emotionLabelList = [];
    const dayOfWeekList = [];
    const changeFlagList = [];
    let prevEmotion = -1;

    // ✅ [FIX] KST 기준으로 어제 날짜 구함
    const nowKST = new Date(new Date().getTime() + 9 * 60 * 60 * 1000); 
    const yesterday = new Date(nowKST);
    yesterday.setDate(nowKST.getDate() - 1);

    // 시작일: 어제로부터 13일 전 (총 14일 구간)
    const startDate = new Date(yesterday);
    startDate.setDate(yesterday.getDate() - 13);
    try {
        // 14일 전 ~ 어제까지 루프 (과거 -> 최신 순서로 쌓음)
        for (let i = 13; i >= 0; i--) {
            const targetDate = new Date(yesterday);
            targetDate.setDate(yesterday.getDate() - i);
            const targetYMD = toYMD(targetDate);

            // ✅ [FIX] KST 범위로 쿼리
            const dateRange = getKstRange(targetYMD); 
            
            // ---------------------------------------------------------
            // 🔍 Hybrid 데이터 조회 (KST 범위 사용)
            // ---------------------------------------------------------
            
            const history = await prisma.emotionPrediction.findFirst({
                where: { 
                    user_id: userId, 
                    // [수정] target_date 컬럼이 없으므로 created_date로 조회
                    created_date: dateRange 
                } 
            });

            const realDiary = await prisma.diary.findFirst({
                where: { user_id: userId, flag: 1, created_date: dateRange },
                include: { emotionResult: true }
            });

            let emotionVal = 2; 

            // 로직: 진짜 일기(Diary)가 있으면 최우선 -> 그게 아니면 Prediction 테이블의 main -> predicted 순
            if (realDiary && realDiary.emotionResult) {
                emotionVal = realDiary.emotionResult.main_emotion;
            } else if (history) {
                if (history.main_emotion !== null) {
                    emotionVal = history.main_emotion;
                } else {
                    emotionVal = history.predicted_emotion;
                }
            } else {
                emotionVal = 2;
            }

            // ---------------------------------------------------------
            // 📝 리스트 구성
            // ---------------------------------------------------------
            emotionLabelList.push(emotionVal);

            // Day of Week (0:일요일 ~ 6:토요일)
            dayOfWeekList.push(targetDate.getDay()); 

            // Change Flag (전날 대비 변화 여부)
            if (prevEmotion !== -1) {
                changeFlagList.push(prevEmotion !== emotionVal ? 1.0 : 0.0);
            } else {
                changeFlagList.push(0.0);
            }
            prevEmotion = emotionVal;
        }
        // =========================================================
        // 🔍 [DEBUG] 여기에 로그 추가 (AI 전송 직전 데이터 확인)
        // =========================================================
        console.log(`----------------------------------------------------------------`);
        console.log(`🔍 [DEBUG] User ID: ${userId} / 데이터 생성 완료`);
        console.log(`📊 감정 흐름 (14일):`, JSON.stringify(emotionLabelList));
        console.log(`🗓️ 대상 기간: ${toYMD(startDate)} ~ ${toYMD(yesterday)} (총 14일)`);
        console.log(`📅 요일 흐름 (14일):`, JSON.stringify(dayOfWeekList));
        console.log(`----------------------------------------------------------------`);
        // =========================================================
        // 📡 AI 서버 요청 (POST /emotion/predict)
        // =========================================================
        const payload = {
            emotion_label: emotionLabelList,
            day_of_week: dayOfWeekList,
            change_flag: changeFlagList,
            user_type: user.cluster_id || 0
        };

        console.log(`🚀 [DEBUG] AI 전송 Payload 확인 (User: ${userId}):`);
        console.log(JSON.stringify(payload, null, 2));
        
        const response = await fetch(`${AI_BASE_URL}/emotion/predict`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`AI Request Failed: ${response.status}`);
        }

        const rawText = await response.text(); 
        let result;
        try {
            const firstBrace = rawText.indexOf('{');
            const lastBrace = rawText.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                const jsonStr = rawText.substring(firstBrace, lastBrace + 1);
                result = JSON.parse(jsonStr);
            } else {
                throw new Error("JSON Object Missing");
            }
        } catch (e) {
             throw new Error(`AI response corrupted: ${e.message}`);
        }


        // =========================================================
        // 💾 예측 결과 저장 (EmotionPrediction)
        // =========================================================
        
        const predInt = mapEmotionToInt(result.predicted_emotion);
        
        // 오늘 날짜 생성 (KST)
        const now = new Date();
        const nowForDB = new Date(now.getTime() + 9 * 60 * 60 * 1000);

        // ✅ [FIX] Vector 저장을 위한 트랜잭션 + Raw SQL 방식 적용
        await prisma.$transaction(async (tx) => {
            // 1. Vector 필드 제외하고 레코드 생성
            const newPrediction = await tx.emotionPrediction.create({
                data: {
                    user_id: userId,
                    // target_date 제거됨 -> created_date 사용
                    created_date: nowForDB,
                    predicted_emotion: predInt,
                    main_emotion: null,
                    // emotion_softmax: ... (여기서는 제외)
                }
            });

            // 2. Vector 데이터가 있다면 Raw Query로 별도 업데이트
            if (result.emotion_softmax && result.emotion_softmax.length > 0) {
                const vectorString = JSON.stringify(result.emotion_softmax);
                
                // 주의: 테이블명 "EmotionPrediction" (PascalCase 확인)
                await tx.$executeRawUnsafe(
                    `UPDATE "EmotionPrediction" 
                     SET emotion_softmax = '${vectorString}'::vector 
                     WHERE prediction_id = ${newPrediction.prediction_id}`
                );
            }

            return newPrediction;
        });

        console.log(`🔮 [Batch] User ${userId} 예측 저장 완료: ${result.predicted_emotion} (${predInt}) / 날짜: ${toYMD(nowForDB)}`);

    } catch (e) {
        console.error(`❌ [Batch] User ${userId} 실패:`, e.message);
    }
};