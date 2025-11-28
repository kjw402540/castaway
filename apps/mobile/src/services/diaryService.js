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
        if (diary.created_date && diary.flag === 1) { // flag=1(활성) 체크
          const dateKey = diary.created_date.split("T")[0];
          
          map[dateKey] = {
            ...diary,
            text: diary.original_text, // 화면에서는 .text를 쓰므로 매핑
          };
        }
      });
      
      return map;
    } catch (err) {
      console.error("일기 목록 불러오기 실패:", err);
      return {};
    }
  } else {
    // Mock 데이터는 이미 Map 형태라고 가정
    return diaryMock.getAll();
  }
};

export const getDiaryByDate = (date) =>
  USE_API ? diaryApi.getByDate(date) : diaryMock.getByDate(date);

// ---- 전역 업데이트 이벤트 ----
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
    original_text: data.original_text || data.text || "", 
    // flag는 서버 default가 1이거나 서비스에서 처리하므로 생략 가능
  };

  const result = USE_API ? await diaryApi.save(apiData) : await diaryMock.save(data);
  notifyDiaryUpdate();
  return result;
};

export const deleteDiary = async (date) => {
  const result = USE_API ? await diaryApi.delete(date) : await diaryMock.delete(date);
  notifyDiaryUpdate();
  return result;
};