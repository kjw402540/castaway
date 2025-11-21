// src/components/ui/ToastModal.js
import React, { useEffect } from "react";
import { Modal, View, Text, StyleSheet, Animated } from "react-native";

export default function ToastModal({ visible, message, onClose }) {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
      const timer = setTimeout(() => {
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
          onClose && onClose();
        });
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.container}>
        <Animated.View style={[styles.box, { opacity }]}>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 70,
    backgroundColor: "rgba(0,0,0,0.0)",
    zIndex: 9999,
  },
  box: {
    backgroundColor: "#111827",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 5,
  },
  text: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
});
