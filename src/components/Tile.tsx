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
        { width: tileSize, height: tileSize },
      ]}
      onPress={() => onTilePress(index)}
      activeOpacity={0.7}
    >
      {gameMode === 'photo' ? renderPhotoTile() : renderNumberTile()}
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
