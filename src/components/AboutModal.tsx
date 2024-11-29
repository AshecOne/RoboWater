import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({visible, onClose}) => {
  const components = [
    'NodeMCU LOLIN V3',
    'Servo MG996R',
    'Adaptor 12V 2A',
    'LM2596 dengan Voltmeter',
    'Box Project 12.5×8.5×5cm',
    'Pin Header L Shape Male',
    'Pin Header Female',
    'Jumper Cable',
    'Terminal Block 2 Pin',
    'PCB Dot Matrix 5×7cm',
    'Bracket Servo MG996R',
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerTitle}>
              <Icon name="information-outline" size={24} color="#4b5563" />
              <Text style={styles.title}>Tentang RoboWater</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <Text style={styles.description}>
              RoboWater adalah sistem penyiraman tanaman otomatis berbasis IoT yang
              dibangun menggunakan React Native dan ESP8266. Aplikasi ini
              memungkinkan pengguna untuk mengontrol dan menjadwalkan penyiraman
              tanaman secara otomatis.
            </Text>

            <Text style={styles.sectionTitle}>Teknologi yang Digunakan</Text>
            <Text style={styles.tech}>• React Native (Frontend)</Text>
            <Text style={styles.tech}>• TypeScript</Text>
            <Text style={styles.tech}>• ESP8266 (Backend/Mikrocontroller)</Text>
            <Text style={styles.tech}>• Arduino IDE</Text>

            <Text style={styles.sectionTitle}>Komponen Elektronik</Text>
            {components.map((component, index) => (
              <Text key={index} style={styles.component}>
                • {component}
              </Text>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '60%',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 16,
    marginBottom: 8,
  },
  tech: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
  component: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 4,
  },
});

export default AboutModal;