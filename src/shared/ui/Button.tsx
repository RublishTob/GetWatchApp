import {GestureResponderEvent, Text, StyleSheet, TouchableOpacity,ViewStyle, DimensionValue, Image} from "react-native";
import React, {} from "react";

interface ButtonProp{
    onPress?: (event: GestureResponderEvent) => void;
    text?:string,
    disabled?:boolean,
    style?:ViewStyle,
    widthPercent?: DimensionValue;
    heightPercent?: DimensionValue;
    colorButton?: string,
    colorText?: string,
    fontSizeText?:number
    pathToImage?:string
}

const Button = (
    {
        style,
        text,
        colorButton = "#48465eff",
        fontSizeText = 20,
        colorText = "#89c8e2ff",
        onPress,
        widthPercent,
        heightPercent,
        disabled = false,
        pathToImage =""
    }: ButtonProp,

) => {
    return(
            <TouchableOpacity style = {[styles.button,{backgroundColor:disabled ? "#15141cff" : colorButton}, 
            widthPercent ? { width: widthPercent } : {}, 
            heightPercent ? { height: heightPercent }: {}, 
            style]} onPress={disabled ? undefined : onPress}>
                        <Text 
                        style = {{fontSize:fontSizeText,color:colorText}}
                        adjustsFontSizeToFit
                        numberOfLines={1}>
                            {text}
                        </Text>
            </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    button:{
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
    },
});

export default Button;
