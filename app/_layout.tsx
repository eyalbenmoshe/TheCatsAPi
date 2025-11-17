import { Stack } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { Provider } from "react-redux";
// eslint-disable-next-line import/no-named-as-default
import { OfflineIndicator } from "../components";
import { useNetworkStatus } from "../hooks/useNetworkStatus";
import store, { initializeFavoritesFromStorage } from "../store/store";

function RootLayoutContent() {
  const { isOnline } = useNetworkStatus();

  useEffect(() => {
    // Initialize favorites from AsyncStorage on app start
    initializeFavoritesFromStorage();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <OfflineIndicator isOnline={isOnline} />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </View>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutContent />
    </Provider>
  );
}
