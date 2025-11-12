import { useState } from 'react';
import {
  View, Text, TextInput, Button, Modal, Pressable, Alert,
  Keyboard, TouchableWithoutFeedback, Platform, KeyboardAvoidingView
} from 'react-native';

export default function DiarySheet({ open, onClose, apiBase, onEmotion, onVisualReady }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);



  // 테스트용 나중에 지울 것
   function extractEmotionAndKeywords(raw) {
  let emotion = '';
  let keywords = [];

  // --- 0) 코드펜스(```json ... ```) 안의 JSON만 추출 (있으면)
  try {
    const fenced = raw.match(/```json([\s\S]*?)```/i);
    if (fenced) raw = fenced[1];
  } catch {}

  // --- 1) JSON 형태 시도
  try {
    const data = JSON.parse(raw);

    // ✅ (A) 서버 스키마: { ok, diary: { emotion, keywords, ... } }
    if (data?.diary) {
      const e = data.diary.emotion;
      if (Array.isArray(e)) emotion = e.join(', ');
      else if (typeof e === 'string') emotion = e.trim();

      const k = data.diary.keywords;
      if (Array.isArray(k)) keywords = k.map(String);
      else if (typeof k === 'string') {
        keywords = k.split(/[,\s/|]+/).map(s => s.trim()).filter(Boolean);
      }
    }

    // (B) 납작(flat) 구조도 호환
    if (!emotion) {
      const e = data.emotion ?? data.result?.emotion ?? data.summary?.emotion;
      if (Array.isArray(e)) emotion = e.join(', ');
      else if (typeof e === 'string') emotion = e.trim();
    }

    if (keywords.length === 0) {
      const k = data.keyword ?? data.keywords ?? data.result?.keywords ?? data.summary?.keywords;
      if (Array.isArray(k)) keywords = k.map(String);
      else if (typeof k === 'string') {
        keywords = k.split(/[,\s/|]+/).map(s => s.trim()).filter(Boolean);
      }
    }

    // (C) summary 문자열 안에 "감정:" / "키워드:"가 섞여 있으면 추가 추출
    if ((!emotion || keywords.length === 0) && typeof data.summary === 'string') {
      const eMatch = data.summary.match(/(?:감정|emotion)\s*[:：]\s*([^\n]+)/i);
      if (eMatch && !emotion) emotion = eMatch[1].trim();

      const kMatch = data.summary.match(/(?:키워드|keywords?)\s*[:：]\s*([^\n]+)/i);
      if (kMatch && keywords.length === 0) {
        keywords = kMatch[1].split(/[,\s/|]+/).map(s => s.trim()).filter(Boolean);
      }
    }
  } catch {
    // JSON이 아니면 아래 정규식 파싱으로
  }

  // --- 2) 일반 텍스트 라인 파싱 (예: "감정: 기쁨", "키워드: 가족, 화목")
  if (!emotion) {
    const e = raw.match(/(?:감정|emotion)\s*[:：]\s*([^\n]+)/i);
    if (e) emotion = e[1].trim();
  }
  if (keywords.length === 0) {
    const k = raw.match(/(?:키워드|keywords?)\s*[:：]\s*([^\n]+)/i);
    if (k) {
      keywords = k[1].split(/[,\s/|]+/).map(s => s.trim()).filter(Boolean);
    }
  }

  return { emotion, keywords };
}



  const save = async () => {
    if (!apiBase) {
      Alert.alert('설정 필요', 'EXPO_PUBLIC_API_BASE가 .env에 비어있어요.');
      return;
    }
    if (!text.trim()) {
      Alert.alert('입력 필요', '일기 내용을 입력해 주세요.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`${apiBase}/api/v1/diaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ text })
      });

      // raw 텍스트로 받기
      const raw = await res.text();

      if (!res.ok) {
        // 서버가 에러 JSON을 보내더라도 raw 그대로 보여줌
        Alert.alert('에러', `요청 실패\nHTTP ${res.status}\n\n${raw}`);
        return;
      }

      // ✅ emotion/keyword만 추출해서 Alert
      const { emotion, keywords } = extractEmotionAndKeywords(raw);
      if (emotion || (keywords && keywords.length > 0)) {
        Alert.alert(
          '분석 결과',
          `감정: ${emotion || '—'}\n키워드: ${keywords.length ? keywords.join(', ') : '—'}`
        );
      } else {
        // 파싱이 전혀 안 되면 raw를 보여줌
        Alert.alert('서버 응답 (raw)', raw);
      }

      //onVisualReady?.(data.visual);
      onEmotion?.(emotion);
      // 성공 후 초기화
      setText('');
      onClose?.();

    } catch (e) {
      Alert.alert('에러', `AI 분석 또는 저장 중 오류가 발생했습니다.\n${String(e?.message || e)}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
        <View style={{
          backgroundColor: '#fff',
          padding: 16,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: '85%',
        }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
              behavior={Platform.select({ ios: 'padding', android: undefined })}
              style={{ flex: 1 }}
            >
              <View style={{ gap: 10, flex: 1 }}>
                <View style={{ alignItems: 'center' }}>
                  <View style={{ width: 60, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3 }} />
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700' }}>일기 작성</Text>
                  <Pressable onPress={onClose} style={{ padding: 8 }}>
                    <Text style={{ fontSize: 16 }}>접기</Text>
                  </Pressable>
                </View>

                <Text>일기</Text>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="오늘의 일기"
                  style={input}
                  multiline
                  textAlignVertical="top"
                />

                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Button title={saving ? '분석 중…' : '저장'} onPress={save} disabled={saving} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button title="취소" color="#9CA3AF" onPress={onClose} disabled={saving} />
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
}

const input = {
  borderWidth: 1,
  borderColor: '#CBD5E1',
  padding: 10,
  borderRadius: 8,
  minHeight: 160,
};
