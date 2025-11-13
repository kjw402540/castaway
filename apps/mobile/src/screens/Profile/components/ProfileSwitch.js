import React from "react";
import { View, Text, Switch } from "react-native";

export default function ProfileSwitch({ label, value, onValueChange }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
      <Text style={{ fontWeight: "600", color: "#111827" }}>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}
