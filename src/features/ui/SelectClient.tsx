import { View, TouchableOpacity,StyleSheet, ViewStyle} from "react-native";
import {useEffect, useState, useCallback} from "react";
import {Client} from "@/entities";
import Button from "@/shared/ui/Button";
import {ClientInfo} from "@/entities/Client";

interface SelectClientProp{
    item: Client,
    handlePress?:(id:number)=>void,
    pressToShowInfo?:()=>void,
    selectId?:number|null,
    style?:ViewStyle
}

export const SelectClient = ({selectId = null, handlePress: pressShowHighlight, pressToShowInfo,  item, style}:SelectClientProp) =>{

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

        return (
                <TouchableOpacity onPress={onHandlePress} style={[styles.infoClient, style, isSelected && styles.selectedInfoClient]}>
                    <ClientInfo style={{width:"50%"}} item={item} isSelected = {isSelected}/>
                    {isSelected && (
                            <Button style={{width:"30%", height:"50%"}} onPress={pressToShowInfo} text="открыть" colorButton="#116a86ff" colorText="white"/>
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
