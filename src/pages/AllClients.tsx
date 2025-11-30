import { ClientListWidget } from "@/widgets";
import { useState,useEffect, useRef } from "react"
import { useScreen } from "@/shared/hooks/useScreenSize";
import { View, Alert } from "react-native";
import Button from "@/shared/ui/Button"
import { useCallback } from "react";
import { COLOR } from "@/shared/constants/colors"
import { SearchClientsFeature } from "@/features/ui/SearchClientsFeature"
import { FilterClientsFeature } from "@/features/ui/FilterClientsFeature"
import { resetAllFilters } from "@/features/model/filterClients/slices/filterClientsSlice";
import { setSearchQuery } from "@features/model/searchClient/slices/searchClientsSlice"
import { useNavigationApp } from "@features/model/useNavigationApp";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { toggleOnDelivery } from "@/features/model/filterClients/slices/filterClientsSlice";

export const AllClients = () => {
    const { width, height } = useScreen();
    const [showFilters, setShowFilters] = useState(false);
    const dispatch = useAppDispatch();
    const navigator = useNavigationApp();

    const route = useRoute();
    const presetFilter = (route.params as any)?.presetFilter || null;

    useFocusEffect(
        useCallback(() => {
            if (presetFilter === "onDelivery") {
                dispatch(toggleOnDelivery());
                dispatch(setSearchQuery(""));
            } else {
                // обычный вход → всё сбрасываем
                dispatch(resetAllFilters());
                dispatch(setSearchQuery(""));
                setShowFilters(false);
            }

            return () => {dispatch(resetAllFilters());};
        }, [presetFilter])
    );

    return (
        <View style={{ height: height, width: width }}>
            <SearchClientsFeature />
            <ClientListWidget width={width} height={height * 0.7} />
            <View style={{ flexDirection: 'row', width: width, height: height * 0.3, paddingRight: 30, paddingLeft: 30, paddingTop: 10, columnGap:20, backgroundColor: COLOR.primary, alignItems: "flex-start", justifyContent: "center", borderTopWidth: 1, borderTopColor: "#48465eff" }}>
                <Button text="Меню" style={{ width: "30%", height: "34%" }} onPress={()=>navigator.navigate("Home")}/>
                <Button text="Создать клиента" style={{ width: "30%", height: "34%" }} onPress={()=>navigator.navigate("NewClient")}/>
                <Button text="Фильтр" style={{ width: "30%", height: "34%" }} onPress={() => setShowFilters((prev) => !prev)} />
            </View>
            <FilterClientsFeature showFilters={showFilters} />
        </View>
    );
};


export default AllClients;
