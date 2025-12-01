// =============================================================
// File: src/components/common/NavigationBar.js
// Purpose: Notification 기반 Mail Badge 업데이트 (rename 반영)
// =============================================================

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

import { 
  fetchMailList, 
  subscribeNotificationUpdate 
} from "../../services/notificationService";

export default function NavigationBar() {
  const navigation = useNavigation();
  const route = useRoute();

  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // 뱃지 로딩
  useEffect(() => {
    const loadBadge = async () => {
      setLoading(true);
      const mails = await fetchMailList(); // mail → notification 기반 데이터
      const unread = mails.filter((m) => !m.read).length;
      setUnreadCount(unread);
      setLoading(false);
    };

    loadBadge();
    const unsubscribe = subscribeNotificationUpdate(loadBadge);
    return () => unsubscribe();
  }, []);

  const showBadge = !loading && unreadCount > 0;

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
    {
      name: "Mail",
      label: "Mail",
      icon: (active) => (
        <View style={{ position: "relative" }}>
          <Ionicons name="mail" size={22} color={active ? "#1E3A8A" : "#6B7280"} />
          {showBadge && <View style={styles.badge} />}
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
