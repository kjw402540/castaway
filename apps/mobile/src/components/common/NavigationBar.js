// -------------------------------------------------------
// NavigationBar.js
// 하단 NavigationBar 컴포넌트 (Mail = Notification 탭)
// -------------------------------------------------------

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, AppState } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

// 🔥 Notification DB 연동 서비스
import { getAllNotification } from "../../services/notificationService";

// -------------------------------------------------------
export default function NavigationBar() {
  const navigation = useNavigation();
  const route = useRoute();

  const [unreadCount, setUnreadCount] = useState(0);

  // -------------------------------------------------------
  // 알림 Badge 상태 갱신 함수
  // -------------------------------------------------------
  const loadBadge = async () => {
    try {
      const list = await getAllNotification();
      const unread = list.filter((n) => !n.is_read).length;
      setUnreadCount(unread);
    } catch (err) {
      console.warn("Notification load error:", err);
    }
  };

  // 최초 1회 로드
  useEffect(() => {
    loadBadge();
  }, []);

  // 🔥 탭 재진입 시 다시 불러오기 → 배지 실시간 반영
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadBadge();
    });
    return unsubscribe;
  }, [navigation]);

  // 🔥 앱 다시 켜지면 최신 알림 반영
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") loadBadge();
    });
    return () => subscription.remove();
  }, []);

  // -------------------------------------------------------
  // 탭 구성
  // -------------------------------------------------------
  const tabs = [
    {
      name: "Home",
      label: "Home",
      icon: (active) =>
        <Ionicons name="home" size={22} color={active ? "#1E3A8A" : "#6B7280"} />,
    },
    {
      name: "Diary",
      label: "Diary",
      icon: (active) =>
        <Entypo name="open-book" size={22} color={active ? "#1E3A8A" : "#6B7280"} />,
    },
    {
      name: "Object",
      label: "Object",
      icon: (active) =>
        <FontAwesome5 name="box-open" size={20} color={active ? "#1E3A8A" : "#6B7280"} />,
    },

    // Mail 탭
    {
      name: "Mail",
      label: "Mail",
      icon: (active) => (
        <View style={{ position: "relative" }}>
          <Ionicons name="notifications" size={22} color={active ? "#1E3A8A" : "#6B7280"} />

          {/* 🔥 새 알림 배지 (숫자 제거 → 빨간 점만 표시) */}
          {unreadCount > 0 && <View style={styles.badge} />}
        </View>
      ),
    },

    {
      name: "Profile",
      label: "Profile",
      icon: (active) =>
        <MaterialIcons name="person" size={24} color={active ? "#1E3A8A" : "#6B7280"} />,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = route.name === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => navigation.navigate(tab.name)}
          >
            {tab.icon(isActive)}
            <Text style={[styles.label, isActive && styles.active]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// -------------------------------------------------------
// 스타일
// -------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    height: 72,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  tabItem: {
    alignItems: "center",
    position: "relative",
    paddingHorizontal: 8,
  },
  label: {
    marginTop: 2,
    fontSize: 12,
    color: "#6B7280",
  },
  active: {
    color: "#1E3A8A",
    fontWeight: "600",
  },

  // 🔥 새 알림 배지 (숫자 제거 → 미니 빨간 점)
  badge: {
    position: "absolute",
    top: -3,
    right: -6,
    width: 8,
    height: 8,
    borderRadius: 99,
    backgroundColor: "#EF4444",
  },
});
