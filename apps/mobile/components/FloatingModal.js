import { Modal, View, Pressable } from 'react-native';

export default function FloatingModal({ visible, children, onRequestClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }}>
        <Pressable
          onPress={onRequestClose}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />
        {children}
      </View>
    </Modal>
  );
}
