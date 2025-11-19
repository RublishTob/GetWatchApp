import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {AllClients, NewClient, Home, ClientInfo} from "@/pages";

export type RootStackParamList = {
  AllClients: undefined;
  NewClient: undefined;
  Home: undefined;
  ClientInfo:undefined
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, headerBackButtonMenuEnabled:false }}>
        <Stack.Screen
          name="AllClients"
          component={AllClients}
          options={{ title: "AllClients" }}
        />
        <Stack.Screen
          name="NewClient"
          component={NewClient}
          options={{ title: "NewClient" }}
        />
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: "Home" }}
        />
        <Stack.Screen
          name="ClientInfo"
          component={ClientInfo}
          options={{ title: "ClientInfo" }}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
};


