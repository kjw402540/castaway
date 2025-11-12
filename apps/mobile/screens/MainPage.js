// apps/mobile/screens/MainPage.js
import { useState } from 'react';
import { useWindowDimensions} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  View, Text, Image, Pressable, Alert, Keyboard, TouchableWithoutFeedback
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import IslandScene from '../components/IslandScene';
import DiarySheet from '../components/DiarySheet';
import FloatingModal from '../components/FloatingModal';
import ChestModalContent from '../components/ChestModalContent';
import TableModalContent from '../components/TurntableModalContent';
import DiaryModalContent from '../components/DiaryModalContent';
import { defaultTheme, normalizeThemeInput, mergeTheme } from '../components/IslandTheme';


const API = process.env.EXPO_PUBLIC_API_BASE;

// 임시 아이콘(알림/프로필)
const ICON_BELL = 'https://img.icons8.com/ios-filled/100/bell.png';
const ICON_USER = 'https://img.icons8.com/ios-filled/100/user.png';

const ISLAND_DESIGN_WIDTH = 300;

export default function MainPage({ navigation }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const [chestOpen, setChestOpen] = useState(false);
  const [tableOpen, setTableOpen] = useState(false);
  const [diaryOpen, setDiaryOpen] = useState(false);
  const [theme, setTheme] = useState(defaultTheme); // ⬅️ 추가

  

  const { width: screenWidth } = useWindowDimensions();
  const islandScale = screenWidth / ISLAND_DESIGN_WIDTH;

    // 테스트용 (기쁨/슬픔에 확실한 대비)
  function emotionToThemePatch(emotion) {
    const e = (emotion || '').trim();
    console.log('[emotionToThemePatch]', e);

    switch (e) {
      case '기쁨':
        // 밝은 하늘 + 선명한 바다
        return {
          sky:  { top: '#FFE08A', bottom: '#FFD3A5', cloudColor: '#FFFFFF', cloudSpeed: 1.3 },
          sea:  { top: '#7FD8FF', bottom: '#4FB8F3', waveAmplitude: 12, waveSpeed: 1.2 },
          palm: { leafColor: '#22C55E', sway: 12, size: 1.05 },
        };
      case '슬픔':
        // 어두운 회청색 하늘 + 탁한 바다
        return {
          sky:  { top: '#5B6B7A', bottom: '#2F3A46', cloudColor: '#E5E7EB', cloudSpeed: 0.5 },
          sea:  { top: '#4D6D7A', bottom: '#1F2D3A', waveAmplitude: 5,  waveSpeed: 0.8 },
          palm: { leafColor: '#4B5563', sway: 5,  size: 0.98 },
        };
      default:
        return {};
    }
  }

  function handleEmotion(emotion) {
    const patch = emotionToThemePatch(emotion);
    console.log('[handleEmotion] patch =', patch);

    // patch에 sky/sea/palm 중 하나라도 있으면 병합
    if (patch && (patch.sky || patch.sea || patch.palm)) {
      setTheme(prev => mergeTheme(prev, patch));
    }
  }

  const handleDiaryDone = (aiVisualJson) => {
    // aiVisualJson 예) { SKYCOLOR_TOP:"#D8ECFF", CLOUD_SPEED: 1.2, WAVE_SIZE: 12, PALM_SWAY: 14, ... }
    const patch = normalizeThemeInput(aiVisualJson);
    setTheme(prev => mergeTheme(prev, patch));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#A7D8FF' }}>
        {/* 하늘 그라데이션 */}
        <LinearGradient
          colors={[theme.sky.top, theme.sky.bottom]}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}
        />
        {/* 바다 그라데이션 */}
        <LinearGradient
          colors={[theme.sea.top, theme.sea.bottom]}
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%' }}
        />

        {/* 상단 우측 아이콘 (가로 정렬 + 더 아래로) */}
        <View style={{ position: 'absolute', top: 50, right: 16, flexDirection: 'row', gap: 12, zIndex: 20 }}>
          <CircleIcon uri={ICON_BELL} onPress={() => Alert.alert('알림', '알림 센터 준비 중')} />
          <CircleIcon uri={ICON_USER} onPress={() => navigation.navigate('Profile')} />
        </View>

        {/* 섬 + 오브젝트 + 파도/구름 */}
        <IslandScene
          scale={islandScale}
          theme={theme}
          onPressChest={() => setChestOpen(true)}
          onPressTable={() => setTableOpen(true)}
        />
        <FloatingModal visible={chestOpen} onRequestClose={() => setChestOpen(false)}>
          <ChestModalContent onClose={() => setChestOpen(false)} />
        </FloatingModal>

        <FloatingModal visible={tableOpen} onRequestClose={() => setTableOpen(false)}>
          <TableModalContent onClose={() => setTableOpen(false)} />
        </FloatingModal>

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
            onPress={() => setDiaryOpen(true)}
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

           <FloatingModal visible={diaryOpen} onRequestClose={() => setDiaryOpen(false)}>
            <DiaryModalContent onClose={() => setDiaryOpen(false)} />
          </FloatingModal>
           
        </View>

        {/* 입력 시트 (전송 없이도 닫기 가능) */}
        <DiarySheet
          open={sheetOpen}
          apiBase={API}
          onClose={() => setSheetOpen(false)}
          onEmotion={handleEmotion}
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



