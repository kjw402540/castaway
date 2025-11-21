import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Audio } from "expo-av";

export default function TurntableModal({ visible, item, onClose }) {
  const [sound, setSound] = useState(null);

  useEffect(() => {
    if (visible && item?.audioUri) {
      loadSound();
    }
    return () => sound && sound.unloadAsync();
  }, [visible]);

  const loadSound = async () => {
    const { sound: s } = await Audio.Sound.createAsync({ uri: item.audioUri });
    setSound(s);
    await s.playAsync();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>Now Playing</Text>

          <Text style={styles.emoji}>{item.emoji}</Text>

          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={{ fontSize: 16 }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  box: {
    width: "75%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
  emoji: { fontSize: 40, marginBottom: 20 },
  close: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 10,
  },
});
