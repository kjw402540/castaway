// screens/Profile/hooks/useProfile.js
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Keyboard } from "react-native"; // 👈 [추가] 키보드 제어 모듈
import {
  getUser,
  updateUser,
  logoutUser,
  deleteUser,
} from "../../../services/userService";
import { clearAuthToken } from "../../../services/authService";

export function useProfile() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  // ... (state들은 그대로 유지)
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [bgm, setBgm] = useState(false);
  const [effect, setEffect] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState(new Date());
  const [toast, setToast] = useState({ visible: false, message: "" });

  const showToast = (msg) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: "" }), 1500);
  };
  const closeToast = () => setToast({ visible: false, message: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUser();
      //console.log(">>> 서버에서 온 내 정보:", JSON.stringify(data, null, 2));
      setNickname(data.nickname || "");
      setEmail(data.email || "");
      setBgm(data.bgm ?? false);
      setEffect(data.effect ?? false);
      setReminder(data.reminder ?? false);
      setReminderTime(
        data.reminderTime ? new Date(data.reminderTime) : new Date()
      );
    } catch (err) {
      console.log("프로필 로드 실패", err);
    } finally {
      setLoading(false);
    }
  };

  // 닉네임 저장
  const saveNickname = async () => {
    Keyboard.dismiss();
    try {
      // 👇 [수정] 서버가 돌려준 최신 정보를 받습니다 (updatedUser)
      const updatedUser = await updateUser({ nickname });
      
      // 👇 [추가] 받아온 정보로 화면을 즉시 갱신합니다!
      setNickname(updatedUser.nickname); 
      
      showToast("닉네임이 저장되었습니다.");
    } catch (err) {
      showToast("저장 실패");
    }
  };

  // 설정 저장
  const saveAllSettings = async () => {
    Keyboard.dismiss(); // 👈 [핵심] 여기도 추가
    try {
      await updateUser({
        nickname,
        bgm,
        effect,
        reminder,
        reminderTime,
      });
      showToast("저장 완료");
    } catch (err) {
      showToast("저장 실패");
    }
  };

  const logout = async () => {
    try {
      await logoutUser(); 
      await clearAuthToken(); 
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }], 
      });
    } catch (err) {
      await clearAuthToken();
      navigation.reset({ index: 0, routes: [{ name: "Login" }] });
    }
  };

  const deleteAccount = async () => {
    try {
      await deleteUser();
      await clearAuthToken();
      showToast("계정이 삭제되었습니다.");
      setTimeout(() => {
        navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
        });
      }, 1000);
    } catch (err) {
      showToast("탈퇴 처리에 실패했습니다.");
    }
  };

  return {
    loading,
    nickname,
    email,
    bgm,
    effect,
    reminder,
    reminderTime,
    setNickname,
    setEmail,
    setBgm,
    setEffect,
    setReminder,
    setReminderTime,
    saveNickname,
    saveAllSettings,
    logout,
    deleteAccount,
    toast,
    closeToast,
  };
}