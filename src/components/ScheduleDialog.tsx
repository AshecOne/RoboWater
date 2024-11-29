import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {DAYS, DayType} from '../constants/days';

interface ScheduleDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (schedule: ScheduleSettings) => void;
  currentSchedule: ScheduleSettings | null;
}

export interface ScheduleSettings {
  startTime: Date;
  endTime: Date;
  days: DayType[];
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({
  visible,
  onClose,
  onSave,
  currentSchedule,
}) => {
  const [startTime, setStartTime] = useState<Date>(
    currentSchedule?.startTime || new Date(),
  );
  const [endTime, setEndTime] = useState<Date>(
    currentSchedule?.endTime || new Date(),
  );
  const [selectedDays, setSelectedDays] = useState<DayType[]>(
    currentSchedule?.days || [],
  );
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  
    const handleDayToggle = (day: DayType) => {
      if (selectedDays.includes(day)) {
        setSelectedDays(selectedDays.filter(d => d !== day));
      } else {
        setSelectedDays([...selectedDays, day]);
      }
    };
  
    const handleSave = () => {
      onSave({
        startTime,
        endTime,
        days: selectedDays,
      });
      onClose();
    };
  
    const formatTime = (date: Date) => {
      return date.toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    };
  
    return (
        <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Text style={styles.title}>Atur Jadwal Penyiraman</Text>
              <TouchableOpacity onPress={onClose}>
                <Icon name="close" size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>
  
            <ScrollView style={styles.content}>
              {/* Waktu Mulai */}
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowStartPicker(true)}>
                <Text style={styles.label}>Waktu Mulai</Text>
                <Text style={styles.timeText}>{formatTime(startTime)}</Text>
              </TouchableOpacity>
  
              {/* Waktu Selesai */}
              <TouchableOpacity
                style={styles.timePickerButton}
                onPress={() => setShowEndPicker(true)}>
                <Text style={styles.label}>Waktu Selesai</Text>
                <Text style={styles.timeText}>{formatTime(endTime)}</Text>
              </TouchableOpacity>
  
              {/* Pilihan Hari */}
              <Text style={[styles.label, {marginTop: 16}]}>Pilih Hari</Text>
              <View style={styles.daysContainer}>
                {DAYS.map(day => (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selectedDays.includes(day) && styles.dayButtonSelected,
                    ]}
                    onPress={() => handleDayToggle(day)}>
                    <Text
                      style={[
                        styles.dayText,
                        selectedDays.includes(day) && styles.dayTextSelected,
                      ]}>
                      {day.slice(0, 3)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
  
            <View style={styles.footer}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Batal</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Simpan</Text>
              </TouchableOpacity>
            </View>
  
            <DateTimePickerModal
              isVisible={showStartPicker}
              mode="time"
              onConfirm={(date) => {
                setStartTime(date);
                setShowStartPicker(false);
              }}
              onCancel={() => setShowStartPicker(false)}
              is24Hour={true}
            />
  
            <DateTimePickerModal
              isVisible={showEndPicker}
              mode="time"
              onConfirm={(date) => {
                setEndTime(date);
                setShowEndPicker(false);
              }}
              onCancel={() => setShowEndPicker(false)}
              is24Hour={true}
            />
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
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    padding: 16,
  },
  timePickerButton: {
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4b5563',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  dayButtonSelected: {
    backgroundColor: '#16a34a',
  },
  dayText: {
    color: '#4b5563',
    fontWeight: '500',
  },
  dayTextSelected: {
    color: 'white',
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#4b5563',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#16a34a',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default ScheduleDialog;