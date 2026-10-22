import { View, Text, StyleSheet, Switch, Alert } from "react-native";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import useTheme from "@/hooks/useTheme";
import useAuth from "@/hooks/useAuth";
import PrimaryButton from "@/components/PrimaryButton";
import { useCurrentUser } from "@/services/queries";

const Settings = () => {
  const { colors, isDarkMode, toggleDarkMode } = useTheme();
  const { logout } = useAuth();
  const { data: user } = useCurrentUser();

  const confirmLogout = () =>
    Alert.alert("Log out?", "You'll need to sign in again to see your data.", [
      { text: "Cancel", style: "cancel" },
      { text: "Log out", style: "destructive", onPress: () => logout() },
    ]);

  return (
    <View style={styles.root}>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

      {/* Account */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={[styles.avatar, { borderColor: colors.accent }]}>
          {user ? (
            <Text style={[styles.avatarText, { color: colors.accent }]}>
              {user.user_name.charAt(0).toUpperCase()}
            </Text>
          ) : (
            <MaterialCommunityIcons name="account" size={24} color={colors.accent} />
          )}
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
            {user?.user_name ?? " "}
          </Text>
          <Text style={[styles.email, { color: colors.text }]} numberOfLines={1}>
            {user?.email ?? " "}
          </Text>
        </View>
      </View>

      {/* Preferences */}
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <MaterialCommunityIcons
          name={isDarkMode ? "weather-night" : "white-balance-sunny"}
          size={22}
          color={colors.text}
        />
        <Text style={[styles.rowLabel, { color: colors.text }]}>Dark mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          trackColor={{ true: colors.accent, false: colors.surface2 }}
          thumbColor="#fff"
        />
      </View>

      <PrimaryButton label="Log out" onPress={confirmLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    borderRadius: 20,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
  },
  email: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 2,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default Settings;
