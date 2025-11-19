import { View, StyleSheet,TextInput, TextInputProps} from "react-native";
import { COLOR} from "@shared/constants/colors";
import { useState } from "react";


 export const CustomInput = ({ style = null, value, onChangeText, ...textInputProps}: TextInputProps) => {
        return (
            <View style={[styles.infoClient, style]}>
                <TextInput 
                    style={[styles.iput]} 
                    value={value} 
                    multiline 
                    scrollEnabled
                    numberOfLines={8} 
                    onChangeText={onChangeText} 
                    {...textInputProps} 
                />
            </View>
        );
    };
    const styles = StyleSheet.create({
        infoClient: {
            backgroundColor: COLOR.primary,
            flexDirection:"row",
        },
        iput: {
            backgroundColor: COLOR.secondary,
            width: '100%',
            height:'100%',
            borderRadius: 10,
            margin:5,
            textAlignVertical: 'center',
        },
    });
