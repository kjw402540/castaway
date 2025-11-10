import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Pressable } from 'react-native';

export default function ProfileScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: '700', marginBottom: 12 }}>내 정보</Text>
      <Text style={{ color: '#64748B', marginBottom: 24 }}>프로필 화면입니다. 구성은 추후 확장.</Text>
      <Pressable onPress={() => navigation.goBack()} style={{ backgroundColor: '#111827', padding: 12, borderRadius: 10 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>돌아가기</Text>
      </Pressable>
    </SafeAreaView>
  );
}
