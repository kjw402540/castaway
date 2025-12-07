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

/* ----------------------------------------------------
  8. [NEW] 최근 공유받은 오브제 가져오기
  - NotificationDetailModal에서 호출
----------------------------------------------------- */
export const getLatestSharedObject = async () => {
  if (USE_API) {
    try {
      const response = await objectApi.getLatestShared();
      
      // 서버 응답 구조가 { success: true, data: { ... } } 라고 가정
      if (response && response.data) {
        const item = response.data;
        
        // 파일명을 전체 URL로 변환해서 리턴
        return {
          ...item,
          object_image: getObjectImageUrl(item.object_image_filename), 
        };
      }
      return null;
    } catch (error) {
      console.error("공유 오브제 조회 에러:", error);
      return null;
    }
  } else {
    // [Mock 모드] 테스트용 가짜 데이터 리턴
    return {
      object_image: "https://via.placeholder.com/150/0000FF/808080?Text=TestObject",
      keywords: ["테스트", "위로", "새벽"],
      description: "Mock 모드에서의 공유 오브제입니다."
    };
  }
};