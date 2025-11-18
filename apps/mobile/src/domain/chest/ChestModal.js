// src/domain/chest/ChestModal.js

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import BaseModal from "../../components/common/BaseModal";

export default function ChestModal({ visible, onClose, diaryModal, objectsByEmotion = {} }) {

  return (
    <BaseModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>오늘의 오브제들</Text>

        {Object.entries(objectsByEmotion).map(([emotion, items]) => (
          <View key={emotion} style={styles.section}>
            <Text style={styles.sectionTitle}>{emotion}</Text>

            <View style={styles.chest}>
              <FlatList
                data={items}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id.toString()}
                decelerationRate="fast"
                snapToInterval={72}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.objectItem}
                    onPress={() => diaryModal.openFromChest(item.diaryId)}
                  >
                    {item.image ? (
                      <Image
                        source={item.image}
                        style={{ width: 50, height: 50 }}
                        resizeMode="contain"
                      />
                    ) : (
                      <Text style={styles.emoji}>{item.emoji}</Text>
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        ))}

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>닫기</Text>
        </TouchableOpacity>
      </View>
    </BaseModal>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 20 },
  section: { width: "100%", marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  chest: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  objectItem: {
    width: 60,
    height: 60,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: { fontSize: 32 },
  closeBtn: {
    marginTop: 10,
    backgroundColor: "#1E3A8A",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  closeText: { color: "white", fontSize: 15, fontWeight: "600" },
});
