import { View, StyleSheet, Text, StyleProp, ViewStyle } from "react-native";
import { CustomInput } from "@/shared";
import Button from "@/shared/ui/Button"
import { COLOR } from "@/shared/constants/colors"
import { useDispatch } from "react-redux";
import { setSearchQuery} from "@/features/model/searchClient/slices/searchClientsSlice";

interface SearchClientsPorps{
    style: StyleProp<ViewStyle>,
}

export const SearchClientsFeature = ({ style }:SearchClientsPorps) => {
    const dispatch = useDispatch();
return(
    <View style={[style,{ flexDirection: 'row', columnGap:10, backgroundColor: COLOR.primary, alignItems: "center", justifyContent: "center" }]}>
        <CustomInput onChangeText={(text)=>dispatch(setSearchQuery(text))} style={{width:"100%", height:"80%"}} placeholder="Найти клиента" />
    </View>
)
}
