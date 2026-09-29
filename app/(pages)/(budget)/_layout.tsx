import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "Budget",
};

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
