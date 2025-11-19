import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

export default function PageTitle({ icon, title }) {
  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={26} color="#1E3A8A" />
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "center",
    gap: 10,
    marginTop: 40,
    marginBottom: 50,
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E3A8A",
  },
});
