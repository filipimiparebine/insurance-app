import { Text, View, StyleSheet } from 'react-native';
import { colors, spacing } from '../theme/tokens';

interface FieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  containerStyle?: object;
}

export function Field({ label, required, children, containerStyle }: FieldProps) {
  return (
    <View style={[styles.field, containerStyle]}>
      <Text style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '500', color: colors.gray600, marginBottom: spacing.xs },
});
