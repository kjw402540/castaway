import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from '@react-native-community/datetimepicker';

import { useProfile } from "./hooks/useProfile";
import ProfileRow from "./components/ProfileRow";
import ProfileSwitch from "./components/ProfileSwitch";
import ToastModal from "../../components/ui/ToastModal";
import { useBackExit } from "../../hooks/useBackExit";
import { useSound } from "../../context/SoundContext";

export default function ProfilePage({ navigation }) {
  const profile = useProfile();
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { bgmEnabled, setBgmEnabled } = useSound();


  useBackExit();

  const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false);
    if (selectedDate) {
      profile.setReminderTime(selectedDate);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  // 로그아웃 핸들러
  const handleLogoutPress = () => {
    Alert.alert(
      "로그아웃",
      "정말 로그아웃 하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "로그아웃",
          style: "destructive",
          onPress: () => profile.logout()
        },
      ]
    );
  };

  // 회원탈퇴 핸들러
  const handleDeletePress = () => {
    Alert.alert(
      "회원 탈퇴",
      "탈퇴 시 모든 데이터가 삭제됩니다.\n정말 탈퇴하시겠습니까?",
      [
        { text: "취소", style: "cancel" },
        {
          text: "탈퇴하기",
          style: "destructive",
          onPress: () => profile.deleteAccount()
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* 👇 수정됨: showsVerticalScrollIndicator={false} 추가 */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

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
              <Text style={{ fontSize: 12 }}>G</Text>
            </View>
            <Text style={styles.snsText}>Google 계정 연동하기</Text>
          </TouchableOpacity>

          {/* Kakao Button */}
          <TouchableOpacity style={styles.snsBtn}>
            <View style={[styles.iconPlaceholder, { backgroundColor: '#FEE500' }]} >
              <Text style={{ fontSize: 12 }}>K</Text>
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
            value={bgmEnabled}
            onValueChange={(value) => {
              setBgmEnabled(value); // 재생/정지
              profile.setBgm(value); // 서버 값도 함께 반영
            }}
          />

          <ProfileSwitch
            label="EFFECT"
            value={profile.effect}
            onValueChange={profile.setEffect}
          />

          <View>
            <ProfileSwitch
              label="Reminder"
              value={profile.reminder}
              onValueChange={profile.setReminder}
            />
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

        {/* 5. 계정 관리 (로그아웃 / 회원탈퇴) */}
        <View style={styles.footerContainer}>
          <TouchableOpacity onPress={handleLogoutPress} style={styles.footerButton}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>

          <View style={styles.verticalDivider} />

          <TouchableOpacity onPress={handleDeletePress} style={styles.footerButton}>
            <Text style={styles.deleteText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

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
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 10,
    // 👇 수정됨: 스크롤 영역 하단 여백을 늘려서 '로그아웃/회원탈퇴'가 위로 올라오도록 함
    paddingBottom: 200,
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  footerButton: {
    padding: 10,
  },
  verticalDivider: {
    width: 1,
    height: 14,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 15,
  },
  logoutText: {
    fontSize: 13,
    color: '#6B7280',
    textDecorationLine: 'underline',
  },
  deleteText: {
    fontSize: 13,
    color: '#EF4444',
    textDecorationLine: 'underline',
  },
});