import React from "react";
import { View, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

import IslandScene from "../../components/island/IslandScene";
import InputBox from "./components/InputBox";

import NotificationModal from "../../components/ui/NotificationModal";
import ChestModal from "../../domain/objectbox/ObjectBoxModal";
import TurntableModal from "../../domain/audio/TurntableModal";

import DiaryModal from "../../domain/dairy/DiaryWriteModal";
import CalendarModal from "../../domain/dairy/CalendarModal";
import DiaryViewModal from "../../domain/dairy/DiaryViewModal";

import { useDiaryModal } from "../../domain/dairy/useDiaryModal";
import { useTopModal } from "../../domain/hooks/useTopModal";

export default function MainPage() {
  const navigation = useNavigation();
  const diaryModal = useDiaryModal();
  const topModal = useTopModal();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#A7D8FF" }}>

      {/* ===== 상단 아이콘 ===== */}
      <View style={{ position: "absolute", top: 50, right: 20, flexDirection: "row", gap: 15, zIndex: 10 }}>
        <TouchableOpacity onPress={() => topModal.setNotifVisible(true)}>
          <FontAwesome name="bell" size={22} color="#1E3A8A" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
          <FontAwesome name="user" size={22} color="#1E3A8A" />
        </TouchableOpacity>
      </View>

      {/* ===== 섬 ===== */}
      <View style={{ flex: 1 }}>
        <IslandScene
          onPressChest={() => topModal.setChestVisible(true)}
          onPressTurntable={() => topModal.setTurntableVisible(true)}
        />
      </View>

      {/* ===== 입력창 ===== */}
      <InputBox
        onPressDiary={() => diaryModal.setDiaryModalVisible(true)}
        onPressBook={() => diaryModal.setCalendarVisible(true)}
      />

      {/* ===== 상단 모달 ===== */}
      <NotificationModal
        visible={topModal.isNotifVisible}
        onClose={() => topModal.setNotifVisible(false)}
      />
      <ChestModal
        visible={topModal.isChestVisible}
        onClose={() => topModal.setChestVisible(false)}
      />
      <TurntableModal
        visible={topModal.isTurntableVisible}
        onClose={() => topModal.setTurntableVisible(false)}
      />

      {/* ===== Diary 관련 모달 ===== */}
      <DiaryModal
        visible={diaryModal.isDiaryModalVisible}
        mode={diaryModal.editMode ? "edit" : "write"}
        targetDate={diaryModal.selectedDate}
        onClose={() => diaryModal.setDiaryModalVisible(false)}
        onSaved={() => {
          diaryModal.setDiaryModalVisible(false);
          diaryModal.setDiaryViewVisible(true);
        }}
      />
      <CalendarModal
        visible={diaryModal.isCalendarVisible}
        onClose={() => diaryModal.setCalendarVisible(false)}
        onSelectDate={diaryModal.handleSelectDate}
      />
      <DiaryViewModal
        visible={diaryModal.isDiaryViewVisible}
        onClose={() => diaryModal.setDiaryViewVisible(false)}
        date={diaryModal.selectedDate}
        diary={diaryModal.selectedDiary}
        object={diaryModal.selectedObject}
        onEdit={diaryModal.openEditModal}
      />

    </SafeAreaView>
  );
}
