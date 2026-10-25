import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "Transactions",
};

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Transactions" />
      {/* From the list's button it slides in like a normal page; from the navbar's +
          it acts like a tab and appears instantly (no slide over the list) */}
      <Stack.Screen
        name="AddTransaction"
        options={({ route }) => ({
          animation:
            (route.params as { from?: string } | undefined)?.from === "list"
              ? "default"
              : "none",
        })}
      />
    </Stack>
  );
}
