import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../theme/tokens';

interface ChipSelectProps<T extends string> {
  options: readonly T[] | T[];
  selected: T;
  onSelect: (value: T) => void;
  renderLabel?: (option: T) => string;
}

export function ChipSelect<T extends string>({
  options,
  selected,
  onSelect,
  renderLabel,
}: ChipSelectProps<T>) {
  return (
    <View style={styles.chips}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.chip, selected === opt && styles.chipActive]}
          onPress={() => onSelect(opt)}
        >
          <Text
            style={[
              styles.chipText,
              selected === opt && styles.chipTextActive,
            ]}
          >
            {renderLabel ? renderLabel(opt) : opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  chipActive: { backgroundColor: colors.black, borderColor: colors.black },
  chipText: { fontSize: 14, color: colors.gray600 },
  chipTextActive: { color: colors.white, fontWeight: '600' },
});
