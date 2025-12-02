// src/components/navigation/NavigationBar.js
// 하단 NavigationBar 컴포넌트
// Notification(알림함) Badge 표시 기능 포함

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

// 알림 목록 조회 API (프론트 DB Notification 처리용)
import { getAllNotification } from "../../services/notificationService";

export default function NavigationBar() {
  const navigation = useNavigation();
  const route = useRoute();

  // 읽지 않은 알림 개수 (배지 표시)
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // -------------------------------------------------------
  // Notification badge 카운트 로드
  // DB에 저장된 알림 중 is_read === false 개수만 표시
  // -------------------------------------------------------
  useEffect(() => {
    const loadBadge = async () => {
      try {
        const list = await getAllNotification();
        const unread = list.filter((n) => !n.is_read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.warn("Notification load error:", err);
      }
    };

    loadBadge();

    // ※ 훗날: AppFocus 이벤트 or 실시간 WebSocket 연동 시 loadBadge() 다시 호출
  }, []);

  // -------------------------------------------------------
  // 하단 탭 구성
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

    // DB Notification (Mail) 기능을 담당하는 탭
    // Badge: unreadCount > 0일 때 빨간 점 표시
    {
      name: "Mail",
      label: "Mail",
      icon: (active) => (
        <View style={{ position: "relative" }}>
          <Ionicons name="notifications" size={22} color={active ? "#1E3A8A" : "#6B7280"} />
          {unreadCount > 0 && (
            <View style={styles.badge} />
          )}
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
        const isActive = route.name === tab.name; // 현재 활성 탭 체크

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabItem}
            onPress={() => navigation.navigate(tab.name)} // 해당 탭 이동
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
    height: 70,
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

  // 빨간 뱃지 스타일
  badge: {
    position: "absolute",
    top: -3,
    right: -6,
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#EF4444",
  },
});
