// src/services/diaryService.js
// 프론트에서 쓰는 순수 일기 CRUD 서비스
// 감정 분석/오브제/BGM/알림 생성은 백엔드 자동 처리!

import { USE_API } from "../config/apiConfig";
import { diaryApi } from "../api/diaryApi";
import { diaryMock } from "../mocks/diaryMock";

// 전체 일기 리스트 (달력용)
export const getAllDiaries = async () => {
  if (!USE_API) return diaryMock.getAll();

  try {
    const list = await diaryApi.getAll();
    if (!Array.isArray(list)) return {};

    const map = {};
    list.forEach((diary) => {
      if (diary.created_date && diary.flag === 1) {
        const dateKey = diary.created_date.split("T")[0];
        map[dateKey] = {
          ...diary,
          text: diary.original_text,
        };
      }
    });

    return map;
  } catch (err) {
    console.error("일기 목록 불러오기 실패:", err);
    return {};
  }
};

// 특정 날짜 조회
export const getDiaryByDate = (date) =>
  USE_API ? diaryApi.getByDate(date) : diaryMock.getByDate(date);

// 구독 이벤트
let listeners = new Set();
export function subscribeDiaryUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notifyDiaryUpdate() {
  listeners.forEach((fn) => fn());
}

// 일기 저장 (백엔드에서 모든 처리 자동 실행됨)
export const saveDiary = async (data) => {
  const apiData = {
    ...data,
    original_text: data.original_text || data.text || "",
  };

  const result = USE_API ? await diaryApi.save(apiData) : await diaryMock.save(data);
  notifyDiaryUpdate();
  return result;
};

// 삭제
export const deleteDiary = async (date) => {
  const result = USE_API ? diaryApi.delete(date) : diaryMock.delete(date);
  notifyDiaryUpdate();
  return result;
};
