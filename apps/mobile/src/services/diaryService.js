// src/services/diaryService.js
import { USE_API } from "../config/apiConfig";
import { diaryApi } from "../api/diaryApi";
import { diaryMock } from "../mocks/diaryMock";

export const getAllDiaries = () =>
  USE_API ? diaryApi.getAll() : diaryMock.getAll();

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

export const saveDiary = (data) => {
  // 🕵️‍♂️ [CCTV] UI에서 도대체 뭘 넘겨주는지 확인해보자!
  console.log("🔍 [Service] saveDiary 호출됨. 받은 데이터:", JSON.stringify(data, null, 2));

  // 데이터 매핑 (text가 없으면 빈 문자열이라도 넣어서 에러 방지)
  const apiData = {
    ...data,
    original_text: data.original_text || data.text || "", 
  };

  console.log("📦 [Service] 서버로 보낼 최종 데이터:", JSON.stringify(apiData, null, 2));

  const result = USE_API ? diaryApi.save(apiData) : diaryMock.save(data);
  notifyDiaryUpdate();
  return result;
};

export const deleteDiary = (date) => {
  const result = USE_API ? diaryApi.delete(date) : diaryMock.delete(date);
  notifyDiaryUpdate();
  return result;
};
