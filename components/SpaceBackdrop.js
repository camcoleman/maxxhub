import React from 'react';
import { StyleSheet, View } from 'react-native';

const STARS = [
  { top: '6%', left: '12%', size: 2, opacity: 0.4 },
  { top: '10%', left: '84%', size: 2, opacity: 0.6 },
  { top: '18%', left: '36%', size: 1.5, opacity: 0.45 },
  { top: '24%', left: '72%', size: 2, opacity: 0.35 },
  { top: '32%', left: '10%', size: 1.5, opacity: 0.5 },
  { top: '40%', left: '58%', size: 2, opacity: 0.5 },
  { top: '48%', left: '90%', size: 1.5, opacity: 0.4 },
  { top: '56%', left: '22%', size: 2, opacity: 0.45 },
  { top: '68%', left: '74%', size: 1.5, opacity: 0.45 },
  { top: '78%', left: '44%', size: 2, opacity: 0.5 },
  { top: '86%', left: '16%', size: 1.5, opacity: 0.4 },
  { top: '92%', left: '80%', size: 2, opacity: 0.55 },
];

export default function SpaceBackdrop() {
  return (
    <View pointerEvents="none" style={styles.overlay}>
      <View style={styles.nebulaGlow} />
      {STARS.map((star, index) => (
        <View
          key={`${star.top}-${star.left}-${index}`}
          style={[
            styles.star,
            {
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  nebulaGlow: {
    position: 'absolute',
    top: -120,
    left: -40,
    width: 300,
    height: 300,
    borderRadius: 999,
    backgroundColor: '#0A1C4A',
    opacity: 0.2,
  },
  star: {
    position: 'absolute',
    borderRadius: 99,
    backgroundColor: '#C8E8FF',
  },
});
