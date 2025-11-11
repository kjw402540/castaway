import { useState } from 'react';
import {
  View, Text, TextInput, Button, Modal, Pressable, Alert,
  Keyboard, TouchableWithoutFeedback, Platform, KeyboardAvoidingView
} from 'react-native';

export default function DiarySheet({ open, onClose, apiBase }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

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

      // 그냥 원문 그대로 알림
      Alert.alert('서버 응답 (raw)', raw);

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
