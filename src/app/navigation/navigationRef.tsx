import { createNavigationContainerRef } from "@react-navigation/native";
import type { RootStackParamList } from "./Navigation"; // путь поправь

export const navigationRef = createNavigationContainerRef<RootStackParamList>();