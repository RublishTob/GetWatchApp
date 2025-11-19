import { View, StyleSheet, Text } from "react-native";
import { CustomInput } from "@/shared";
import Button from "@/shared/ui/Button"
import { COLOR } from "@/shared/constants/colors"
import { useDispatch } from "react-redux";
import { setSearchQuery} from "@/features/model/searchClient/slices/searchClientsSlice";

export const SearchClientsFeature = () => {
    const dispatch = useDispatch();
return(
    <View style={{ flexDirection: 'row', columnGap:10, paddingLeft:10, paddingRight:10, width:'100%', height:'10%', backgroundColor: COLOR.primary, alignItems: "center", justifyContent: "center" }}>
        <CustomInput onChangeText={(text)=>dispatch(setSearchQuery(text))} style={{width:"70%"}} />
        <Button text="Поиск" style={{width:"30%" }} />
    </View>
)
}
