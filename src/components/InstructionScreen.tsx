import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
} from 'react-native';

interface IInstructionScreenProps {
  onStart: () => void;
}

const content = {
  en: {
    label: 'EN',
    title: 'How to Play',
    subtitle: 'Slide Puzzle',
    steps: [
      { icon: '🔢', heading: 'Choose a Mode', body: 'Play with numbers or use your own photo as the puzzle image.' },
      { icon: '📐', heading: 'Choose Grid Size', body: 'Pick 3×3 (easy), 4×4 (medium), or 5×5 (hard).' },
      { icon: '👆', heading: 'Move Tiles', body: 'Tap a tile next to the empty space, or swipe it toward the gap.' },
      { icon: '💡', heading: 'Use a Hint', body: 'Stuck? Tap Hint — the best tile to move will glow amber with a directional arrow.' },
      { icon: '↩️', heading: 'Undo a Move', body: 'Made a mistake? Tap Undo to step back one move at a time.' },
      { icon: '🏆', heading: 'Win!', body: 'Arrange all tiles in order (1 → n², empty space last) to solve the puzzle.' },
    ],
    start: 'Start Game',
  },
  ko: {
    label: '한국어',
    title: '게임 방법',
    subtitle: '슬라이드 퍼즐',
    steps: [
      { icon: '🔢', heading: '모드 선택', body: '숫자 모드 또는 내 사진을 퍼즐 이미지로 사용할 수 있어요.' },
      { icon: '📐', heading: '그리드 크기 선택', body: '3×3(쉬움), 4×4(보통), 5×5(어려움) 중 선택하세요.' },
      { icon: '👆', heading: '타일 이동', body: '빈 칸 옆 타일을 탭하거나 빈 칸 방향으로 스와이프하세요.' },
      { icon: '💡', heading: '힌트 사용', body: '막혔을 때 힌트를 탭하면 최선의 이동 타일이 방향 화살표와 함께 강조돼요.' },
      { icon: '↩️', heading: '실행 취소', body: '실수했나요? 실행 취소를 탭해서 한 수씩 되돌릴 수 있어요.' },
      { icon: '🏆', heading: '클리어!', body: '모든 타일을 순서대로 (1 → n², 빈 칸 마지막) 맞추면 퍼즐 완성!' },
    ],
    start: '게임 시작',
  },
};

type Lang = 'en' | 'ko';

const InstructionScreen: React.FC<IInstructionScreenProps> = ({ onStart }) => {
  const [lang, setLang] = useState<Lang>('en');
  const t = content[lang];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Language toggle */}
        <View style={styles.langRow}>
          {(['en', 'ko'] as Lang[]).map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.langBtn, lang === l && styles.langBtnActive]}
              onPress={() => setLang(l)}
            >
              <Text style={[styles.langBtnText, lang === l && styles.langBtnTextActive]}>
                {content[l].label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../assets/icon.png')} style={styles.appIcon} />
          <Text style={styles.subtitle}>{t.subtitle}</Text>
          <Text style={styles.title}>{t.title}</Text>
        </View>

        {/* Steps */}
        <View style={styles.steps}>
          {t.steps.map((step, i) => (
            <View key={i} style={styles.stepRow}>
              <View style={styles.stepIconWrap}>
                <Text style={styles.stepIcon}>{step.icon}</Text>
              </View>
              <View style={styles.stepBody}>
                <Text style={styles.stepHeading}>{step.heading}</Text>
                <Text style={styles.stepText}>{step.body}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Start button */}
        <TouchableOpacity style={styles.startBtn} onPress={onStart} activeOpacity={0.85}>
          <Text style={styles.startBtnText}>{t.start} →</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 48,
    gap: 24,
  },
  langRow: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    padding: 3,
    gap: 4,
    marginTop: 24,
    marginBottom: 8,
  },
  langBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 6,
  },
  langBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  langBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#94a3b8',
  },
  langBtnTextActive: {
    color: '#1e293b',
    fontWeight: '700',
  },
  header: {
    alignItems: 'center',
    gap: 4,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 18,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
  },
  steps: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    gap: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  stepIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIcon: {
    fontSize: 20,
  },
  stepBody: {
    flex: 1,
    gap: 2,
  },
  stepHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },
  stepText: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 19,
  },
  startBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 24,
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
