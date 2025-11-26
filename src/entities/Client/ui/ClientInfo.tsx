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
            <Text style={[styles.text, props.isSelected && styles.selectedText]} numberOfLines={4}>
                {props.item.clientName} {'\n'} {props.item.lastname} {'\n'} {props.item.numberOfPhone} {'\n'} {props.item.nameOfWatch}
            </Text>
        </View>
    );
};
const styles = StyleSheet.create({
    text: {
        color: "rgba(125, 189, 216, 0.87)",
        fontSize: 14,
    },
    selectedText: {
        color: "rgba(170, 226, 249, 0.87)",
        fontSize: 16,
    },
});
