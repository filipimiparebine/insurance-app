import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useLocale } from '../../../src/lib/LocaleProvider';

const TABS_CONFIG = [
  { name: 'index', icon: '🏠' },
  { name: 'polite', icon: '📋' },
  { name: 'profil', icon: '👤' },
];

export default function AppLayout() {
  const { isSignedIn } = useAuth();
  const { t } = useLocale();

  if (!isSignedIn) {
    return <Redirect href="/landing" />;
  }

  const tabLabels = [t('dashboard.home'), t('dashboard.policies'), t('dashboard.profile')];

  return (
    <Tabs
      tabBar={(props) => <AnimatedTabBar labels={tabLabels} {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: '#fff' },
        headerTintColor: '#0A0A0F',
        headerTitleStyle: { fontWeight: '600', color: '#0A0A0F' },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: tabLabels[0] }} />
      <Tabs.Screen name="polite" options={{ title: tabLabels[1] }} />
      <Tabs.Screen name="profil" options={{ title: tabLabels[2] }} />
    </Tabs>
  );
}

function AnimatedTabBar({ state, navigation, labels }: BottomTabBarProps & { labels: string[] }) {
  return (
    <View style={tabStyles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tab = TABS_CONFIG[index];
        const label = labels[index] ?? '';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            isFocused={isFocused}
            icon={tab?.icon ?? '•'}
            label={label}
            onPress={onPress}
          />
        );
      })}
    </View>
  );
}

function TabItem({ isFocused, icon, label, onPress }: {
  isFocused: boolean; icon: string; label: string; onPress: () => void;
}) {
  const scale = useSharedValue(isFocused ? 1 : 0.85);
  const translateY = useSharedValue(isFocused ? -2 : 0);

  useEffect(() => {
    scale.value = withSpring(isFocused ? 1 : 0.85, { damping: 12, stiffness: 200 });
    translateY.value = withTiming(isFocused ? -2 : 0, { duration: 200, easing: Easing.out(Easing.cubic) });
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Pressable onPress={onPress} style={tabStyles.tab}>
      <Animated.View style={animatedIconStyle}>
        <Text style={[tabStyles.icon, isFocused && tabStyles.iconFocused]}>{icon}</Text>
      </Animated.View>
      <Text style={[tabStyles.label, isFocused && tabStyles.labelFocused]}>{label}</Text>
    </Pressable>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopColor: '#e5e7eb',
    borderTopWidth: 1,
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: { fontSize: 22, opacity: 0.5 },
  iconFocused: { opacity: 1 },
  label: { fontSize: 11, fontWeight: '400', color: '#9ca3af', marginTop: 1 },
  labelFocused: { fontWeight: '600', color: '#FF6B1A' },
});
