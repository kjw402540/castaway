// src/services/diaryService.js
import { USE_API } from "../config/apiConfig";
import { diaryApi } from "../api/diaryApi";
import { diaryMock } from "../mocks/diaryMock";

export const getAllDiaries = () =>
  USE_API ? diaryApi.getAll() : diaryMock.getAll();

export const getDiaryByDate = (date) =>
  USE_API ? diaryApi.getByDate(date) : diaryMock.getByDate(date);

export const saveDiary = (data) =>
  USE_API ? diaryApi.save(data) : diaryMock.save(data);

export const deleteDiary = (date) =>
  USE_API ? diaryApi.delete(date) : diaryMock.delete(date);
