// services/workflows/diaryWorkflow.js
import * as diaryService from "../diaryService.js";
import * as emotionService from "../emotionService.js";
import * as objectsService from "../objectsService.js";
import * as bgmService from "../bgmService.js";
import * as clusterService from "../clusterService.js";
import * as reportService from "../reportService.js";

export async function handleDiary({ user_id, text, input_type, flag, embedding }) {
  // 1) 일기 저장
  const diary = await diaryService.createDiary({
    user_id,
    text,
    input_type,
    flag,
    embedding,
  });

  // 2) 감정 분석
  const analysis = await emotionService.analyze(text);

  // 3) 오브제 자동 생성
  const object = await objectsService.createFromEmotion(
    user_id,
    diary.date,
    analysis.emotion
  );

  // 4) BGM 자동 생성
  const bgm = await bgmService.createFromEmotion(
    user_id,
    diary.diary_id,
    analysis.emotion
  );

  // 5) 클러스터 업데이트
  const cluster = await clusterService.updateUserCluster(
    user_id,
    analysis.emotion
  );

  // 6) 리포트 갱신
  const report = await reportService.updateWeekly(
    user_id,
    analysis.emotion
  );

  return { diary, analysis, object, bgm, cluster, report };
}
