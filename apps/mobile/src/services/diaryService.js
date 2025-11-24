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
  const result = USE_API ? diaryApi.save(data) : diaryMock.save(data);
  notifyDiaryUpdate();
  return result;
};

export const deleteDiary = (date) => {
  const result = USE_API ? diaryApi.delete(date) : diaryMock.delete(date);
  notifyDiaryUpdate();
  return result;
};
