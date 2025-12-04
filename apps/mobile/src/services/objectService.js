// src/services/objectService.js
import { USE_API, BASE_URL } from "../config/apiConfig"; 
import { objectApi } from "../api/objectApi";
import { objectsMock } from "../mocks/objectsMock";

/* ----------------------------------------------------
   1. 전체 조회
----------------------------------------------------- */
export const getAllObjects = () =>
  USE_API ? objectApi.getAll() : objectsMock.getAll();

/* ----------------------------------------------------
   2. 날짜별 조회
----------------------------------------------------- */
export const getObjectsByDate = async (date) =>
  USE_API
    ? objectApi.getByDate(date)
    : (await objectsMock.getAll()).filter((obj) => obj.date === date);

/* ----------------------------------------------------
   3. 상세 조회 (getById)
----------------------------------------------------- */
export const getObjectById = (id) => 
  USE_API ? objectApi.getById(id) : objectsMock.getById(id);

/* ----------------------------------------------------
   4. 오브제 생성 (Mock용 / API는 자동생성)
----------------------------------------------------- */
export const createObject = (item) =>
  USE_API ? objectApi.place(item) : objectsMock.create(item);

/* ----------------------------------------------------
   5. [복구] 오브제 배치 (place)
   - 섬 꾸미기 기능용
----------------------------------------------------- */
export const placeObject = (id) =>
  USE_API ? objectApi.place(id) : console.log("Mock place object:", id);

/* ----------------------------------------------------
   6. 삭제
----------------------------------------------------- */
export const deleteObject = (id) =>
  USE_API ? objectApi.delete(id) : objectsMock.delete(id);

/* ----------------------------------------------------
   7. [NEW] 이미지 URL 생성 헬퍼
   - React Native <Image source={{ uri: ... }} /> 에 넣을 주소 생성
   - client.js를 안 거치므로 BASE_URL + /api 를 직접 조합
----------------------------------------------------- */
export const getObjectImageUrl = (filename) => {
  if (!filename) return null;

  if (USE_API) {
    // .env의 BASE_URL(http://...:4000) 뒤에 /api 가 없으므로 수동 추가
    return `${BASE_URL}/api/object/image?filename=${filename}`;
  } else {
    // Mock 모드일 때 (테스트용 이미지 URL 또는 null)
    return null; 
  }
};