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
        fontSizeText = 10,
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
                    active&&{ opacity: 0.2 }
                ]} 
                onPress={onPress}>
                <Image style={{width:"100%", height:"100%"}} source={pathToImage}></Image>
                {text?.trim() && <Text style = {{fontSize:fontSizeText,color:colorText, marginTop:5}} adjustsFontSizeToFit numberOfLines={1}>{text}</Text>}
            </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    button:{
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding:2,
        rowGap:5,
    },
});

export default IconFilter;