// apps/mobile/screens/ProfileScreen.js
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Pressable } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor: 'white' }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>내 정보</Text>
      <Text style={{ color: '#64748B', marginBottom: 16 }}>프로필 화면입니다. 구성은 추후 확장.</Text>

      {/* 리스트 영역 */}
      <View style={{ borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 24 }}>
        <Pressable
          onPress={() => navigation.navigate('WeeklyReport')}
          android_ripple={{ color: '#E5E7EB' }}
          style={{ paddingVertical: 14, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
        >
          <Text style={{ fontSize: 16, fontWeight: '600' }}>주간 리포트</Text>
          <Text style={{ color: '#9CA3AF' }}>{'>'}</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => navigation.goBack()}
        style={{ backgroundColor: '#111827', padding: 12, borderRadius: 10 }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>돌아가기</Text>
      </Pressable>
    </SafeAreaView>
  );
}
