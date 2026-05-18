import { type ReactNode, Children, isValidElement, cloneElement } from 'react';
import Animated from 'react-native-reanimated';
import { useFadeIn } from '../hooks/useAnimation';

interface StaggerItemProps {
  children: ReactNode;
  index: number;
}

function StaggerItem({ children, index }: StaggerItemProps) {
  const animatedStyle = useFadeIn(index * 80);
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

interface StaggerProps {
  children: ReactNode;
  staggerDelay?: number;
}

export default function Stagger({ children, staggerDelay = 80 }: StaggerProps) {
  const childArray = Children.toArray(children);

  return (
    <>
      {childArray.map((child, index) => (
        <StaggerItem key={index} index={index}>
          {child}
        </StaggerItem>
      ))}
    </>
  );
}
