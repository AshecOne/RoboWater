import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ScheduleDialog, {ScheduleSettings} from '../components/ScheduleDialog';
import {DAYS, DayType} from '../constants/days';
import { wateringService } from '../services/wateringService';
import AboutModal from '../components/AboutModal';

const HomeScreen = () => {
  const [isWatering, setIsWatering] = useState(false);
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleSettings | null>(
    null,
  );
  const [manualControl, setManualControl] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);

  useEffect(() => {
    const checkSchedule = async () => {
      if (scheduleEnabled && currentSchedule && !manualControl) {
        const now = new Date();
        const currentDay = DAYS[now.getDay()];
        const currentTime = now.getTime();
  
        const today = new Date(now);
        const startTime = new Date(currentSchedule.startTime);
        const endTime = new Date(currentSchedule.endTime);
  
        const normalizedStart = new Date(today.setHours(
          startTime.getHours(),
          startTime.getMinutes(),
          0,
          0
        ));
  
        const normalizedEnd = new Date(today.setHours(
          endTime.getHours(),
          endTime.getMinutes(),
          0,
          0
        ));
  
        const shouldWater = 
          currentSchedule.days.includes(currentDay) &&
          currentTime >= normalizedStart.getTime() &&
          currentTime < normalizedEnd.getTime();
  
        // Perbaikan: Selalu update status penyiraman sesuai jadwal
        try {
          await wateringService.toggleWatering(shouldWater);
          setIsWatering(shouldWater);
        } catch (error) {
          console.error('Schedule control failed:', error);
        }
      }
    };
  
    const interval = setInterval(checkSchedule, 10000);
    checkSchedule();
  
    return () => clearInterval(interval);
  }, [scheduleEnabled, currentSchedule, manualControl]);

  const formatScheduleDays = (days: DayType[]) => {
    if (days.length === 7) {
      return 'Setiap Hari';
    }
    return [...days].sort((a: DayType, b: DayType) => 
      DAYS.indexOf(a) - DAYS.indexOf(b)
    ).join(', ');
  };

  const handleScheduleToggle = (value: boolean) => {
    setScheduleEnabled(value);
    setManualControl(false);
    if (!value) {
      wateringService.toggleWatering(false);
      setIsWatering(false);
    }
    if (value && !currentSchedule) {
      setShowScheduleDialog(true);
    }
  };

  const handleScheduleSave = (schedule: ScheduleSettings) => {
    setCurrentSchedule(schedule);
    setScheduleEnabled(true);
  };

  const handleWateringToggle = async () => {
    if (scheduleEnabled && !manualControl) {
      setManualControl(true);
    }
    
    try {
      const newState = !isWatering;
      await wateringService.toggleWatering(newState);
      setIsWatering(newState);
    } catch (error) {
      console.error('Failed to toggle watering:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      <View style={styles.header}>
  <Text style={styles.headerTitle}>RoboWater</Text>
  <TouchableOpacity onPress={() => setShowAboutModal(true)}>
    <Icon name="information" size={24} color="white" />
  </TouchableOpacity>
</View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.statusContainer}>
            <View>
              <Text style={styles.cardTitle}>Status Penyiraman</Text>
              <Text style={styles.statusText}>
                {isWatering ? 'Sedang Menyiram' : 'Tidak Aktif'}
              </Text>
              {currentSchedule && scheduleEnabled && (
                <Text style={styles.scheduleInfo}>
                  Terjadwal: {formatScheduleDays(currentSchedule.days)}
                  {'\n'}
                  {new Date(currentSchedule.startTime).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })} -{' '}
                  {new Date(currentSchedule.endTime).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              )}
            </View>
            <Icon name="water" size={40} color={isWatering ? '#3b82f6' : '#9ca3af'} />
          </View>
        </View>

        {/* Tombol kontrol */}
        <TouchableOpacity
          style={[styles.controlButton, {backgroundColor: isWatering ? '#ef4444' : '#16a34a'}]}
          onPress={handleWateringToggle}>
          <Icon name="power" size={48} color="white" />
        </TouchableOpacity>

        {/* Card jadwal */}
        <View style={styles.card}>
          <View style={styles.scheduleHeader}>
            <View style={styles.scheduleTitle}>
              <Icon name="clock-outline" size={24} color="#4b5563" />
              <Text style={styles.cardTitle}>Jadwal</Text>
            </View>
            <Switch
              value={scheduleEnabled}
              onValueChange={handleScheduleToggle}
              trackColor={{false: '#d1d5db', true: '#16a34a'}}
            />
          </View>
          {scheduleEnabled && (
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowScheduleDialog(true)}>
              <Text style={styles.editButtonText}>Edit Jadwal</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScheduleDialog
        visible={showScheduleDialog}
        onClose={() => {
          setShowScheduleDialog(false);
          if (!currentSchedule) {
            setScheduleEnabled(false);
          }
        }}
        onSave={handleScheduleSave}
        currentSchedule={currentSchedule}
      />
      <AboutModal
  visible={showAboutModal}
  onClose={() => setShowAboutModal(false)}
/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    backgroundColor: '#16a34a',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  statusText: {
    fontSize: 16,
    color: '#4b5563',
    marginTop: 4,
  },
  controlButton: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleInfo: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  editButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#4b5563',
    fontWeight: '500',
  },
});

export default HomeScreen;