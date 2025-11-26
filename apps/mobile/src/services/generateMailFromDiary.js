// src/services/generateMailFromDiary.js

export function generateMailFromDiary(text, emotion, date) {
  const emotionMessages = {
    Joy: "오늘은 정말 행복한 하루였네요! 😊",
    Sadness: "조금 힘든 하루였지만, 당신은 잘 견뎌냈어요.",
    Anger: "화가 났던 순간도 있었지만, 감정을 표현한 것은 좋은 일이에요.",
    Fear: "불안했던 하루였군요. 괜찮아요, 내일은 더 나아질 거예요.",
    Surprise: "예상치 못한 일들이 있었네요!",
    Neutral: "평온한 하루를 보내셨군요.",
    "Anger/Disgust": "불쾌한 일이 있었나 봐요. 털어내고 앞으로 나아가요.",
  };

  const header = emotionMessages[emotion] || "오늘도 기록해주셔서 감사해요.";
  const preview = text.length > 50 ? text.slice(0, 50) + "..." : text;

  return {
    id: Date.now().toString(),

    // Castaway 메일 규격
    title: `${date}의 기억`,
    message: `${header}\n\n"${preview}"`,

    emotion: emotion || "Neutral",
    object: null,

    date: new Date().toISOString(),
    read: false,
  };
}
