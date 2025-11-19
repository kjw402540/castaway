import { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../ProfileService";

export function useProfile() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  const [bgm, setBgm] = useState(false);
  const [effect, setEffect] = useState(false);
  const [reminder, setReminder] = useState(false);

  const [toast, setToast] = useState({ visible: false, message: "" });

  useEffect(() => {
    async function load() {
      const data = await getProfile();
      setNickname(data.nickname);
      setEmail(data.email);
      setBgm(data.bgm);
      setEffect(data.effect);
      setReminder(data.reminder);
    }
    load();
  }, []);

  // 저장할 때만 사용하는 setter
  async function save(key, value) {
    await updateProfile(key, value);

    setToast({ visible: true, message: "변경되었습니다." });
  }

  return {
    nickname,
    setNickname,      // 입력용 (toast 없음)
    saveNickname: () => save("nickname", nickname),  // 저장용 (toast 있음)

    email,
    setEmail,
    saveEmail: () => save("email", email),

    bgm,
    setBgm: async (v) => {
      setBgm(v);
      await save("bgm", v);
    },

    effect,
    setEffect: async (v) => {
      setEffect(v);
      await save("effect", v);
    },

    reminder,
    setReminder: async (v) => {
      setReminder(v);
      await save("reminder", v);
    },

    toast,
    closeToast: () => setToast({ visible: false, message: "" }),
  };
}
