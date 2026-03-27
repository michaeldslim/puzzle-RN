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
      {/* Win banner */}
      {isComplete && (
        <TouchableOpacity style={styles.completeBadge} onPress={onShuffle} activeOpacity={0.8}>
          <Text style={styles.completeText}>🎉 Puzzle Solved!</Text>
          <Text style={styles.completeSubText}>Tap to play again</Text>
        </TouchableOpacity>
      )}

      {/* Row 1: Mode toggle + Size selector */}
      <View style={styles.topRow}>
        <View style={styles.modeButtons}>
          <TouchableOpacity
            style={[styles.modeButton, gameMode === 'number' && styles.activeModeButton]}
            onPress={gameMode !== 'number' ? onModeToggle : undefined}
          >
            <Text style={[styles.modeButtonText, gameMode === 'number' && styles.activeModeButtonText]}>
              🔢
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modeButton, gameMode === 'photo' && styles.activeModeButton]}
            onPress={gameMode !== 'photo' ? onModeToggle : undefined}
          >
            <Text style={[styles.modeButtonText, gameMode === 'photo' && styles.activeModeButtonText]}>
              📷
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.sizeButtons}>
          {sizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[styles.sizeButton, currentSize === size && styles.activeSizeButton]}
              onPress={() => onSizeChange(size)}
            >
              <Text style={[styles.sizeButtonText, currentSize === size && styles.activeSizeButtonText]}>
                {size}×{size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Row 2: Pick Image (photo mode only, full-width) */}
      {gameMode === 'photo' && (
        <TouchableOpacity style={styles.imageButton} onPress={handleImagePick}>
          <Text style={styles.imageButtonText}>📷 Pick Image</Text>
        </TouchableOpacity>
      )}

      {/* Row 3: Always 3 action buttons, consistent size */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.hintButton, isComplete && styles.disabledButton]}
          onPress={onHint}
          disabled={isComplete}
        >
          <Text style={styles.actionIcon}>💡</Text>
          <Text style={[styles.actionLabel, isComplete && styles.disabledLabel]}>Hint</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.undoButton, !canUndo && styles.disabledButton]}
          onPress={onUndo}
          disabled={!canUndo}
        >
          <Text style={styles.actionIcon}>↩️</Text>
          <Text style={[styles.actionLabel, !canUndo && styles.disabledLabel]}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.shuffleButton]}
          onPress={onShuffle}
        >
          <Text style={styles.actionIcon}>🔀</Text>
          <Text style={styles.actionLabel}>Shuffle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    gap: 12,
  },
  completeBadge: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    gap: 2,
  },
  completeText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 16,
  },
  completeSubText: {
    color: '#d1fae5',
    fontSize: 12,
    fontWeight: '500',
  },

  /* Row 1 */
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modeButtons: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 3,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeModeButton: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 20,
    color: '#94a3b8',
  },
  activeModeButtonText: {
    color: '#1e293b',
  },
  sizeButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  sizeButton: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 7,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activeSizeButton: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  sizeButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#64748b',
  },
  activeSizeButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  /* Row 2 */
  imageButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
  },
  imageButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },

  /* Row 3 */
  actionContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 10,
    alignItems: 'center',
    gap: 2,
  },
  actionIcon: {
    fontSize: 20,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  hintButton: {
    backgroundColor: '#f59e0b',
  },
  undoButton: {
    backgroundColor: '#64748b',
  },
  shuffleButton: {
    backgroundColor: '#8b5cf6',
  },
  disabledButton: {
    opacity: 0.35,
  },
  disabledLabel: {
    color: '#ffffff',
  },
});

export default GameControls;
