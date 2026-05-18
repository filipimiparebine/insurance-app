import { Text, TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius } from '../theme/tokens';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

const variantStyles: Record<ButtonVariant, { button: ViewStyle; text: TextStyle; disabled?: ViewStyle }> = {
  primary: {
    button: { backgroundColor: colors.orange },
    text: { color: colors.white, fontWeight: '600' },
    disabled: { backgroundColor: colors.orangeLight },
  },
  secondary: {
    button: { backgroundColor: colors.black },
    text: { color: colors.white, fontWeight: '600' },
  },
  outline: {
    button: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: colors.orange },
    text: { color: colors.orange, fontWeight: '500' },
  },
  ghost: {
    button: { backgroundColor: 'transparent' },
    text: { color: colors.orange, fontWeight: '500' },
  },
};

export function Button({ children, onPress, variant = 'primary', loading, disabled, style }: ButtonProps) {
  const v = variantStyles[variant];
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.base, v.button, isDisabled && v.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={v.text.color as string} />
      ) : (
        <Text style={[v.text]}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 48,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
