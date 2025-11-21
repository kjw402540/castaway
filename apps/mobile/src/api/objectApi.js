// src/api/objectApi.js
import { httpClient } from "./client";

export const objectApi = {
  // 리스트 조회
  getAll: () => httpClient.get("/object"),

  // 날짜별 조회
  getByDate: (date) => httpClient.get(`/object/${date}`),

  // 오브제 상세
  getById: (id) => httpClient.get(`/object/item/${id}`),

  // 오브제 삭제 (→ 세트 삭제로 연결 예정)
  delete: (id) => httpClient.delete(`/object/item/${id}`),

  // 섬에 배치
  place: (id) => httpClient.post(`/object/place/${id}`),
};
