import { View, Text, Pressable } from 'react-native';

export default function DiaryModalContent({ onClose }) {
  return (
    <View style={{ width: '86%', borderRadius: 16, backgroundColor: 'white', padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>다이어리</Text>
      <Text style={{ color: '#475569', marginBottom: 16 }}>다이어리 컨텐츠</Text>
      <Pressable
        onPress={onClose}
        style={{ alignSelf: 'flex-end', backgroundColor: '#e2e8f0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8 }}
      >
        <Text>닫기</Text>
      </Pressable>
    </View>
  );
}