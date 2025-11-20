// src/services/noticeService.js
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform, Alert } from "react-native";
import Constants from 'expo-constants';

// ★★★ 알림 기능 전체를 끌 수 있는 스위치 (현재 비활성화 상태) ★★★
const IS_NOTIFICATION_ENABLED = false; 


// ------------------------------------------------
// 1. 알림 권한 요청
// ------------------------------------------------
export async function requestPermissions() {
  if (!IS_NOTIFICATION_ENABLED) {
    console.log("알림 기능 비활성화: requestPermissions 건너뜀.");
    return false;
  }

  // (기존 코드 시작)
  // ★ 추가: Expo Go인지 확인해서 미리 차단 (앱 죽음 방지)
  if (Constants.appOwnership === 'expo' && Platform.OS === 'android') {
    Alert.alert("알림 제한", "Expo Go 앱(SDK 53+)에서는 안드로이드 알림을 테스트할 수 없습니다. 실제 앱 빌드(Development Build)가 필요합니다.");
    console.log("Expo Go 환경이라 알림 기능을 건너뜁니다.");
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (!Device.isDevice) {
    console.log("에뮬레이터에서는 푸시 알림이 안 올 수 있습니다.");
    return false;
  }

  // ★ 안전장치: try-catch로 감싸기
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      // alert('알림 권한이 필요합니다!'); // 너무 자주 뜨면 귀찮으니 주석 처리
      return false;
    }
    return true;
  } catch (error) {
    console.log("알림 권한 에러(무시 가능):", error);
    return false;
  }
}

// ------------------------------------------------
// 2. 알림 예약
// ------------------------------------------------
export async function scheduleDailyReminder(date) {
  if (!IS_NOTIFICATION_ENABLED) {
    console.log("알림 기능 비활성화: scheduleDailyReminder 건너뜀.");
    return;
  }

  // (기존 코드 시작)
  try {
    await cancelReminder(); 

    const hour = date.getHours();
    const minute = date.getMinutes();

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "가지볶음 알림 🍆",
        body: "설정하신 시간입니다! 오늘도 화이팅하세요.",
        sound: true,
      },
      trigger: {
        hour: hour,
        minute: minute,
        repeats: true, 
      },
    });
    
    console.log(`알림 예약됨: 매일 ${hour}시 ${minute}분`);
  } catch (error) {
    console.log("알림 예약 실패(Expo Go 제한):", error);
  }
}

// ------------------------------------------------
// 3. 알림 취소
// ------------------------------------------------
export async function cancelReminder() {
  if (!IS_NOTIFICATION_ENABLED) {
    console.log("알림 기능 비활성화: cancelReminder 건너뜀.");
    return;
  }

  // (기존 코드 시작)
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log("알림 예약 취소됨");
  } catch (error) {
     console.log("알림 취소 실패:", error);
  }
}