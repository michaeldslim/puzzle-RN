import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { PuzzleSize } from '../../types';
import { pickImageFromGallery, takePhoto } from '../utils/imageUtils';

interface IGameControlsProps {
  currentSize: PuzzleSize;
  isComplete: boolean;
  gameMode: 'number' | 'photo';
  canUndo: boolean;
  onSizeChange: (size: PuzzleSize) => void;
  onShuffle: () => void;
  onHint: () => void;
  onUndo: () => void;
  onModeToggle: () => void;
  onImagePick: (imageUri: string) => void;
}

const GameControls: React.FC<IGameControlsProps> = ({
  currentSize,
  isComplete,
  gameMode,
  canUndo,
  onSizeChange,
  onShuffle,
  onHint,
  onUndo,
  onModeToggle,
  onImagePick,
}) => {

  const sizes: PuzzleSize[] = [3, 4, 5];

  const handleImagePick = async () => {
    Alert.alert(
      'Select Image',
      'Choose how you want to add an image',
      [
        { text: 'Camera', onPress: async () => {
          const imageUri = await takePhoto();
          if (imageUri) onImagePick(imageUri);
        }},
        { text: 'Gallery', onPress: async () => {
          const imageUri = await pickImageFromGallery();
          if (imageUri) onImagePick(imageUri);
        }},
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  }

  return (
    <View style={styles.container}>
      {/* Game Stats */}
      {isComplete && (
        <View style={styles.completeBadge}>
          <Text style={styles.completeText}>🎉 Solved!</Text>
        </View>
      )}

      {/* Size Selection */}
      <View style={styles.sizeContainer}>
        <Text style={styles.sectionLabel}>Grid Size</Text>
        <View style={styles.sizeButtons}>
          {sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeButton,
                currentSize === size && styles.activeSizeButton,
              ]}
              onPress={() => onSizeChange(size)}
            >
              <Text
                style={[
                  styles.sizeButtonText,
                  currentSize === size && styles.activeSizeButtonText,
                ]}
              >
                {size}×{size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Game Mode Toggle */}
      <View style={styles.modeContainer}>
        <Text style={styles.sectionLabel}>Game Mode</Text>
        <View style={styles.modeButtons}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              gameMode === 'number' && styles.activeModeButton,
            ]}
            onPress={onModeToggle}
          >
            <Text
              style={[
                styles.modeButtonText,
                gameMode === 'number' && styles.activeModeButtonText,
              ]}
            >
              Numbers
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              gameMode === 'photo' && styles.activeModeButton,
            ]}
            onPress={onModeToggle}
          >
            <Text
              style={[
                styles.modeButtonText,
                gameMode === 'photo' && styles.activeModeButtonText,
              ]}
            >
              Photo
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        {gameMode === 'photo' && (
          <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
            <Text style={styles.imageButtonText}>📷 Pick Image</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.hintButton, isComplete && styles.disabledButton]}
          onPress={onHint}
          disabled={isComplete}
        >
          <Text style={[styles.hintButtonText, isComplete && styles.disabledButtonText]}>💡 Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.undoButton, !canUndo && styles.disabledButton]}
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Text style={[styles.undoButtonText, !canUndo && styles.disabledButtonText]}>↩️ Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shuffleButton} onPress={onShuffle}>
          <Text style={styles.shuffleButtonText}>🔀 Shuffle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  completeBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  completeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  sizeContainer: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  sizeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  activeSizeButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  sizeButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeSizeButtonText: {
    color: '#ffffff',
  },
  modeContainer: {
    marginBottom: 20,
  },
  modeButtons: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 4,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeModeButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  activeModeButtonText: {
    color: '#374151',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  hintButton: {
    flex: 1,
    backgroundColor: '#f59e0b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  hintButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  undoButton: {
    flex: 1,
    backgroundColor: '#64748b',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  undoButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.45,
  },
  disabledButtonText: {
    color: '#ffffff',
  },
  shuffleButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  shuffleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  imageButton: {
    flex: 1,
    backgroundColor: '#06b6d4',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameControls;
