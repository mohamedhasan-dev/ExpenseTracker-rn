import { Redirect } from "expo-router";
import { useIsLoggedIn } from "./App";

// "/" just forwards into the right part of the app
export default function Index() {
  return useIsLoggedIn() ? (
    <Redirect href="/Dashboard" />
  ) : (
    <Redirect href="/Login" />
  );
}
