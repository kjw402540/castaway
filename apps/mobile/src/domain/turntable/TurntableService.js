/**
 * 🎧 턴테이블 관련 가데이터 + 날짜별 음악 매핑
 */

const SAMPLE_AUDIO_URI = require('../../../assets/audio/sample_audio.wav');

const MOCK_AUDIO_ITEMS = [
  { id: 1, name: 'Happy Day', icon: 'sunny-outline', emotion: '기쁨', uri: SAMPLE_AUDIO_URI },
  { id: 2, name: 'Angry Beat', icon: 'mic-outline', emotion: '분노', uri: SAMPLE_AUDIO_URI },
  { id: 3, name: 'Calm Breeze', icon: 'cloud-outline', emotion: '평온', uri: SAMPLE_AUDIO_URI },
  { id: 4, name: 'Sad Melody', icon: 'rainy-outline', emotion: '슬픔', uri: SAMPLE_AUDIO_URI },
  { id: 5, name: 'Excited Jump', icon: 'rocket-outline', emotion: '신남', uri: SAMPLE_AUDIO_URI },
];

// 날짜별 음악 매핑 (id 배열)
const AUDIO_BY_DATE = {
  "2025-11-09": [2],          // Angry Beat
  "2025-11-11": [1, 3],       // Happy Day + Calm Breeze
  // 오늘 날짜는 일부러 비워둠 → "오늘은 음악이 없어요"
};

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const getAudioByDate = async (date) => {
  console.log(`TurntableService: 날짜(${date}) 음악 로딩`);
  await delay(300);

  const ids = AUDIO_BY_DATE[date];
  if (!ids) return []; // 음악 없음

  return MOCK_AUDIO_ITEMS.filter((it) => ids.includes(it.id));
};
