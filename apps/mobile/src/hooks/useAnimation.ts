import { useCallback, useEffect } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  type WithSpringConfig,
  type WithTimingConfig,
  runOnJS,
} from 'react-native-reanimated';
import { Platform } from 'react-native';

const SPRING_SOFT: WithSpringConfig = {
  damping: 18,
  stiffness: 200,
  mass: 1,
};

const SPRING_BOUNCY: WithSpringConfig = {
  damping: 12,
  stiffness: 180,
  mass: 0.8,
};

const EASE_OUT: WithTimingConfig = { duration: 200, easing: Easing.out(Easing.cubic) };
const EASE_IN: WithTimingConfig = { duration: 150, easing: Easing.in(Easing.cubic) };
const EASE_MEDIUM: WithTimingConfig = { duration: 300, easing: Easing.out(Easing.cubic) };
const EASE_SLOW: WithTimingConfig = { duration: 500, easing: Easing.out(Easing.cubic) };

export function useReducedMotion(): boolean {
  // In Reanimated, we can't directly access prefers-reduced-motion from JS thread easily.
  // For now, respect a global flag or Platform-based opt-out.
  // Reanimated 3 does not have a built-in hook — we default to false (animations on).
  // Override via global if needed.
  return false;
}

export function useFadeIn(delayMs = 0, duration = 200) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(12);

  useEffect(() => {
    const config: WithTimingConfig = { duration, easing: Easing.out(Easing.cubic) };
    if (delayMs > 0) {
      opacity.value = withDelay(delayMs, withTiming(1, config));
      translateY.value = withDelay(delayMs, withTiming(0, config));
    } else {
      opacity.value = withTiming(1, config);
      translateY.value = withTiming(0, config);
    }
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}

export function useSlideIn(direction: 'left' | 'right' | 'up' = 'left', duration = 300) {
  const translateX = useSharedValue(direction === 'left' ? 50 : direction === 'right' ? -50 : 0);
  const translateY = useSharedValue(direction === 'up' ? 30 : 0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const config: WithTimingConfig = { duration, easing: Easing.out(Easing.cubic) };
    translateX.value = withTiming(0, config);
    translateY.value = withTiming(0, config);
    opacity.value = withTiming(1, config);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }));

  return animatedStyle;
}

export function useScalePress() {
  const scale = useSharedValue(1);

  const pressIn = useCallback(() => {
    scale.value = withSpring(0.96, SPRING_SOFT);
  }, []);

  const pressOut = useCallback(() => {
    scale.value = withSpring(1, SPRING_SOFT);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return { animatedStyle, pressIn, pressOut };
}

export function useShimmer() {
  const translateX = useSharedValue(-1);

  useEffect(() => {
    translateX.value = withDelay(
      300,
      withTiming(2, {
        duration: 1500,
        easing: Easing.inOut(Easing.cubic),
      })
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return animatedStyle;
}

export function useStaggerReveal(index: number, baseDelay = 80) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const delay = baseDelay * index;
    opacity.value = withDelay(delay, withTiming(1, EASE_OUT));
    translateY.value = withDelay(delay, withTiming(0, { duration: 400, easing: Easing.out(Easing.cubic) }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}
