import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PuzzleBoard from './src/components/PuzzleBoard';
import GameControls from './src/components/GameControls';
import { usePuzzleGame } from './src/hooks/usePuzzleGame';
import { PuzzleSize } from './types';

export default function App() {
  const {
    puzzleState,
    handleMove,
    handleShuffle,
    handleModeToggle,
    handleImageSet,
    handleSizeChange,
  } = usePuzzleGame();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.gameContainer}>
            <PuzzleBoard
              puzzleState={puzzleState}
              onMove={handleMove}
            />
            <GameControls
              currentSize={puzzleState.size as PuzzleSize}
              isComplete={puzzleState.isComplete}
              gameMode={puzzleState.gameMode}
              onSizeChange={handleSizeChange}
              onShuffle={handleShuffle}
              onModeToggle={handleModeToggle}
              onImagePick={handleImageSet}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
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