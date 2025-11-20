// src/screens/Objects/ObjectsPage.js

import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import OptionMenu from "../../components/common/OptionMenu";
import ConfirmModal from "../../components/common/ConfirmModal";
import ObjectDetailModal from "./ObjectDetailModal";

import DiaryViewModal from "../Diary/DiaryViewModal";
import { getDiaryByDate } from "../Diary/DiaryService";

import { getAllObjects, deleteObject } from "./ObjectsService";

const screenWidth = Dimensions.get("window").width;

const EMOTION_LABELS = {
  joy: "Joy",
  sadness: "Sadness",
  neutral: "Neutral",
  anger: "Anger",
  fear: "Fear",
};

export default function ObjectsPage() {
  const [objects, setObjects] = useState([]);

  const [selected, setSelected] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });
  const [confirmVisible, setConfirmVisible] = useState(false);

  // detail modal
  const [detailVisible, setDetailVisible] = useState(false);

  // diary view modal
  const [diaryVisible, setDiaryVisible] = useState(false);

  const cardRefs = useRef({});

  useEffect(() => {
    const fetchObjects = async () => {
      const data = await getAllObjects();
      setObjects(data);
    };
    fetchObjects();
  }, []);

  const grouped = useMemo(() => {
    const m = {};
    objects.forEach((o) => {
      if (!m[o.emotion]) m[o.emotion] = [];
      m[o.emotion].push(o);
    });
    return m;
  }, [objects]);

  // 카드 메뉴 열기
  const openMenu = (obj) => {
    const ref = cardRefs.current[obj.id];
    if (!ref) return;

    ref.measureInWindow((x, y, width, height) => {
      let menuX = x + width / 2 - 90;
      let menuY = y + height / 2 - 10;

      menuX = Math.max(10, Math.min(menuX, screenWidth - 180));

      setMenuPos({ x: menuX, y: menuY });
      setSelected(obj);
      setMenuVisible(true);
    });
  };

  const closeMenu = () => setMenuVisible(false);

  // Detail Modal 열기
  const openDetail = (obj) => {
    setSelected(obj);
    setDetailVisible(true);
  };

  // 일기 보기
  const handleOpenDiary = async () => {
    const diary = await getDiaryByDate(selected.acquiredAt);
    if (!diary) {
      alert("해당 날짜에 작성된 일기가 없어요.");
      return;
    }

    setDiaryVisible(true);
  };

  const handlePlace = () => {
    console.log("섬 배치:", selected.id);
  };

  const requestDelete = () => {
    setConfirmVisible(true);
  };

  const handleDelete = async () => {
    await deleteObject(selected.id);

    const updated = await getAllObjects();
    setObjects(updated);

    setConfirmVisible(false);
    setDetailVisible(false);
  };

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <Text style={styles.sectionTitle}>보관함</Text>

          {Object.entries(grouped).map(([emotion, list]) => (
            <View key={emotion} style={styles.emotionBox}>
              <View style={styles.emotionHeader}>
                <Text style={styles.emotionTitle}>{EMOTION_LABELS[emotion]}</Text>
                <Text style={styles.emotionCount}>{list.length}</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalList}
              >
                {list.map((o) => (
                  <TouchableOpacity
                    key={o.id}
                    ref={(r) => (cardRefs.current[o.id] = r)}
                    style={styles.objCard}
                    onPress={() => openDetail(o)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.objIcon}>{o.icon}</Text>
                    <Text style={styles.objDate}>{o.acquiredAt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* 상세보기 모달 */}
      <ObjectDetailModal
        visible={detailVisible}
        object={selected}
        onClose={() => setDetailVisible(false)}
        onOpenDiary={handleOpenDiary}
        onPlace={handlePlace}
        onDeleteRequest={requestDelete}
      />

      {/* 삭제 확인 */}
      <ConfirmModal
        visible={confirmVisible}
        title="오브제를 삭제하면 해당 일기도 함께 삭제돼요."
        description="정말 삭제할까요?"
        confirmText="삭제하기"
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleDelete}
      />

      {/* 일기 보기 */}
      <DiaryViewModal
        visible={diaryVisible}
        dateString={selected?.acquiredAt}
        onClose={() => setDiaryVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#A7D8FF" },

  scroll: { paddingHorizontal: 20 },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 20,
    marginBottom: 20,
  },

  emotionBox: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 14,
    marginBottom: 28,
  },

  emotionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  emotionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  emotionCount: {
    marginLeft: 6,
    fontSize: 11,
    color: "#6B7280",
  },

  horizontalList: {
    paddingRight: 10,
    gap: 12,
    flexDirection: "row",
  },

  objCard: {
    width: 120,
    height: 145,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  objIcon: { fontSize: 34 },

  objDate: {
    marginTop: 4,
    fontSize: 10,
    color: "#6B7280",
  },
});
