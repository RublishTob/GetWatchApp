import Button from "@/shared/ui/Button";
import { View, StyleSheet, Image, TouchableOpacity, Animated, Text } from "react-native";
import {Client} from "@entities/Client/model/types"
import { useEffect, useState, useMemo, useRef} from "react";
import { useScreen } from "@/shared/hooks/useScreenSize";
import { useSelector, useDispatch } from "react-redux";
import { useNavigationApp } from "@features/model/useNavigationApp";
import { toggleOnDelivery } from "@/features/model/filterClients/slices/filterClientsSlice";
import { selectAllClients } from "@entities/Client/model/selectors"
import { COLOR } from "@/shared/constants/colors";
import { fetchClientsInfo } from "@/entities/Client/model/slice";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

export const MenuWidget = () => {
  const navigator = useNavigationApp();
  const dispatch = useAppDispatch();

  const clients:Client[] = useAppSelector(selectAllClients);

   const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

    useEffect(() => {
    dispatch(fetchClientsInfo());
  }, []);

  const hasDelivery = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return clients.some((c: Client) => {
      if (!c.accepted) return false;
      let dateOutMs: number;
      if (typeof c.dateOut === "number") {
        dateOutMs = c.dateOut;
      } else {
        const parsed = Date.parse(String(c.dateOut));
        if (Number.isNaN(parsed)) return false;
        dateOutMs = parsed;
      }

      const dateOutDay = new Date(dateOutMs);
      dateOutDay.setHours(0, 0, 0, 0);

      return dateOutDay.getTime() < today.getTime();
    });
  }, [clients]);
  return (
    <View style={styles.container}>
      <View style={styles.menu}>
        <Image source={require('D:/GetWatchApp/recourses/icons/logo.png')} style={{ width: 100, height: 100 }}></Image>
        <Button style={styles.button} text={"Все клиенты"} onPress={() => navigator.navigate("AllClients")} />
        <Button style={styles.button} text={"Новый клиент"} onPress={() => navigator.navigate("NewClient")} />
        {hasDelivery &&
          <Animated.View style={{ transform: [{ scale }], flexDirection:"row", columnGap:5, alignItems:"center", justifyContent:"center", width:100, height:50}}>
            <TouchableOpacity
            style={{flexDirection:"row", columnGap:10, alignItems:"center", justifyContent:"center", width:"100%", height:'100%'}}
              onPress={() => {
                dispatch(toggleOnDelivery());
                navigator.navigate("AllClients");
              }}
            >
              <View style={styles.deliveryIconButton}>
                <Image
                  source={require("D:/GetWatchApp/recourses/icons/Accept.png")}
                  style={{ width: "50%", height: "50%", tintColor: "white" }}
                />
              </View>
                <Text adjustsFontSizeToFit numberOfLines={5} style={{color:COLOR.mainTextColor, width:"70%", height:"60%"}}>Есть часы на выдачу, нажмите чтобы посмотреть</Text>
            </TouchableOpacity>
          </Animated.View>
        }
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container:{
    flex:1,
    alignItems:"center",
    justifyContent: "center",
    backgroundColor:"#16171D",
  },
  menu:{
    height:500,
    width:500,
    alignItems:"center",
    justifyContent: "center",
    rowGap:20,
  },
  button:{
    width:"40%",
    height:"18%"
  },
  logo:{
    height:100,
    width:100,
  },
  // --- КРАСИВАЯ КРУГЛАЯ КНОПКА ---
  deliveryIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 60,
    backgroundColor: "#e7df12ff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C0392B",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },

  deliveryIconButton: {
    width: "30%",
    height: "63%",
    borderRadius: 50,
    backgroundColor: "#E74C3C",
    alignItems: "center",
    justifyContent: "center",
  },
});
