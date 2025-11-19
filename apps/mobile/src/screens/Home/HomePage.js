import React, { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import IslandScene from "../../components/island/IslandScene";
import InputBox from "./components/InputBox";
import DiaryWriteModal from "../Diary/DiaryWriteModal";

export default function HomePage() {
  const today = new Date().toISOString().split("T")[0];

  const [writeVisible, setWriteVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#A7D8FF" }}>

      {/* 섬 */}
      <View style={{ flex: 1 }}>
        <IslandScene />
      </View>

      {/* 입력창 → 오늘 날짜로 작성 모달 */}
      <InputBox
        onPressDiary={() => setWriteVisible(true)}
      />

      {/* 일기 작성 모달 */}
      <DiaryWriteModal
        visible={writeVisible}
        mode="write"
        targetDate={today}
        defaultText=""
        defaultObject={null}
        onClose={() => setWriteVisible(false)}
        onSaved={() => setWriteVisible(false)}
      />

    </SafeAreaView>
  );
}
