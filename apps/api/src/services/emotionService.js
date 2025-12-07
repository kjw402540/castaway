// src/services/emotionService.js

import prisma from '../lib/prisma.js';
import { Prisma } from '@prisma/client';
import { createDayVector } from "./emotionAIService.js";

export async function save(data) {
  return null;
}

export async function getByDiaryId(diary_id) {
  return null;
}

const EMOTION_LABEL_TO_INT = {
    "joy": 1, 
    "sadness": 2, 
    "sad": 2,  // 추가
    "neutral": 0, 
    "angry": 3,  // 추가
    "fear": 4,   // 추가
};

/**
 * 벡터 차원을 검증하고 필요시 패딩/자르기를 수행합니다.
 * @param {number[]} vector - 입력 벡터
 * @param {number} expectedDim - 기대하는 차원
 * @param {string} fieldName - 필드명 (로깅용)
 * @returns {number[]} 올바른 차원의 벡터
 */
function validateAndFixVectorDimension(vector, expectedDim, fieldName) {
    if (!Array.isArray(vector)) {
        console.warn(`⚠️ ${fieldName}: 배열이 아님. 기본값 생성.`);
        return new Array(expectedDim).fill(0);
    }
    
    if (vector.length === expectedDim) {
        return vector;
    }
    
    if (vector.length < expectedDim) {
        console.warn(`⚠️ ${fieldName}: ${vector.length}차원 → ${expectedDim}차원으로 패딩`);
        return [...vector, ...new Array(expectedDim - vector.length).fill(0)];
    }
    
    console.warn(`⚠️ ${fieldName}: ${vector.length}차원 → ${expectedDim}차원으로 자르기`);
    return vector.slice(0, expectedDim);
}

/**
 * Day Vector를 생성하고 DB에 저장합니다.
 * @param {object} dayVectorData - user_id, emotion_label, softmax, embedding, diary_id, keyword1, keyword2
 * @returns {Promise<number[]>} 저장된 Day Vector 배열
 */
export async function generateDayVectorAndSave(dayVectorData) {
    
    const { 
        user_id, 
        emotion_label, 
        softmax, 
        embedding, 
        diary_id,
        keyword1,
        keyword2
    } = dayVectorData;
    
    let dayVector;

    // diary_id 필수 값 검사 
    if (!diary_id) {
        throw new Error("Missing mandatory field: diary_id.");
    }
    
    // diary_id 존재 여부 확인 (FK 제약 대응)
    const diaryExists = await prisma.diary.findUnique({
        where: { diary_id: diary_id }
    });
    
    if (!diaryExists) {
        throw new Error(`Diary ID ${diary_id} does not exist. Please create a diary record first.`);
    }
    
    // emotion_label을 main_emotion (Int)으로 변환
    const main_emotion_value = EMOTION_LABEL_TO_INT[emotion_label] || 0;

    try {
        // 1. AI 서버에 Day Vector 생성 요청 (1550차원 배열 획득)
        dayVector = await createDayVector(dayVectorData);
        
        // 벡터 차원 검증 및 수정
        const validatedSoftmax = validateAndFixVectorDimension(softmax, 5, "emotion_softmax");
        const validatedEmbedding = validateAndFixVectorDimension(embedding, 384, "embedding");
        const validatedDayVector = validateAndFixVectorDimension(dayVector, 1550, "day_vector");

        // 2. UPSERT: 기존 레코드가 있으면 업데이트, 없으면 생성
        const existingRecord = await prisma.emotionResult.findFirst({
            where: { diary_id: diary_id },
            select: { emotion_id: true }
        });

        let emotion_id;

        if (existingRecord) {
            // 기존 레코드 업데이트
            console.log(`⚠️ [Service] diary_id ${diary_id}에 이미 EmotionResult 존재. 업데이트합니다.`);
            await prisma.emotionResult.update({
                where: { emotion_id: existingRecord.emotion_id },
                data: {
                    main_emotion: main_emotion_value,
                    keyword_1: keyword1,
                    keyword_2: keyword2,
                    summary_text: "AI 요약 텍스트 자리",
                }
            });
            emotion_id = existingRecord.emotion_id;
        } else {
            // 새 레코드 생성
            const newRecord = await prisma.emotionResult.create({
                data: {
                    diary_id: diary_id,
                    main_emotion: main_emotion_value,
                    keyword_1: keyword1,
                    keyword_2: keyword2,
                    summary_text: "AI 요약 텍스트 자리",
                },
                select: {
                    emotion_id: true
                }
            });
            emotion_id = newRecord.emotion_id;
        }
        
        // 3. Raw SQL UPDATE로 벡터 필드 삽입
        await prisma.$executeRaw(Prisma.sql`
            UPDATE "EmotionResult"
            SET 
                "emotion_softmax" = ${JSON.stringify(validatedSoftmax)}::vector,
                "embedding" = ${JSON.stringify(validatedEmbedding)}::vector,
                "day_vector" = ${JSON.stringify(validatedDayVector)}::vector
            WHERE "emotion_id" = ${emotion_id};
        `);
        
        console.log(`✅ [Service] EmotionResult #${emotion_id}에 벡터 저장 완료.`);
        console.log(`   - emotion_softmax: ${validatedSoftmax.length}차원`);
        console.log(`   - embedding: ${validatedEmbedding.length}차원`);
        console.log(`   - day_vector: ${validatedDayVector.length}차원`);
        
        return validatedDayVector;

    } catch (error) {
        console.error(`❌ [Emotion Service Error] Day Vector 처리 실패: ${error.message}`);
        throw error; 
    }
}