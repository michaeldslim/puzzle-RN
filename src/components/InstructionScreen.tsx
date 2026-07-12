import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Switch,
} from 'react-native';

interface IInstructionScreenProps {
  onStart: () => void;
  musicEnabled: boolean;
  onMusicToggle: (enabled: boolean) => void;
}

const InstructionScreen: React.FC<IInstructionScreenProps> = ({
  onStart,
  musicEnabled,
  onMusicToggle,
}) => {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/icon.png')} style={styles.appIcon} />
          <Text style={styles.subtitle}>Slide Puzzle</Text>
          <Text style={styles.title}>Puzzle Game</Text>
        </View>

        {/* Background music toggle */}
        <View style={styles.musicRow}>
          <Text style={styles.musicLabel}>🎵 Background Music</Text>
          <Switch
            value={musicEnabled}
            onValueChange={onMusicToggle}
            trackColor={{ false: '#e2e8f0', true: '#93c5fd' }}
            thumbColor={musicEnabled ? '#3b82f6' : '#f8fafc'}
            ios_backgroundColor="#e2e8f0"
          />
        </View>

        {/* Start button */}
        <TouchableOpacity style={styles.startBtn} onPress={onStart} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>Start Game →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 32,
  },
  header: {
    alignItems: 'center',
    gap: 8,
  },
  appIcon: {
    width: 100,
    height: 100,
    borderRadius: 22,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1e293b',
  },
  musicRow: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  musicLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
  },
  startBtn: {
    alignSelf: 'stretch',
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  startBtnText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default InstructionScreen;
