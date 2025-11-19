import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons, Entypo, FontAwesome5, MaterialIcons } from "@expo/vector-icons";

export default function NavigationBar() {
  const navigation = useNavigation();
  const route = useRoute();

  const tabs = [
    { name: "Home", label: "Home", icon: (a) => <Ionicons name="home" size={22} color={a ? "#1E3A8A" : "#6B7280"} /> },
    { name: "Diary", label: "Diary", icon: (a) => <Entypo name="open-book" size={22} color={a ? "#1E3A8A" : "#6B7280"} /> },
    { name: "Objects", label: "Objects", icon: (a) => <FontAwesome5 name="box-open" size={20} color={a ? "#1E3A8A" : "#6B7280"} /> },
    { name: "Music", label: "Music", icon: (a) => <Ionicons name="musical-note" size={22} color={a ? "#1E3A8A" : "#6B7280"} /> },
    { name: "Profile", label: "Profile", icon: (a) => <MaterialIcons name="person" size={24} color={a ? "#1E3A8A" : "#6B7280"} /> },
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
            <Text style={[styles.label, isActive && styles.active]}>{tab.label}</Text>
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
});
