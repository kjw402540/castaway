// screens/Profile/ProfilePage.js
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

import { useProfile } from "./hooks/useProfile";
import ProfileRow from "./components/ProfileRow";
import ProfileSwitch from "./components/ProfileSwitch";
import ToastModal from "../../components/ui/ToastModal";
import { useBackExit } from "../../hooks/useBackExit"; // ★ 추가

export default function ProfilePage({ navigation }) {
  const profile = useProfile();
  const [showTimePicker, setShowTimePicker] = useState(false);

  // 앱 종료 훅 적용
  useBackExit(); // ★ 추가

  // 시간 변경 핸들러
  const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      profile.setReminderTime(selectedDate);
    }
  };

  // 시간 포맷 (예: 오후 08:30)
  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* 1. 헤더 */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>내 정보</Text>
        </View>

        {/* 2. 기본 정보 섹션 */}
        <View>
          <ProfileRow
            label="닉네임"
            value={profile.nickname}
            onChangeText={profile.setNickname}
            onButtonPress={profile.saveNickname}
            buttonText="수정"
          />
          
          <View style={{ height: 10 }} /> 

          <ProfileRow
            label="이메일"
            value={profile.email}
            onChangeText={profile.setEmail}
            buttonText="인증완료"
            editable={false}
          />
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 3. 계정 연동 */}
        <View>
            <Text style={styles.sectionLabel}>계정 연동</Text>
            
            {/* Google Button */}
            <TouchableOpacity style={styles.snsBtn}>
                <View style={styles.iconPlaceholder} >
                    <Text style={{fontSize:12}}>G</Text> 
                </View> 
                <Text style={styles.snsText}>Google 계정 연동하기</Text>
            </TouchableOpacity>

            {/* Kakao Button */}
            <TouchableOpacity style={styles.snsBtn}>
                <View style={[styles.iconPlaceholder, {backgroundColor: '#FEE500'}]} >
                     <Text style={{fontSize:12}}>K</Text> 
                </View>
                <Text style={styles.snsText}>Kakao 계정 연동하기</Text>
            </TouchableOpacity>
        </View>

        {/* 구분선 */}
        <View style={styles.divider} />

        {/* 4. 설정 (하단) */}
        <View>
          <ProfileSwitch 
            label="BGM" 
            value={profile.bgm} 
            onValueChange={profile.setBgm} 
          />
          <ProfileSwitch 
            label="EFFECT" 
            value={profile.effect} 
            onValueChange={profile.setEffect} 
          />
          
          {/* Reminder 섹션 (시간 설정 포함) */}
          <View>
            <ProfileSwitch 
                label="Reminder" 
                value={profile.reminder} 
                onValueChange={profile.setReminder} 
            />

            {/* 스위치가 켜져있을 때만 시간 설정 버튼 표시 */}
            {profile.reminder && (
                <View style={styles.timePickerContainer}>
                <Text style={styles.timeLabel}>알림 시간</Text>
                <TouchableOpacity 
                    style={styles.timeButton} 
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text style={styles.timeText}>
                    {formatTime(profile.reminderTime)}
                    </Text>
                </TouchableOpacity>
                </View>
            )}

            {/* 시간 선택기 모달/팝업 */}
            {showTimePicker && (
                <DateTimePicker
                value={profile.reminderTime}
                mode="time"
                is24Hour={false}
                display="default"
                onChange={onChangeTime}
                />
            )}
          </View>

        </View>

      </View>

      <ToastModal
        visible={profile.toast.visible}
        message={profile.toast.message}
        onClose={profile.closeToast}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 15,
  },
  sectionLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
    fontWeight: "600",
  },
  snsBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  snsText: {
    color: "#374151",
    fontWeight: "500",
    fontSize: 14,
  },
  timePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
    paddingLeft: 10,
    paddingRight: 5,
  },
  timeLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  timeButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4B5563',
  },
});