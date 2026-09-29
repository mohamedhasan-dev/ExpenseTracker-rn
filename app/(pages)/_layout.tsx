import { useEffect, useRef, useState } from "react";
import { Tabs } from "expo-router";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  LayoutRectangle,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useTheme from "@/hooks/useTheme";

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

const FAB_SIZE = 56;
const FAB_OVERHANG = 22; // how far the + button rises above the bar
const PILL_INSET = 4; // gap between the highlight pill and the tab edges
const PILL_ALPHA = 0.1; // pill = text colour at 10% -> works in dark and light mode
const SLIDE = { duration: 280, easing: Easing.out(Easing.cubic) };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// `name` must match a folder in (pages) that has its own _layout.tsx
const tabItems: {
  name: string;
  label: string;
  icon: IconName;
  activeIcon: IconName;
}[] = [
  { name: "(dashboard)", label: "Home", icon: "home-outline", activeIcon: "home-variant" },
  { name: "(reports)", label: "Analytics", icon: "chart-box-outline", activeIcon: "chart-box" },
  { name: "(budget)", label: "Budget", icon: "wallet-outline", activeIcon: "wallet" },
  { name: "(settings)", label: "Profile", icon: "account-outline", activeIcon: "account" },
];

export function Navbar({ state, navigation }: BottomTabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const focusedRoute = state.routes[state.index];
  const activeRoute = focusedRoute?.name;

  // Is the Add Transaction screen open inside the (transactions) tab?
  const nested = focusedRoute?.state;
  const nestedScreen =
    nested?.routes[nested.index ?? 0]?.name ??
    (focusedRoute?.params as { screen?: string } | undefined)?.screen;
  const isAddActive =
    activeRoute === "(transactions)" && nestedScreen === "AddTransaction";

  const goTo = (name: string, screen?: string) => {
    const route = state.routes.find((r) => r.name === name);
    if (!route) return;
    // Lets the tab's stack pop back to its first screen when re-pressed
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    if (event.defaultPrevented) return;
    if (screen) navigation.navigate(name, { screen });
    else if (activeRoute !== name) navigation.navigate(name);
  };

  /* ---------- sliding highlight pill ---------- */
  const [layouts, setLayouts] = useState<Record<string, LayoutRectangle>>({});
  const pillX = useSharedValue(0);
  const pillOpacity = useSharedValue(0);
  const pillVisible = useRef(false);

  useEffect(() => {
    const layout = activeRoute ? layouts[activeRoute] : undefined;
    if (!layout) {
      // e.g. on the Add Transaction screen: no tab to highlight
      pillOpacity.value = withTiming(0, SLIDE);
      pillVisible.current = false;
      return;
    }
    const x = layout.x + PILL_INSET;
    if (pillVisible.current) {
      // slide from the previous tab
      pillX.value = withTiming(x, SLIDE);
    } else {
      // first show: appear in place instead of flying in from the left
      pillX.value = x;
    }
    pillOpacity.value = withTiming(1, SLIDE);
    pillVisible.current = true;
  }, [activeRoute, layouts, pillX, pillOpacity]);

  // Only transform + opacity are animated (no layout work per frame);
  // all tabs are the same size, so width/height/top are static.
  const pillSize = Object.values(layouts)[0];
  const pillStyle = useAnimatedStyle(() => ({
    opacity: pillOpacity.value * PILL_ALPHA,
    transform: [{ translateX: pillX.value }],
  }));

  const saveLayout = (name: string, layout: LayoutRectangle) =>
    setLayouts((prev) => {
      const old = prev[name];
      if (
        old &&
        old.x === layout.x &&
        old.y === layout.y &&
        old.width === layout.width &&
        old.height === layout.height
      ) {
        return prev;
      }
      return { ...prev, [name]: layout };
    });

  /* ---------- + button glow ---------- */
  const glow = useSharedValue(0); // on while Add Transaction is open (pulses)
  const pressGlow = useSharedValue(0); // on while the finger is down
  const fabScale = useSharedValue(1);

  useEffect(() => {
    if (isAddActive) {
      glow.value = withSequence(
        withTiming(1, { duration: 300, easing: Easing.out(Easing.quad) }),
        withRepeat(
          withSequence(
            withTiming(0.55, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
            withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
        ),
      );
    } else {
      cancelAnimation(glow);
      glow.value = withTiming(0, { duration: 300 });
    }
  }, [isAddActive, glow]);

  const glowStyle = useAnimatedStyle(() => {
    const g = Math.max(glow.value, pressGlow.value);
    return {
      opacity: g,
      transform: [{ scale: 1 + g * 0.12 }],
    };
  });

  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const renderTab = (item: (typeof tabItems)[number]) => {
    const focused = activeRoute === item.name;
    return (
      <Pressable
        key={item.name}
        accessibilityRole="tab"
        accessibilityLabel={item.label}
        accessibilityState={{ selected: focused }}
        onPress={() => goTo(item.name)}
        onLayout={(e) => saveLayout(item.name, e.nativeEvent.layout)}
        style={styles.tab}
      >
        <MaterialCommunityIcons
          name={focused ? item.activeIcon : item.icon}
          size={22}
          color={colors.text}
        />
        <Text style={[styles.label, { color: colors.text }]}>
          {item.label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.surface,
            paddingBottom: Math.max(insets.bottom, 8),
          },
        ]}
      >
        {/* Semi-transparent highlight behind the active tab */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.pill,
            {
              backgroundColor: colors.text,
              top: pillSize?.y ?? 0,
              height: pillSize?.height ?? 0,
              width: pillSize ? pillSize.width - PILL_INSET * 2 : 0,
            },
            pillStyle,
          ]}
        />
        {tabItems.slice(0, 2).map(renderTab)}
        <View style={styles.fabSpacer} />
        {tabItems.slice(2).map(renderTab)}
      </View>

      {/* Kept inside the wrapper's bounds so the whole button is tappable on Android */}
      <View style={styles.fabSlot} pointerEvents="box-none">
        <Animated.View
          pointerEvents="none"
          style={[
            styles.glow,
            {
              backgroundColor: colors.accent,
              boxShadow: `0px 0px 22px 8px ${colors.accent}`,
            },
            glowStyle,
          ]}
        />
        <AnimatedPressable
          accessibilityLabel="Add transaction"
          accessibilityRole="button"
          accessibilityState={{ selected: isAddActive }}
          onPress={() => goTo("(transactions)", "AddTransaction")}
          onPressIn={() => {
            fabScale.value = withSpring(0.92, { damping: 15, stiffness: 300 });
            pressGlow.value = withTiming(1, { duration: 150 });
          }}
          onPressOut={() => {
            fabScale.value = withSpring(1, { damping: 12, stiffness: 220 });
            pressGlow.value = withTiming(0, { duration: 400 });
          }}
          style={[styles.fab, { backgroundColor: colors.accent }, fabStyle]}
        >
          <MaterialCommunityIcons name="plus" size={30} color="#fff" />
        </AnimatedPressable>
      </View>
    </View>
  );
}

export const unstable_settings = {
  initialRouteName: "(dashboard)",
};

export default function PagesLayout() {
  const insets = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true, // hidden tabs don't re-render
        sceneStyle: { paddingTop: insets.top },
      }}
      tabBar={(props) => <Navbar {...props} />}
    >
      <Tabs.Screen name="(dashboard)" />
      <Tabs.Screen name="(reports)" />
      <Tabs.Screen name="(budget)" />
      <Tabs.Screen name="(settings)" />
      {/* No tab button: reached via + and "See all" */}
      <Tabs.Screen name="(transactions)" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: FAB_OVERHANG,
  },
  bar: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  pill: {
    position: "absolute",
    left: 0,
    borderRadius: 14,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    gap: 3,
    paddingVertical: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: "500",
  },
  fabSpacer: {
    width: FAB_SIZE + 16,
  },
  fabSlot: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  glow: {
    position: "absolute",
    top: 0,
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
    shadowColor: "#b84458",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  },
});
