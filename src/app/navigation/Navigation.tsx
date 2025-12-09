import React, { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AllClients, NewClient, Home, ClientInfo, BackUp } from "@/pages";
import { NavigationContainer } from "@react-navigation/native";
import { BackHandler } from "react-native";
import { navigationRef } from "@/app/navigation/navigationRef";

export type RootStackParamList = {
  AllClients: { presetFilter?: string } | undefined;
  NewClient: undefined;
  Home: undefined;
  ClientInfo: undefined;
  BackUp: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {

  useEffect(() => {
    const backMap: Record<string, string | null> = {
      ClientInfo: "AllClients",
      AllClients: "Home",
      Home: null, // выходим из приложения
    };

    const onBackPress = () => {
      if (!navigationRef.isReady()) return false;

      const current = navigationRef.getCurrentRoute()?.name;
      if (!current) return false;

      const target = backMap[current];

      // null → разрешаем выход
      if (target === null) return false;

      // если есть куда перейти
      if (target) {
        navigationRef.navigate(target as any);
        return true;
      }

      // fallback
      navigationRef.navigate("Home");
      return true;
    };

    const sub = BackHandler.addEventListener("hardwareBackPress", onBackPress);
    return () => sub.remove();
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="AllClients" component={AllClients} />
        <Stack.Screen name="NewClient" component={NewClient} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="ClientInfo" component={ClientInfo} />
        <Stack.Screen name="BackUp" component={BackUp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};


