import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../ProfileService";

export function useProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [bgm, setBgm] = useState(false);
  const [effect, setEffect] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "" });

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await getProfile();
      
      setNickname(data.nickname || "");
      setEmail(data.email || "");
      setBgm(!!data.bgm);
      setEffect(!!data.effect);
      setReminder(!!data.reminder);
      
      setIsLoading(false);
    }
    load();
  }, []);

  // 통합 저장 함수
  async function save(key, value) {
    const success = await updateProfile(key, value);
    if (success) {
      setToast({ visible: true, message: "변경되었습니다." });
    } else {
      setToast({ visible: true, message: "저장에 실패했습니다." });
    }
  }

  return {
    isLoading,
    
    nickname, 
    setNickname, 
    saveNickname: () => save("nickname", nickname),

    email, 
    setEmail, 
    saveEmail: () => save("email", email),

    bgm, 
    setBgm: async (v) => { setBgm(v); await save("bgm", v); },

    effect, 
    setEffect: async (v) => { setEffect(v); await save("effect", v); },

    reminder, 
    setReminder: async (v) => { setReminder(v); await save("reminder", v); },

    toast,
    closeToast: () => setToast({ visible: false, message: "" }),
  };
}