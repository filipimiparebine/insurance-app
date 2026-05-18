import { Text, View, StyleSheet } from 'react-native';

interface StepperProps {
  total: number;
  current: number;
}

export function Stepper({ total, current }: StepperProps) {
  return (
    <View style={styles.stepper}>
      {Array.from({ length: total }, (_, i) => i + 1).map((s) => (
        <View key={s} style={styles.stepRow}>
          <View
            style={[
              styles.stepDot,
              s === current && styles.stepDotActive,
              s < current && styles.stepDotDone,
            ]}
          >
            <Text
              style={[
                styles.stepDotText,
                s === current && styles.stepDotTextActive,
              ]}
            >
              {s}
            </Text>
          </View>
          {s < total && (
            <View
              style={[
                styles.stepLine,
                s < current && styles.stepLineDone,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  stepper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  stepRow: { flexDirection: 'row', alignItems: 'center' },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDotActive: { backgroundColor: '#FF6B1A' },
  stepDotDone: { backgroundColor: '#16a34a' },
  stepDotText: { fontSize: 13, fontWeight: '600', color: '#9ca3af' },
  stepDotTextActive: { color: '#fff' },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 4,
  },
  stepLineDone: { backgroundColor: '#16a34a' },
});
