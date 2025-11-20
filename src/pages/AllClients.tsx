import { ClientListWidget } from "@/widgets";
import { useState,useEffect, useRef } from "react"
import { useScreen } from "@/shared/hooks/useScreenSize";
import { View, Alert } from "react-native";
import Button from "@/shared/ui/Button"
import { useDispatch } from "react-redux";
import { COLOR } from "@/shared/constants/colors"
import { SearchClientsFeature } from "@/features/ui/SearchClientsFeature"
import { FilterClientsFeature } from "@/features/ui/FilterClientsFeature"
import { resetFilters } from "@/features/model/filterClients/slices/filterClientsSlice";
import { useNavigationApp } from "@features/model/useNavigationApp";

export const AllClients = () => {
    const { width, height } = useScreen();
    const [showFilters, setShowFilters] = useState(false);
    const dispatch = useDispatch();
    const navigator = useNavigationApp();

    useEffect(() => {
        return () => { dispatch(resetFilters()) }
    }, [])

    return (
        <View style={{ height: height, width: width }}>
            <SearchClientsFeature />
            <ClientListWidget width={width} height={height * 0.7} />
            <View style={{ flexDirection: 'row', width: width, height: height * 0.2, paddingRight: 30, paddingLeft: 30, columnGap:20, backgroundColor: COLOR.primary, alignItems: "center", justifyContent: "center", borderTopWidth: 1, borderTopColor: "#48465eff" }}>
                <Button text="Меню" style={{ width: 70, height: 40 }} onPress={()=>navigator.navigate("Home")}/>
                <Button text="Фильтр" style={{ width: 70, height: 40 }} onPress={() => setShowFilters((prev) => !prev)} />
            </View>
            <FilterClientsFeature showFilters={showFilters} />
        </View>
    );
};


export default AllClients;
