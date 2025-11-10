// apps/mobile/screens/MainPage.js
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, Image, Pressable, Alert, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IslandScene from '../components/IslandScene';
import DiarySheet from '../components/DiarySheet';

const API = process.env.EXPO_PUBLIC_API_BASE;

// 임시 아이콘(알림/프로필)
const ICON_BELL = 'https://img.icons8.com/ios-filled/100/bell.png';
const ICON_USER = 'https://img.icons8.com/ios-filled/100/user.png';

export default function MainPage({ navigation }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#A7D8FF' }}>
        {/* 하늘 그라데이션 */}
        <LinearGradient
          colors={['#BFE6FF', '#9FD1FF']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}
        />
        {/* 바다 그라데이션 */}
        <LinearGradient
          colors={['#6EC9FF', '#4FA9F3']}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%' }}
        />

        {/* 상단 우측 아이콘 (가로 정렬 + 더 아래로) */}
        <View style={{ position: 'absolute', top: 50, right: 16, flexDirection: 'row', gap: 12, zIndex: 20 }}>
          <CircleIcon uri={ICON_BELL} onPress={() => Alert.alert('알림', '알림 센터 준비 중')} />
          <CircleIcon uri={ICON_USER} onPress={() => navigation.navigate('Profile')} />
        </View>

        {/* 섬 + 오브젝트 + 파도/구름 */}
        <IslandScene
          onPressChest={() => Alert.alert('보물상자', '보물상자 모달 열기')}
          onPressTable={() => Alert.alert('턴테이블', '턴테이블 모달 열기')}
        />

        {/* 하단 입력바(가운데 정렬) + 다이어리 버튼 */}
        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 86, alignItems: 'center', gap: 18 }}>
          <Pressable
            onPress={() => setSheetOpen(true)}
            style={{
              width: '88%',
              backgroundColor: 'white',
              borderRadius: 16,
              paddingVertical: 14,
              paddingHorizontal: 16,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              elevation: 3,
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 8
            }}
          >
            <Text style={{ color: '#6B7C93', fontSize: 16 }}>당신의 오늘 기분이 궁금해요</Text>
            <Text style={{ fontSize: 18 }}>🎤</Text>
          </Pressable>

          {/* 다이어리 버튼 — 하단에서 살짝 띄워 배치 */}
          <Pressable
            onPress={() => Alert.alert('다이어리', '다이어리 화면 준비 중')}
            style={{
              backgroundColor: 'white',
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 16,
              elevation: 3,
              shadowColor: '#000',
              shadowOpacity: 0.12,
              shadowRadius: 6
            }}
          >
            <Text style={{ fontWeight: '600' }}>📓 다이어리</Text>
          </Pressable>
        </View>

        {/* 입력 시트 (전송 없이도 닫기 가능) */}
        <DiarySheet
          open={sheetOpen}
          apiBase={API}
          onClose={() => setSheetOpen(false)}
        />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

function CircleIcon({ uri, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.92)',
        alignItems: 'center', justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 6
      }}
    >
      <Image source={{ uri }} style={{ width: 22, height: 22, resizeMode: 'contain' }} />
    </Pressable>
  );
}
