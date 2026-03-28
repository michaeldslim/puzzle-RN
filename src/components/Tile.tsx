import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View } from 'react-native';
import { ITileProps } from '../../types';

const Tile: React.FC<ITileProps> = ({
  value,
  index,
  size,
  onTilePress,
  gameMode,
  imageUri,
  tileSize,
  isHint,
  hintDirection,
}) => {
  const isEmpty = value === 0;
  const hintStep = Number(hintDirection);
  const hintStepStyle = Number.isFinite(hintStep)
    ? hintStep === 1
      ? styles.hintBadgeStep1
      : hintStep === 2
        ? styles.hintBadgeStep2
        : styles.hintBadgeStep3
    : styles.hintBadgeDefault;

  const renderNumberTile = () => (
    <Text style={[styles.tileText, { fontSize: tileSize * 0.3 }]}>
      {value}
    </Text>
  );

  const renderPhotoTile = () => {
    if (!imageUri) return renderNumberTile();

    const row = Math.floor((value - 1) / size);
    const col = (value - 1) % size;

    return (
      <View style={[styles.photoContainer, { width: tileSize, height: tileSize }]}>
        <Image
          source={{ uri: imageUri }}
          style={[
            styles.photoImage,
            {
              width: tileSize * size,
              height: tileSize * size,
              left: -(col * tileSize),
              top: -(row * tileSize),
            },
          ]}
          resizeMode="cover"
        />
      </View>
    );
  };

  if (isEmpty) {
    return (
      <View
        style={[
          styles.tile,
          styles.emptyTile,
          { width: tileSize, height: tileSize },
        ]}
      />
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.tile,
        styles.filledTile,
        isHint && styles.hintTile,
        { width: tileSize, height: tileSize },
      ]}
      onPress={() => onTilePress(index)}
      activeOpacity={0.7}
    >
      <View style={styles.tileContent}>
        {gameMode === 'photo' ? renderPhotoTile() : renderNumberTile()}
        {isHint && (
          <View style={[styles.hintBadge, hintStepStyle]}>
            <Text style={styles.hintBadgeText}>{hintDirection ?? '1'}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    overflow: 'hidden',
  },
  emptyTile: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowOpacity: 0,
  },
  filledTile: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e1e5e9',
  },

  hintTile: {
    borderColor: '#f59e0b',
    borderWidth: 3,
    backgroundColor: '#fffbeb',
  },
  tileContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hintBadge: {
    position: 'absolute',
    top: 3,
    right: 3,
    minWidth: 26,
    height: 26,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  hintBadgeDefault: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  hintBadgeStep1: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
  },
  hintBadgeStep2: {
    backgroundColor: '#fed7aa',
    borderColor: '#f97316',
  },
  hintBadgeStep3: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  hintBadgeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#111827',
    lineHeight: 16,
  },
  tileText: {
    fontWeight: '600',
    color: '#374151',
  },
  photoContainer: {
    overflow: 'hidden',
    borderRadius: 6,
  },
  photoImage: {
    position: 'absolute',
  },
});

export default Tile;
