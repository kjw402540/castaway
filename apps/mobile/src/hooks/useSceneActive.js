// src/hooks/useSceneActive.js
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { runOnJS, cancelAnimation } from "react-native-reanimated";

export default function useSceneActive(sharedValues = []) {
  const isFocused = useIsFocused();

  useEffect(() => {
    sharedValues.forEach((v) => {
      if (!v) return;
      if (!isFocused) {
        // Pause
        cancelAnimation(v);
      } else {
        // Resume by re-triggering motion
        if (typeof v.resume === "function") {
          runOnJS(v.resume)();
        }
      }
    });
  }, [isFocused]);
}
