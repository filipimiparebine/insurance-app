import { View, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withRepeat,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
}

function ShimmerOverlay() {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      300,
      withRepeat(
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.cubic) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(
      Math.abs((progress.value * 2) % 2 - 1),
      [0, 1],
      [0.3, 1],
      Extrapolation.CLAMP
    ),
  }));

  return <Animated.View style={[{ ...StyleSheet.absoluteFillObject, backgroundColor: '#e5e7eb' }, animatedStyle]} />;
}

import { StyleSheet } from 'react-native';

export default function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: Props) {
  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: '#f3f4f6',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <ShimmerOverlay />
    </View>
  );
}

export function SkeletonCard({ style }: { style?: StyleProp<ViewStyle> }) {
  return (
    <View style={[skeletonStyles.card, style]}>
      <View style={skeletonStyles.row}>
        <Skeleton width={40} height={40} borderRadius={20} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Skeleton width="60%" height={16} />
          <Skeleton width="40%" height={12} style={{ marginTop: 6 }} />
        </View>
      </View>
      <Skeleton width="100%" height={14} style={{ marginTop: 16 }} />
      <Skeleton width="80%" height={14} style={{ marginTop: 6 }} />
      <Skeleton width="50%" height={14} style={{ marginTop: 6 }} />
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
});
