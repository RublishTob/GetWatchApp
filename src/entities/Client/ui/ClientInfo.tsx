import {Client} from "@/entities";
import { View,StyleSheet, Text, ViewStyle, ViewProps } from "react-native";


interface ClientInfoProp extends ViewProps {
    item: Client
    isSelected:boolean
    style?:ViewStyle
}

export const ClientInfo = ({style,...props}: ClientInfoProp) => {
    return (
        <View style={style}>
            <Text style={[styles.text, props.isSelected && styles.selectedText]} adjustsFontSizeToFit numberOfLines={4}>
                {props.item.clientName} {props.item.lastname}
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    text: {
        color: "rgba(125, 189, 216, 0.87)",
        fontSize: 14,
        marginLeft: 10,
    },
    selectedText: {
        color: "rgba(170, 226, 249, 0.87)",
        fontSize: 16,
    },
});
