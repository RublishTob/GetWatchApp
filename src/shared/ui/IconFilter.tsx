import {GestureResponderEvent, Text, StyleSheet, TouchableOpacity,ViewStyle, DimensionValue, Image, ImageStyle} from "react-native";
import React, {} from "react";

interface IconFilterProp{
    onPress?: (event: GestureResponderEvent) => void;
    text?:string,
    disabled?:boolean,
    style?:ImageStyle,
    widthPercent?: DimensionValue;
    heightPercent?: DimensionValue;
    colorButton?: string,
    colorText?: string,
    fontSizeText?:number
    pathToImage?:any
    active?:boolean
}

const IconFilter = (
    {
        style,
        text,
        colorButton = "#48465eff",
        active,
        fontSizeText = 8,
        colorText = "#89c8e2ff",
        onPress,
        pathToImage
    }: IconFilterProp,

) => {

    return(
            <TouchableOpacity 
            style={[
                    styles.button, 
                    style,
                    active&&{ opacity: 1 }
                ]} 
                onPress={onPress}>
                <Image style={{width:"90%", height:"100%", aspectRatio: 1}} source={pathToImage}></Image>
                {text?.trim() && <Text style = {{fontSize:fontSizeText,color:colorText, marginTop:5}} numberOfLines={2}>{text}</Text>}
            </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    button:{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        rowGap:5,
        width:"90%", 
        height:"100%",
        opacity: 0.6
    },
});

export default IconFilter;