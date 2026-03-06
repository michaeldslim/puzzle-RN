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
  isMovable,
  isHint,
}) => {
  const isEmpty = value === 0;

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
        isMovable && styles.movableTile,
        isHint && styles.hintTile,
        { width: tileSize, height: tileSize },
      ]}
      onPress={() => onTilePress(index)}
      activeOpacity={0.7}
    >
      <View style={styles.tileContent}>
        {gameMode === 'photo' ? renderPhotoTile() : renderNumberTile()}
        {isHint && (
          <View style={styles.hintBadge}>
            <Text style={styles.hintBadgeText}>💡</Text>
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
  movableTile: {
    borderColor: '#3b82f6',
    borderWidth: 2,
    backgroundColor: '#eff6ff',
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
    top: 4,
    right: 4,
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  hintBadgeText: {
    fontSize: 12,
    fontWeight: '700',
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
