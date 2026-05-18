import { Text, View, StyleSheet } from 'react-native';
import { colors } from '../theme/tokens';

interface HeaderTextProps {
  title: string;
  subtitle?: string;
}

export function HeaderText({ title, subtitle }: HeaderTextProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '600', color: colors.gray900, marginBottom: 4 },
  subtitle: { fontSize: 15, color: colors.gray500 },
});
