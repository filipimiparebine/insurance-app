import { Text, View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/tokens';

interface FormCardProps {
  title: string;
  children: React.ReactNode;
  style?: object;
}

export function FormCard({ title, children, style }: FormCardProps) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: spacing.lg,
  },
});
