import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Dimensions, ScaledSize } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenContextType , ScreenContext } from "./ScreenContext";

export const useScreen = (): ScreenContextType => {
  const context = useContext(ScreenContext);
  if (!context) {
    throw new Error("useScreen must be used within a ScreenProvider");
  }
  return context;
};