import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Audio } from 'expo-av';
import PuzzleBoard from './src/components/PuzzleBoard';
import GameControls from './src/components/GameControls';
import InstructionScreen from './src/components/InstructionScreen';
import Fireworks from './src/components/Fireworks';
import { usePuzzleGame } from './src/hooks/usePuzzleGame';
import { PuzzleSize } from './types';

export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);
  const prevIsComplete = useRef(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const {
    puzzleState,
    handleMove,
    handleUndo,
    canUndo,
    handleHint,
    handleShuffle,
    handleModeToggle,
    handleImageSet,
    handleSizeChange,
  } = usePuzzleGame();

  useEffect(() => {
    if (puzzleState.isComplete && !prevIsComplete.current) {
      setShowFireworks(true);
    }
    prevIsComplete.current = puzzleState.isComplete;
  }, [puzzleState.isComplete]);

  useEffect(() => {
    let mounted = true;

    const loadAndPlay = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: false,
        });

        const { sound } = await Audio.Sound.createAsync(
          require('./assets/sounds/bm.mp3'),
          { shouldPlay: true, isLooping: true, volume: 0.2 }
        );

        if (mounted) soundRef.current = sound;
      } catch (e) {
        console.warn('Failed to load or play background music', e);
      }
    };

    if (gameStarted) {
      loadAndPlay();
    }

    return () => {
      mounted = false;
      const cleanup = async () => {
        if (soundRef.current) {
          try {
            await soundRef.current.stopAsync();
            await soundRef.current.unloadAsync();
          } catch (e) {
            // ignore cleanup errors
          }
          soundRef.current = null;
        }
      };
      void cleanup();
    };
  }, [gameStarted]);

  if (!gameStarted) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="dark" />
        <InstructionScreen onStart={() => setGameStarted(true)} />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.gameContainer}>
            <PuzzleBoard
              puzzleState={puzzleState}
              onMove={handleMove}
              hintIndex={puzzleState.hintIndex}
              hintSequence={puzzleState.hintSequence}
            />
            <GameControls
              currentSize={puzzleState.size as PuzzleSize}
              isComplete={puzzleState.isComplete}
              gameMode={puzzleState.gameMode}
              canUndo={canUndo}
              imageUri={puzzleState.imageUri}
              onSizeChange={handleSizeChange}
              onShuffle={handleShuffle}
              onHint={handleHint}
              onUndo={handleUndo}
              onModeToggle={handleModeToggle}
              onImagePick={handleImageSet}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
      {showFireworks && (
        <Fireworks onDone={() => setShowFireworks(false)} />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 20,
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 60,
  },
});