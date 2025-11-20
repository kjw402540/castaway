// screens/Profile/hooks/useProfile.js
import { useEffect, useState } from "react";
import {
  getUser,
  updateUser,
  logoutUser,
  deleteUser,
} from "../../../services/userService";

export function useProfile() {
  const [loading, setLoading] = useState(true);

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

  // 프로필 불러오기
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getUser();

      setNickname(data.nickname || "");
      setEmail(data.email || "");

      setBgm(data.bgm ?? false);
      setEffect(data.effect ?? false);

      setReminder(data.reminder ?? false);
      setReminderTime(
        data.reminderTime ? new Date(data.reminderTime) : new Date()
      );

      setLoading(false);
    } catch (err) {
      console.log("프로필 로드 실패", err);
      setLoading(false);
    }
  };

  // 닉네임 저장
  const saveNickname = async () => {
    await updateUser({ nickname });
    showToast("닉네임이 저장되었습니다.");
  };

  // 모든 설정 저장 (원하면 한 번에 저장 가능)
  const saveAllSettings = async () => {
    await updateUser({
      nickname,
      bgm,
      effect,
      reminder,
      reminderTime,
    });
    showToast("저장 완료");
  };

  // 로그아웃
  const logout = async () => {
    await logoutUser();
    showToast("로그아웃되었습니다");
  };

  // 회원 탈퇴
  const removeAccount = async () => {
    await deleteUser();
    showToast("계정이 삭제되었습니다");
  };

  return {
    loading,
    nickname,
    email,
    bgm,
    effect,
    reminder,
    reminderTime,

    // setters
    setNickname,
    setEmail,
    setBgm,
    setEffect,
    setReminder,
    setReminderTime,

    // actions
    saveNickname,
    saveAllSettings,
    logout,
    removeAccount,

    // toast
    toast,
    closeToast,
  };
}
