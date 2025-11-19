import {Controller, Control, FieldValues, RegisterOptions, Path} from "react-hook-form";
import {TextInputProps, Text, View, StyleSheet, ViewStyle, StyleProp} from "react-native";
import { CustomInput } from "@/shared/ui/CustomInput";
import { useState } from "react";
import {COLOR} from "@shared/constants/colors"

interface FormInputPorps <T extends FieldValues> extends TextInputProps{
    style:StyleProp<ViewStyle>,
    control: Control<T>,
    name:Path<T>,
    label?:string,
    rules?:RegisterOptions<T, Path<T>>
}


export const FormInput = <T extends FieldValues>({control, style, label, rules, name, ...textInputProps}:FormInputPorps<T>) => {
    return (
        <Controller name={name} control={control} rules={rules} render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View style={style}>
                {error && (<Text style={[{color:"red"},style]}>{error?.message}</Text>)}
                {label && <Text style={{color:COLOR.mainTextColor}}>{label}</Text>}
                <CustomInput 
                    onChangeText={onChange} 
                    value={value?.toString() ?? ""} 
                    onBlur={onBlur} {...textInputProps}/>
            </View>
        )}/>

    );
};

