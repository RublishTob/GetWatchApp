import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Dimensions, ScaledSize } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ScreenContextType = {
  width: number;
  height: number;
  insets: { top: number; bottom: number; left: number; right: number };
};

export const ScreenContext = createContext<ScreenContextType | undefined>(undefined);

export const ScreenProvider = ({ children }: { children: ReactNode }) => {
  const insets = useSafeAreaInsets();
  const [screen, setScreen] = useState<ScaledSize>(Dimensions.get("window"));
  useEffect(() => {
    const handler = ({ window }: { window: ScaledSize }) => setScreen(window);
    const subscription = Dimensions.addEventListener("change", handler);

    return () => subscription?.remove();
  }, []);

  const safeWidth = screen.width;
  const safeHeight = screen.height - insets.top;

  return (
    <ScreenContext.Provider
      value={{
        width: safeWidth,
        height: safeHeight,
        insets,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
};