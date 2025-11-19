import React from "react";
import { ScrollView, TouchableOpacity, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfile } from "./hooks/useProfile";
import ProfileRow from "./components/ProfileRow";
import ProfileSwitch from "./components/ProfileSwitch";
import ToastModal from "../../components/ui/ToastModal";

export default function ProfilePage({ navigation }) {
  const profile = useProfile();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>

      <ScrollView contentContainerStyle={{ padding: 24 }}>

        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#111827" }}>내 정보</Text>
        </View>

        <ProfileRow
          label="닉네임"
          value={profile.nickname}
          onChangeText={profile.setNickname}        // 입력만
          onButtonPress={profile.saveNickname}      // 저장
          buttonText="수정"
        />


        <ProfileRow
          label="이메일"
          value={profile.email}
          onChangeText={profile.setEmail}
          buttonText="인증완료"
          editable={false}
        />

        <TouchableOpacity
          style={[styles.mainBtn, { backgroundColor: "#7CC9FF" }]}
          onPress={() => navigation.navigate("Report")}
        >
          <Text style={styles.mainBtnText}>주별 리포트 확인하기</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainBtn, { backgroundColor: "#007BFF" }]}
          onPress={() => console.log("오디오 보관함 클릭")}
        >
          <Text style={styles.mainBtnText}>오디오 보관함</Text>
        </TouchableOpacity>

        <View style={{ height: 1, backgroundColor: "#E5E7EB", marginVertical: 20 }} />

        <TouchableOpacity style={styles.snsBtn}>
          <Text>🔗 Google 계정 연동하기</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.snsBtn}>
          <Text>💬 Kakao 계정 연동하기</Text>
        </TouchableOpacity>

        <Text style={{ color: "#9CA3AF", textAlign: "center", fontSize: 12, marginBottom: 20 }}>
          계정 약관 | 회원 탈퇴
        </Text>

        <ProfileSwitch label="BGM" value={profile.bgm} onValueChange={profile.setBgm} />
        <ProfileSwitch label="EFFECT" value={profile.effect} onValueChange={profile.setEffect} />
        <ProfileSwitch label="Reminder" value={profile.reminder} onValueChange={profile.setReminder} />

      </ScrollView>

      {/* Toast는 ScrollView 밖에 있어야 보임 */}
      <ToastModal
        visible={profile.toast.visible}
        message={profile.toast.message}
        onClose={profile.closeToast}
      />

    </SafeAreaView>
  );
}

const styles = {
  mainBtn: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 10,
  },
  mainBtnText: {
    color: "white",
    fontWeight: "600",
  },
  snsBtn: {
    backgroundColor: "#F9FAFB",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 10,
  },
};
