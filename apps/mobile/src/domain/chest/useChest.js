// src/domain/chest/useChest.js

import { useState, useEffect } from "react";
import { ChestService } from "./ChestService";

export function useChest() {
  const [visible, setVisible] = useState(false);
  const [objectsByEmotion, setObjectsByEmotion] = useState({});

  useEffect(() => {
    ChestService.fetchObjects().then((data) => {
      setObjectsByEmotion(data);
    });
  }, []);

  return {
    visible,
    open: () => setVisible(true),
    close: () => setVisible(false),
    objectsByEmotion,
  };
}
