import { type ReactNode } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { useScalePress } from '../hooks/useAnimation';

interface Props extends PressableProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export default function AnimatedPressable({ children, style, onPress, ...rest }: Props) {
  const { animatedStyle, pressIn, pressOut } = useScalePress();

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={pressIn}
        onPressOut={pressOut}
        {...rest}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
}
