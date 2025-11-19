import { View, StyleSheet, Text } from "react-native";
import IconFilter from "@/shared/ui/IconFilter";
import { COLOR } from "@/shared/constants/colors"
import { useDispatch } from "react-redux";
import { toggleConflict, toggleAccepted, toggleWarranty, toggleOnDelivery} from "@/features/model/filterClients/slices/filterClientsSlice";
import { useSelector } from "react-redux";

interface FilterProp{
    showFilters: boolean
}

export const FilterClientsFeature = ({showFilters}: FilterProp) => {
    const dispatch = useDispatch();
    const { conflictOnly, acceptedOnly, warrantyOnly, onDeliveryOnly } =
    useSelector((state: any) => state.filterClients);

    if (!showFilters) {
        return null;
    }

    return (
        <View style={{ flexDirection: "row", width:"100%", height:'20%', bottom:"20%", position: "absolute", columnGap: 5, backgroundColor: COLOR.primary, alignItems: "center", justifyContent: "center", borderTopWidth: 1, borderTopColor: "#48465eff" }}>
            <IconFilter onPress={()=>dispatch(toggleConflict())} active={conflictOnly} text="Конфликтный" style={styles.Icon} pathToImage={require("D:/GetWatchApp/recourses/icons/IsConflict.png")} />
            <IconFilter onPress={()=>dispatch(toggleWarranty())} active={warrantyOnly} text="Есть гарантия" style={styles.Icon} pathToImage={require("D:/GetWatchApp/recourses/icons/HasWarranty.png")} />
            <IconFilter onPress={()=>dispatch(toggleAccepted())} active={acceptedOnly} text="В работе" style={styles.Icon} pathToImage={require("D:/GetWatchApp/recourses/icons/Accept.png")} />
            <IconFilter onPress={()=>dispatch(toggleOnDelivery())} active={onDeliveryOnly} text="На выдачу" style={styles.Icon} pathToImage={require("D:/GetWatchApp/recourses/icons/Accept.png")} />
        </View>
    )
}

const styles = StyleSheet.create({
    Icon:{
        width:"20%",
        height:"49%",
        alignItems: "center",
        justifyContent: "center"
    },
});