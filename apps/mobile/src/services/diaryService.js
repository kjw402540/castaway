import { USE_API } from "../config/apiConfig";
import { diaryApi } from "../api/diaryApi";
import { diaryMock } from "../mocks/diaryMock";

// ✅ [Helper] UTC 문자열을 로컬 시간(KST) YYYY-MM-DD로 변환
const toLocalYMD = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getAllDiaries = async () => {
  if (USE_API) {
    try {
      const list = await diaryApi.getAll();
      if (!Array.isArray(list)) return {};

      const map = {};
      list.forEach((diary) => {
        // flag 체크는 기존대로 유지
        if (diary.created_date && diary.flag === 1) {
          
          // ❌ 기존: const dateKey = diary.created_date.split("T")[0]; 
          // ⭕ 수정: 로컬 시간 기준으로 날짜 키 생성
          const dateKey = toLocalYMD(diary.created_date);

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

// ... 나머지 코드는 그대로 두면 됨 ...
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