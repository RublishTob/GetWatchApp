import {ReduxProvider} from "./providers/ReduxProvider";
import {Navigation} from "./navigation/Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from 'react-native-safe-area-context';
import {View,Text,StyleSheet} from 'react-native'
import {useEffect} from 'react'
import {COLOR} from '@shared/constants/colors'
import { ScreenProvider } from "@/shared/hooks/ScreenContext";
import { useImmersiveMode} from "@/app/hooks/useImmersiveMode";
import { NavigationContainer, useNavigationState } from "@react-navigation/native";
import { useNavigationApp } from "@features/model/useNavigationApp"
import { BackHandler } from "react-native";
import { configureGoogle } from '@/services/googleAuth';

export const App = () => {
    useImmersiveMode();

    useEffect(()=>{
      console.log("App is running NOW")
      configureGoogle()
    },[])
    return (
        <ReduxProvider> 
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} edges={['top','left']}>
                  <ScreenProvider>
                    <Navigation/>
                  </ScreenProvider>
                </SafeAreaView>
            </SafeAreaProvider>
        </ReduxProvider>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.primary,
  },
  text: {
    fontSize: 24,
  },
});
