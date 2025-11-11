// ESM
import { pipeline, env } from '@xenova/transformers';

// ---- 0) transformers.js 설정 (WASM) ----
env.allowLocalModels = true;
env.backends.onnx.wasm.numThreads = 1;
env.backends.onnx.wasm.simd = true;

// ---- 1) 모델 준비 (가벼운 text2text) ----
// * kanana가 onnx 가중치 미제공/미호환 이슈 있어서, 안정적인 LaMini-Flan-T5로 교체
let modelPromise = null;
let t2t = null;

async function getModel() {
  if (t2t) return t2t;
  if (!modelPromise) {
    console.log('[LLM] loading Xenova/LaMini-Flan-T5-248M ...');
    modelPromise = pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-248M');
  }
  t2t = await modelPromise;
  console.log('[LLM] ready: Xenova/LaMini-Flan-T5-248M');
  return t2t;
}

// ---- 2) JSON 안전 추출 + 백업 휴리스틱 ----
function safeParseJsonFromText(text) {
  if (!text) return null;
  // ```json ... ``` 코드펜스 제거
  const fenced = text.match(/```json([\s\S]*?)```/i);
  if (fenced) text = fenced[1];

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {}
  }
  return null;
}

function heuristicAnalyze(diary) {
  // 아주 얕은 백업 로직 (요약/감정/키워드 보장)
  const oneLine = diary.trim().replace(/\s+/g, ' ').slice(0, 120);
  // 감정 단어 매칭
  const pos = ['행복', '기쁨', '좋', '즐거', '감사', '뿌듯'];
  const neg = ['슬픔', '우울', '짜증', '화', '불안', '걱정', '후회', '미안'];
  const ang = ['화남', '분노', '열받', '빡치'];
  const txt = diary;
  let emotion = '평온';
  if (ang.some(w => txt.includes(w))) emotion = '분노';
  else if (neg.some(w => txt.includes(w))) emotion = '슬픔';
  else if (pos.some(w => txt.includes(w))) emotion = '기쁨';

  // 초간단 키워드 (불용어 제낌)
  const stop = new Set(['그리고','그래서','하지만','오늘','정말','너무','좀','거의','조금','매우','the','a','an','of','to','is','was','were','and','or']);
  const words = diary
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter(w => w && !stop.has(w));
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  const keywords = Object.entries(freq).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([w])=>w);

  return {
    summary: oneLine || '요약 불가',
    emotion,
    keywords: keywords.length ? keywords : ['일상','기록','마음']
  };
}

// ---- 3) LLM 호출 ----
async function runLLM(diaryText) {
  const pipe = await getModel();

  const prompt = `
다음 한국어 일기를 분석해서 반드시 JSON만 출력해.
형식:
{
  "summary": "<한 문장 요약>",
  "emotion": "<기쁨|슬픔|분노|평온|놀람 중 하나>",
  "keywords": ["키워드1","키워드2","키워드3"]
}

일기:
"""${diaryText}"""
`.trim();

  const out = await pipe(prompt, { max_new_tokens: 128 });
  const text = out?.[0]?.generated_text ?? '';
  // 1차: JSON 파싱 시도
  const parsed = safeParseJsonFromText(text);
  if (parsed && parsed.summary && parsed.emotion && Array.isArray(parsed.keywords)) {
    return parsed;
  }
  // 2차: 실패 시 휴리스틱
  return heuristicAnalyze(diaryText);
}

// ---- 4) 컨트롤러 ----
export const createDiary = async (req, res, next) => {
  try {
    const { text } = req.body || {};
    if (!text || typeof text !== 'string' || !text.trim()) {
      return res.status(400).json({ error: 'text 필드가 필요합니다.' });
    }

    const analysis = await runLLM(text.trim());

    // 서버는 항상 동일 스키마 반환
    return res.status(201).json({
      ok: true,
      diary: {
        id: crypto.randomUUID?.() ?? String(Date.now()),
        text: text.trim(),
        summary: analysis.summary,
        emotion: analysis.emotion,
        keywords: analysis.keywords,
        createdAt: new Date().toISOString()
      }
    });
  } catch (e) {
    next(e);
  }
};

export const getDiaries = async (_req, res, _next) => {
  res.status(200).json({ message: 'DB 조회가 비활성화되었습니다.' });
};
