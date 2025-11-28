import {Controller, Control, FieldValues, RegisterOptions, Path} from "react-hook-form";
import {Text, View, ViewStyle, StyleProp} from "react-native";
import { Checkbox, ModernCheckboxProps } from "@shared/ui/CheckBox";
import {COLOR} from "@shared/constants/colors"

interface FormInputPorps <T extends FieldValues> extends ModernCheckboxProps{
    control: Control<T>,
    name:Path<T>,
    label?:string,
    rules?:RegisterOptions<T, Path<T>>
    style?:StyleProp<ViewStyle>
    backgroundColor?:string;
}


export const FormCheckBox = <T extends FieldValues>({ style = null, control, label, rules, name, backgroundColor, ...checkBoxProps}:FormInputPorps<T>) => {
    return (
        <Controller name={name} control={control} rules={rules} render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={[style]}>
                {error && (<Text style={[{color:"red"},style]}>{error?.message}</Text>)}
                {label && <Text style={{color:COLOR.mainTextColor, marginLeft:10, marginBottom:10}}>{label}</Text>}
                <Checkbox value = {value} color={backgroundColor} onValueChange={onChange}{...checkBoxProps}/>
            </View>
        )}/>

    );
};
