// apps/mobile/App.js
import { useState } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, Alert } from 'react-native';

const API = process.env.EXPO_PUBLIC_API_BASE; // 예: http://192.168.45.16:4000

export default function App() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [keywords, setKeywords] = useState('기쁨,케이크');

  const onSave = async () => {
    if (!API) {
      Alert.alert('설정 필요', 'EXPO_PUBLIC_API_BASE가 .env에 비어있어요.');
      return;
    }
    try {
      const res = await fetch(`${API}/v1/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          text,
          summary,
          keywords: keywords.split(',').map(s => s.trim())
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      Alert.alert('저장 완료', `id: ${json.id || 'ok'}`);
      setText(''); setSummary(''); setKeywords('기쁨,케이크');
    } catch (e) {
      Alert.alert('에러', String(e?.message || e));
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>Castaway Mobile (JS)</Text>
      <Text selectable>API: {API || '(미설정)'}</Text>

      <Text>일기</Text>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="오늘의 일기"
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <Text>요약 (1~3줄)</Text>
      <TextInput
        value={summary}
        onChangeText={setSummary}
        placeholder="짧은 요약"
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <Text>키워드 (쉼표로 구분)</Text>
      <TextInput
        value={keywords}
        onChangeText={setKeywords}
        placeholder="기쁨,케이크"
        style={{ borderWidth: 1, padding: 8, borderRadius: 6 }}
      />

      <View style={{ marginTop: 8 }}>
        <Button title="저장하기" onPress={onSave} />
      </View>
    </SafeAreaView>
  );
}
