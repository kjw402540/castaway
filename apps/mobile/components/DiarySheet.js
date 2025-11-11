// apps/mobile/components/DiarySheet.js

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
      const res = await fetch(`${apiBase}/v1/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          text,
          // ▼ 백엔드가 아직 필드를 요구한다면 임시로 포함
          // summary: null,
          // keywords: []
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      Alert.alert('저장 완료', '일기가 저장되었습니다.');
      setText('');
      onClose();
    } catch (e) {
      Alert.alert('에러', String(e?.message || e));
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
                {/* 끌 손잡이 */}
                <View style={{ alignItems: 'center' }}>
                  <View style={{ width: 60, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3 }} />
                </View>

                {/* 헤더 */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700' }}>일기 작성</Text>
                  <Pressable onPress={onClose} style={{ padding: 8 }}>
                    <Text style={{ fontSize: 16 }}>접기</Text>
                  </Pressable>
                </View>

                {/* 일기 입력만 남김 */}
                <Text>일기</Text>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="오늘의 일기"
                  style={input}
                  multiline
                  textAlignVertical="top"
                />

                {/* 버튼 */}
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Button title={saving ? '저장 중…' : '저장'} onPress={save} disabled={saving} />
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
  minHeight: 160, // 작성 영역 좀 넉넉하게
};
