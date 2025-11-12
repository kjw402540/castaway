// apps/mobile/components/weeklyreport.js
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, RefreshControl } from 'react-native';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE; // 예: http://172.31.99.32:4000

export default function WeeklyReport() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState({
    days: [
      { label: '월', summary: '아직 데이터가 없어요.' },
      { label: '화', summary: '아직 데이터가 없어요.' },
      { label: '수', summary: '아직 데이터가 없어요.' },
      { label: '목', summary: '아직 데이터가 없어요.' },
      { label: '금', summary: '아직 데이터가 없어요.' },
      { label: '토', summary: '아직 데이터가 없어요.' },
      { label: '일', summary: '아직 데이터가 없어요.' },
    ],
    advice: '이번 주 조언이 준비되는 대로 표시됩니다.',
  });

  const fetchWeekly = async () => {
    try {
      setLoading(true);
      // 실제 API가 준비되면 아래 주석 해제하고 엔드포인트 맞춰줘
      // const res = await fetch(`${API_BASE}/api/v1/reports/weekly`);
      // const data = await res.json();
      // setReport(data);

      // 데모용 딱 한 번에 확인 가능한 목업
      setReport({
        days: [
          { label: '월', summary: '업무 리듬을 되찾고 계획을 정리했어요.' },
          { label: '화', summary: '개발 환경 정비와 Expo 네트워크 설정을 해결했어요.' },
          { label: '수', summary: '일기 요약 로직을 손봤고 테스트 데이터를 준비했어요.' },
          { label: '목', summary: '컴포넌트 리팩터링과 네비게이션 구조를 점검했어요.' },
          { label: '금', summary: '가벼운 회고와 다음 주 할 일을 적어뒀어요.' },
          { label: '토', summary: '산책하며 머리를 식히고, 간단한 버그도 잡았어요.' },
          { label: '일', summary: '휴식과 정리, 그리고 작은 보상을 했어요.' },
        ],
        advice: '이번 주엔 “한 번에 다 하려는 마음”을 내려놓고, 매일 30분만 집중하는 루틴을 유지해봐요.',
      });
    } catch (e) {
      setReport((prev) => ({
        ...prev,
        advice: '네트워크 오류로 최신 리포트를 불러오지 못했어요. 연결을 확인해 주세요.',
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeekly();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchWeekly} />}
      >
        <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>주간 리포트</Text>
        <Text style={{ color: '#64748B', marginBottom: 16 }}>
          일주일 동안의 요약과 한 줄 조언을 모아 보여드립니다.
        </Text>

        <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 }}>
          {report.days.map((d, idx) => (
            <View
              key={d.label}
              style={{
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: idx === report.days.length - 1 ? 0 : 1,
                borderBottomColor: '#F3F4F6',
                backgroundColor: 'white',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '700', marginBottom: 6 }}>{d.label} 요약</Text>
              <Text style={{ color: '#374151' }}>{d.summary}</Text>
            </View>
          ))}
        </View>

        <View style={{ borderRadius: 12, padding: 16, backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB' }}>
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>이번 주의 조언</Text>
          <Text style={{ color: '#111827' }}>{report.advice}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
