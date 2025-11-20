import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "./hooks/useProfile";
import ProfileRow from "./components/ProfileRow";
import ProfileSwitch from "./components/ProfileSwitch";
import ToastModal from "../../components/ui/ToastModal";
import { Ionicons } from "@expo/vector-icons"; // 아이콘 예시 (나중에 로고로 대체)

export default function ProfilePage({ navigation }) {
  const profile = useProfile();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* 1. 헤더 (여백 축소) */}
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

        {/* 구분선 (여백 축소) */}
        <View style={styles.divider} />

        {/* 3. 계정 연동 (슬림형 버튼) */}
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
          <ProfileSwitch 
            label="Reminder" 
            value={profile.reminder} 
            onValueChange={profile.setReminder} 
          />
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
    paddingTop: 10, // 상단 여백 최소화
  },
  header: {
    marginBottom: 20, // 헤더 아래 여백 축소
  },
  headerTitle: {
    fontSize: 20, // 폰트 사이즈 살짝 조정
    fontWeight: "bold",
    color: "#111827",
  },
  divider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 15, // 구분선 위아래 여백 축소 (핵심)
  },
  sectionLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 8,
    fontWeight: "600",
  },
  // === 슬림 버튼 스타일 ===
  snsBtn: {
    flexDirection: "row", // 아이콘과 텍스트 가로 정렬
    alignItems: "center",
    backgroundColor: "white", // 배경 흰색으로 (깔끔하게)
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 8,
    paddingVertical: 10, // 높이 대폭 축소 (16 -> 10)
    paddingHorizontal: 12,
    marginBottom: 8, // 버튼 간 간격 축소
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
    fontSize: 14, // 글자 크기 살짝 줄임
  },
});