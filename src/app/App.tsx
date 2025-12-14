import {ReduxProvider} from "./providers/ReduxProvider";
import {Navigation} from "./navigation/Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SafeAreaView } from 'react-native-safe-area-context';
import {StyleSheet} from 'react-native'
import {useEffect} from 'react'
import {COLOR} from '@shared/constants/colors'
import { ScreenProvider } from "@/shared/hooks/ScreenContext";
import { useImmersiveMode} from "@/app/hooks/useImmersiveMode";
import { configureGoogle } from '@/services/googleBackUp/googleAuth';
import { initDB } from "@/data/db";
import { autoBackupOncePerMonth } from "@/services/autoBackup/autoBackup"
import { initBackupNotificationChannel } from "@/services/autoBackup/notifyBackUp"
import {PaperProvider} from 'react-native-paper'


export const App = () => {
    useImmersiveMode();

    useEffect(()=>{
      console.log("App is running NOW")
      initDB();
      configureGoogle();
      initBackupNotificationChannel();
      autoBackupOncePerMonth();
    },[])
    return (
      <ReduxProvider>
        <SafeAreaProvider>
          <SafeAreaView style={styles.container} edges={['top', 'left']}>
            <ScreenProvider>
              <PaperProvider>

                <Navigation />
              </PaperProvider>
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
