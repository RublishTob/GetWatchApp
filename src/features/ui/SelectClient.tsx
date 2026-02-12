import { View, TouchableOpacity,StyleSheet, ViewStyle} from "react-native";
import {useEffect, useState, useCallback} from "react";
import {Client} from "@/entities";
import Button from "@/shared/ui/Button";
import {ClientInfo} from "@/entities/Client";
import { Checkbox, ModernCheckboxProps } from "@shared/ui/CheckBox";
import { Text } from "react-native-paper";

interface SelectClientProp{
    item: Client,
    handlePress?:(id:number)=>void,
    changeAcceptedStatus?:(id:number, accepted:boolean)=>void,
    pressToShowInfo?:()=>void,
    selectId?:number|null,
    style?:ViewStyle
}

export const SelectClient = ({selectId = null, handlePress: pressShowHighlight, pressToShowInfo, changeAcceptedStatus,  item, style}:SelectClientProp) =>{

        const [isSelected,setSelected] = useState(false);

        useEffect(()=>{

            if(selectId == null)
                {setSelected(false);}

            if (item.id === selectId)
            {
                setSelected(true);
            }
            else{
                setSelected(false);
            }

        },[selectId, item.id]);

        const onHandlePress = useCallback(() => {
                pressShowHighlight?.(item.id);
        },[item, pressShowHighlight]);

        const onHandlePressAccepted = useCallback((accepted:boolean) => {
                changeAcceptedStatus?.(item.id, accepted);
        },[]);

        return (
                <TouchableOpacity onPress={onHandlePress} style={[styles.infoClient, style, isSelected && styles.selectedInfoClient]}>
                    <ClientInfo style={{width:"35%"}} item={item} isSelected = {isSelected}/>
                    {isSelected && (
                        <View style={{width:"65%", alignItems:"center", justifyContent:"center", columnGap:5, flexDirection:"row"}}>
                            <Button style={{width:"40%", height:"40%"}} onPress={pressToShowInfo} text="открыть" colorButton="#116a86ff" colorText="white"/>
                            <View style={{width:"35%", height:"100%", flexDirection:"column" }}>
                                <Checkbox size = "50%" value = {item.accepted} disabled={false} onValueChange={onHandlePressAccepted}/>
                                <Text style={{color:"white", fontSize:8, textAlign:"center"}}>принят в работу</Text>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
        );
    };

const styles = StyleSheet.create({
    infoClient: {
        backgroundColor: "#16171D",
        borderBottomWidth: 1,
        borderBottomColor: "#48465eff",
        flexDirection: "row",
    },
    selectedInfoClient: {
        backgroundColor: "#4c5271ff",
        columnGap:20,
        padding:10
    },
});
