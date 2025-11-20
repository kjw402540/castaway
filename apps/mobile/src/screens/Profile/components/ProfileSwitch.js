import React from "react";
import { View, Text, Switch } from "react-native";

export default function ProfileSwitch({ label, value, onValueChange }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
      <Text style={{ fontWeight: "600", color: "#374151", fontSize: 15 }}>{label}</Text>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        trackColor={{ false: "#E5E7EB", true: "#3B82F6" }}
        thumbColor={"#fff"}
      />
    </View>
  );
}