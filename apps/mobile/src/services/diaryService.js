// src/services/diaryService.js
import { USE_API } from "../config/apiConfig";
import { diaryApi } from "../api/diaryApi";
import { diaryMock } from "../mocks/diaryMock";

export const getAllDiaries = async () => {
  if (USE_API) {
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
  } else {
    return diaryMock.getAll();
  }
};

export const getDiaryByDate = (date) =>
  USE_API ? diaryApi.getByDate(date) : diaryMock.getByDate(date);

let listeners = new Set();
export function subscribeDiaryUpdate(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
function notifyDiaryUpdate() {
  listeners.forEach((fn) => fn());
}

export const saveDiary = async (data) => {
  const apiData = {
    ...data,
    original_text: data.text || "",
  };

  const result = USE_API
    ? await diaryApi.save(apiData)
    : await diaryMock.save(data);

  notifyDiaryUpdate();

  // 감정 레이블을 확실히 프론트로 보내도록
  return {
    ...result,
    text: result.original_text ?? data.text,
    emotion_label: result.emotion_label ?? null,
  };
};

export const deleteDiary = async (date) => {
  const result = USE_API ? diaryApi.delete(date) : diaryMock.delete(date);
  notifyDiaryUpdate();
  return result;
};
