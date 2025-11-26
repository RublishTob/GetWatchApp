import { useEffect } from "react";
import SystemNavigationBar from "react-native-system-navigation-bar";

export function useImmersiveMode() {
  useEffect(() => {
    const hide = () => SystemNavigationBar.immersive();
    hide();
    const interval = setInterval(hide, 4000);

    return () => clearInterval(interval);
  }, []);
}