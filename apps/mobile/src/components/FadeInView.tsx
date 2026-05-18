import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useFadeIn } from '../hooks/useAnimation';

interface Props {
  children: ReactNode;
  delay?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}

export default function FadeInView({ children, delay = 0, duration = 200, style }: Props) {
  const animatedStyle = useFadeIn(delay, duration);

  return (
    <Animated.View style={[animatedStyle, style]}>
      {children}
    </Animated.View>
  );
}
