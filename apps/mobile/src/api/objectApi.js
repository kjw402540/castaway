// src/api/objectApi.js
import { httpClient } from "./client";

export const objectApi = {
  // 전체 조회 (GET /object)
  getAll: () => httpClient.get("/object"),

  // 날짜별 조회 (GET /object/date/:date) 
  getByDate: (date) => httpClient.get(`/object/date/${date}`),

  // 오브제 상세 (GET /object/item/:id)
  getById: (id) => httpClient.get(`/object/item/${id}`),

  // 오브제 삭제 (DELETE /object/item/:id)
  delete: (id) => httpClient.delete(`/object/item/${id}`),

  // 섬에 배치 (POST /object/place/:id)
  place: (id) => httpClient.post(`/object/place/${id}`),

  // ✅ [NEW] 가장 최근 공유받은 오브제 조회 (GET /object/shared/latest)
  getLatestShared: () => httpClient.get("/object/shared/latest"),
};