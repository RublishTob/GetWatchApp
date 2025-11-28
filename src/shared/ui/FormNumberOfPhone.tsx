import React from "react";
import { TextInput } from "react-native";
import { phoneMask } from "@shared/libs/phoneMask";
import { Controller, Control, FieldValues, RegisterOptions, Path } from "react-hook-form";
import { TextInputProps, Text, View, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { COLOR } from "@shared/constants/colors"
import { CustomInput } from "@/shared/ui/CustomInput";

interface FormPhoneInputPorps<T extends FieldValues> extends TextInputProps {
    style: StyleProp<ViewStyle>,
    control: Control<T>,
    name: Path<T>,
    label?: string,
    rules?: RegisterOptions<T, Path<T>>
}

export const PhoneInput = <T extends FieldValues>({ control, style, label, rules, name, ...textInputProps }: FormPhoneInputPorps<T>) => {
    return (
        <Controller name={name} control={control} rules={rules} render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
            <View style={style}>
                {error && (<Text style={[{ color: "red" }, style]}>{error?.message}</Text>)}
                {label && <Text style={{ color: COLOR.mainTextColor }}>{label}</Text>}

                <CustomInput
                    keyboardType="phone-pad"
                    onChangeText={(text) => {
                        const digits = text.replace(/\D/g, "");
                        onChange(digits); // в форме храним только цифры
                    }}
                    value={phoneMask(value)}
                    onBlur={onBlur} {...textInputProps} />
            </View>

        )}
        />
    );
};