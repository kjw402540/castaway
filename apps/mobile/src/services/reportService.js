// src/services/reportService.js
import { USE_API } from "../config/apiConfig";
import { reportApi } from "../api/reportApi";

// 1. 주간 리포트 가져오기 (수정됨)
export const getWeeklyReport = async () => {
  try {
    const response = await reportApi.getWeeklyReport();
    
    console.log("🔍 [Service] API 응답 원본:", response);

    // [핵심 수정] 
    // Case A: 응답이 { data: { ... } } 형태인 경우 (일반적인 Axios 응답)
    if (response && response.data) {
      return response.data;
    }
    
    // Case B: 응답 자체가 데이터인 경우 (Interceptor가 이미 data를 꺼냈거나, fetch 결과일 때)
    // response가 객체이고 비어있지 않다면 데이터로 간주
    if (response && typeof response === 'object' && Object.keys(response).length > 0) {
      return response;
    }

    // 데이터가 진짜 없는 경우
    return null;

  } catch (error) {
    console.error("Weekly Report Fetch Error:", error);
    return null;
  }
};

// 2. 히스토리 리스트 가져오기
export const getHistoryReports = async () => {
  try {
    const response = await reportApi.getHistory();
    
    // 배열 데이터 처리 (여기서도 data 속성 체크 후, 없으면 response 자체를 반환)
    if (response && response.data && Array.isArray(response.data)) {
      return response.data;
    }
    if (Array.isArray(response)) {
      return response;
    }
    
    return [];
  } catch (error) {
    console.error("History Fetch Error:", error);
    return [];
  }
};

// 3. 리포트 생성 (필요하다면)
export const generateReport = async (date) => {
  try {
    const response = await reportApi.generateReport(date);
    
    // 생성 결과 처리
    if (response && response.data) return response.data;
    return response;
    
  } catch (error) {
    throw error;
  }
};