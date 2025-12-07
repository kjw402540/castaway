// src/services/reportService.js
import { reportApi } from "../api/reportApi";
// ⚠️ api 인스턴스 import (본인 프로젝트 경로에 맞게 확인해 주세요. 보통 ../api/api.js)
import api from "../api/reportApi"; 

// 1. 주간 리포트 가져오기 
export const getWeeklyReport = async (date = null) => {
  try {
    // ✅ [핵심 수정] 날짜(혹은 ID)가 있으면 -> 생성(generate)하지 않고 '단순 조회'로 연결
    if (date) {
      console.log(`[Service] 과거 리포트 단순 조회 요청: ${date}`);
      return await getReportById(date); // 👈 generateReport 대신 이걸 씁니다!
    }

    // 날짜가 없으면 -> 기존 로직 (최신 리포트 조회)
    console.log(`[Service] 최신 리포트 요청`);
    const response = await reportApi.getWeeklyReport();

    // Case A: 응답이 { data: { ... } } 형태
    if (response && response.data) {
      return response.data;
    }
    
    // Case B: 응답 자체가 데이터인 경우
    if (response && typeof response === 'object' && Object.keys(response).length > 0) {
      return response;
    }

    return null;

  } catch (error) {
    console.error("Weekly Report Fetch Error:", error);
    return null;
  }
};

// 2. 히스토리 리스트 가져오기 (그대로 유지)
export const getHistoryReports = async () => {
  try {
    const response = await reportApi.getHistory();
    
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

// 3. 리포트 생성 (그대로 유지하되, 여기서는 호출 안 함)
export const generateReport = async (date) => {
  try {
    const response = await reportApi.generateReport(date);
    if (response && response.data) return response.data;
    return response;
  } catch (error) {
    throw error;
  }
};

// ✅ [신규 추가] ID로 리포트 상세 조회 (AI 호출 X, 오직 DB 조회)
// 이 함수가 있어야 getWeeklyReport에서 호출할 수 있습니다.
export const getReportById = async (id) => {
  try {
    // 만약 id가 날짜 문자열이라도 백엔드 라우팅에 따라 처리되거나,
    // 앞단에서 ID를 넘겨줬다면 /api/report/:id 로 호출됩니다.
    console.log(`[Service] 📄 DB 조회 실행 (ID: ${id})`);
    
    // GET 요청만 보냄 (서버 부하 X)
    const response = await api.get(`/report/${id}`);
    
    if (response && response.data) return response.data;
    return response;
  } catch (error) {
    console.error("Report Detail Fetch Error:", error);
    return null;
  }
};