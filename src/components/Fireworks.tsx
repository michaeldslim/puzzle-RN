import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const COLORS = [
  '#ff4d4d', '#ff914d', '#ffd700', '#4dff91',
  '#4dd9ff', '#a64dff', '#ff4da6', '#ffffff',
];

const PARTICLE_COUNT = 12;
const BURST_COUNT = 8;

interface ParticleProps {
  color: string;
  angle: number;
  distance: number;
  originX: number;
  originY: number;
  delay: number;
  size: number;
  onDone?: () => void;
}

const Particle: React.FC<ParticleProps> = ({ color, angle, distance, originX, originY, delay, size, onDone }) => {
  const x = useSharedValue(0);
  const y = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  const rad = (angle * Math.PI) / 180;
  const tx = Math.cos(rad) * distance;
  const ty = Math.sin(rad) * distance;

  useEffect(() => {
    scale.value = withDelay(delay, withTiming(1, { duration: 150, easing: Easing.out(Easing.back(2)) }));
    x.value = withDelay(delay, withTiming(tx, { duration: 700, easing: Easing.out(Easing.quad) }));
    y.value = withDelay(delay, withTiming(ty + 80, { duration: 700, easing: Easing.out(Easing.quad) }));
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 100 }),
        withDelay(400, withTiming(0, { duration: 350 }, (finished) => {
          if (finished && onDone) runOnJS(onDone)();
        }))
      )
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: x.value },
      { translateY: y.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          left: originX - size / 2,
          top: originY - size / 2,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        },
      ]}
    />
  );
};

interface BurstProps {
  x: number;
  y: number;
  delay: number;
  colorSet: string[];
  onDone: () => void;
}

const Burst: React.FC<BurstProps> = ({ x, y, delay, colorSet, onDone }) => {
  const doneCount = useRef(0);
  const handleParticleDone = () => {
    doneCount.current += 1;
    if (doneCount.current >= PARTICLE_COUNT) {
      onDone();
    }
  };

  return (
    <>
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const angle = (360 / PARTICLE_COUNT) * i + Math.random() * 10;
        const distance = 60 + Math.random() * 80;
        const size = 6 + Math.random() * 8;
        const color = colorSet[i % colorSet.length];
        return (
          <Particle
            key={i}
            color={color}
            angle={angle}
            distance={distance}
            originX={x}
            originY={y}
            delay={delay}
            size={size}
            onDone={handleParticleDone}
          />
        );
      })}
    </>
  );
};

interface FireworksProps {
  onDone: () => void;
}

const Fireworks: React.FC<FireworksProps> = ({ onDone }) => {
  const doneCount = useRef(0);

  const handleBurstDone = () => {
    doneCount.current += 1;
    if (doneCount.current >= BURST_COUNT) {
      onDone();
    }
  };

  const bursts = Array.from({ length: BURST_COUNT }).map((_, i) => {
    const x = 0.1 * SCREEN_W + Math.random() * 0.8 * SCREEN_W;
    const y = 0.1 * SCREEN_H + Math.random() * 0.55 * SCREEN_H;
    const delay = i * 180;
    const colorOffset = Math.floor(Math.random() * COLORS.length);
    const colorSet = [...COLORS.slice(colorOffset), ...COLORS.slice(0, colorOffset)];
    return { x, y, delay, colorSet };
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {bursts.map((b, i) => (
        <Burst
          key={i}
          x={b.x}
          y={b.y}
          delay={b.delay}
          colorSet={b.colorSet}
          onDone={handleBurstDone}
        />
      ))}
    </View>
  );
};

export default Fireworks;
