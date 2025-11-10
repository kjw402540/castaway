import { Modal, View } from 'react-native';

export default function FloatingModal({ visible, children, onRequestClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onRequestClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </View>
    </Modal>
  );
}
