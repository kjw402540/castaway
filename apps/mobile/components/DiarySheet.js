import { useState } from 'react';
import {
  View, Text, TextInput, Button, Modal, Pressable, Alert
} from 'react-native';

export default function DiarySheet({ open, onClose, apiBase }) {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState('기쁨,케이크');

  const save = async () => {
    if (!apiBase) {
      Alert.alert('설정 필요', 'EXPO_PUBLIC_API_BASE가 .env에 비어있어요.');
      return;
    }
    try {
      const res = await fetch(`${apiBase}/v1/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          text,
          summary,
          keywords: keywords.split(',').map((s) => s.trim())
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      Alert.alert('저장 완료', '일기가 저장되었습니다.');
      setText(''); setSummary(''); setKeywords('기쁨,케이크');
      onClose();
    } catch (e) {
      Alert.alert('에러', String(e?.message || e));
    }
  };

  return (
    <Modal visible={open} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' }}>
        <View style={{ backgroundColor: '#fff', padding: 16, borderTopLeftRadius: 16, borderTopRightRadius: 16, gap: 10, maxHeight: '85%' }}>
          {/* 끌 손잡이 */}
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 60, height: 5, backgroundColor: '#E2E8F0', borderRadius: 3 }} />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700' }}>일기 작성</Text>
            {/* 접기(전송 없이 닫기) */}
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
          />

          <Text>요약 (1~3줄)</Text>
          <TextInput
            value={summary}
            onChangeText={setSummary}
            placeholder="짧은 요약"
            style={input}
            multiline
          />

          <Text>키워드 (쉼표로 구분)</Text>
          <TextInput
            value={keywords}
            onChangeText={setKeywords}
            placeholder="기쁨,케이크"
            style={input}
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1 }}>
              <Button title="저장" onPress={save} />
            </View>
            <View style={{ flex: 1 }}>
              <Button title="취소" color="#9CA3AF" onPress={onClose} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const input = {
  borderWidth: 1, borderColor: '#CBD5E1', padding: 10, borderRadius: 8
};
