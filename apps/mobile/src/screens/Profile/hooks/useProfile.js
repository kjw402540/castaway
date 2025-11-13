import { useState } from "react";

export function useProfile() {
  const [nickname, setNickname] = useState("가지볶음");
  const [email, setEmail] = useState("email@domain.com");

  const [bgm, setBgm] = useState(false);
  const [effect, setEffect] = useState(false);
  const [reminder, setReminder] = useState(false);

  return {
    nickname,
    setNickname,
    email,
    setEmail,
    bgm,
    setBgm,
    effect,
    setEffect,
    reminder,
    setReminder,
  };
}
