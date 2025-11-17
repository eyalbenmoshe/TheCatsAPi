/**
 * Hook for network connectivity status using NetInfo
 */

import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
      setIsLoading(false);
    });

    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected === true && state.isInternetReachable !== false);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isOnline, isLoading } as const;
};
