import { useState } from "react";

export function useTopModal() {
  const [isNotifVisible, setNotifVisible] = useState(false);
  const [isChestVisible, setChestVisible] = useState(false);
  const [isTurntableVisible, setTurntableVisible] = useState(false);

  return {
    isNotifVisible,
    setNotifVisible,
    isChestVisible,
    setChestVisible,
    isTurntableVisible,
    setTurntableVisible,
  };
}
