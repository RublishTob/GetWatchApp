import {Controller, Control, FieldValues, RegisterOptions, Path} from "react-hook-form";
import {Text, View, StyleProp, ViewStyle} from "react-native";
import DatePicker from "./DatePicker";
import {COLOR} from "@shared/constants/colors"
import { ModernDatePickerProps } from "@shared/ui/DatePicker"

interface FormInputPorps <T extends FieldValues> extends ModernDatePickerProps{
    control: Control<T>,
    name:Path<T>,
    label?:string,
    style?:StyleProp<ViewStyle>
    rules?:RegisterOptions<T, Path<T>>
}


const FormDatePicker = <T extends FieldValues>({ style = null, control, label, rules, name, ...datePickerProps}:FormInputPorps<T>) => {
    return (
        <Controller name={name} control={control} rules={rules} render={({ field: { onChange, value }, fieldState: { error } }) => (
            <View style={style}>
                {error && (<Text style={[{color:"red"},style]}>{error?.message}</Text>)}
                {label && <Text style={{color:COLOR.mainTextColor}}>{label}</Text>}
                <DatePicker value={value} onChange={onChange} {...datePickerProps}/>
            </View>
        )}/>

    );
};
export default FormDatePicker
