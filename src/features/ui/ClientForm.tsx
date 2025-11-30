import { View, StyleSheet, ScrollView } from "react-native";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigationApp } from "@/features/model/useNavigationApp";
import { clientYupSchema } from "../model/client.yup.schema";

import Button from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { FormCheckBox } from "@/shared/ui/FormCheckBox";
import FormDatePicker from "@/shared/ui/FormDatePicker";
import { PhoneInput } from "@shared/ui/FormNumberOfPhone";

export interface ClientFormFields {
    clientName: string;
    lastname: string;
    numberOfPhone: string;
    price: string;
    nameOfWatch: string;
    reason: string;
    viewOfWatch: string;
    warrantyMonths: string;
    dateIn: Date;
    dateOut: Date;
    hasWarranty: boolean;
    accepted: boolean;
    isConflictClient: boolean;
}

interface Props {
    initialValues: ClientFormFields;
    onSubmit: (data: ClientFormFields) => void;
    onDelete?: () => void;
    submitText: string;
}

const ClientForm = ({ initialValues, onSubmit, onDelete, submitText }: Props) => {
    const navigation = useNavigationApp();

    // локальная логика подсчёта гарантии
    const calculateWarranty = (dateOut: Date, months: number): boolean => {
        if (!dateOut || !months) return false;

        const warrantyEnd = new Date(dateOut);
        warrantyEnd.setMonth(warrantyEnd.getMonth() + months);

        return new Date() <= warrantyEnd;
    };

    const { control, handleSubmit, reset, setValue, formState: { isValid, isSubmitting } } =
        useForm<ClientFormFields>({
            resolver: yupResolver(clientYupSchema),
            mode: "onChange",
            defaultValues: initialValues,
        });

    const dateOut = useWatch({ control, name: "dateOut" });
    const warrantyMonths = useWatch({ control, name: "warrantyMonths" });

    // пересчёт гарантии при изменении dateOut или warrantyMonths
    useEffect(() => {
        if (!dateOut || warrantyMonths === undefined || warrantyMonths === null) {
            setValue("hasWarranty", false, { shouldValidate: false });
            return;
        }

        const dateOutDate = new Date(dateOut);
        const monthsNum = Number(warrantyMonths);

        const has = calculateWarranty(dateOutDate, monthsNum);

        setValue("hasWarranty", has, { shouldValidate: false, shouldDirty: true });
    }, [dateOut, warrantyMonths]);

    // вычисление гарантии при первой загрузке
    useEffect(() => {
        const monthsNum = Number(initialValues.warrantyMonths ?? 0);
        const has = calculateWarranty(initialValues.dateOut ?? new Date(), monthsNum);
        setValue("hasWarranty", has, { shouldValidate: false, shouldDirty: false });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.containerClient}>
                <ScrollView>

                    <FormInput style={styles.form} control={control} name="clientName" label="Имя" placeholder="Введите имя" />
                    <FormInput style={styles.form} control={control} name="lastname" label="Фамилия" placeholder="Введите фамилию" />
                    <PhoneInput style={styles.form} control={control} name="numberOfPhone" label="Номер телефона" placeholder="Введите номер телефона" />
                    <FormInput style={styles.form} control={control} name="price" label="Цена" placeholder="Введите цену" />

                    <View style={{ flexDirection: "row", justifyContent: "flex-end", margin: 10 }}>
                        <FormCheckBox style={{ flexDirection: "row", alignItems: "center", margin: 10, columnGap: 10 }}
                            control={control} name="accepted" label="Принять в работу" />
                    </View>

                    <FormInput style={styles.form} control={control} name="nameOfWatch" label="Название часов" placeholder="Введите название часов" />
                    <FormInput style={styles.form} control={control} name="reason" label="Причина поломки" placeholder="Причина поломки" />
                    <FormInput style={styles.form} control={control} name="viewOfWatch" label="Внешний вид" placeholder="Опишите" />
                    <FormInput style={styles.form} control={control} name="warrantyMonths" label="Гарантия(мес)" placeholder="Гарантия" />

                    <View style={{ flexDirection: "row", justifyContent: "flex-end", margin: 10 }}>
                        <FormCheckBox style={{ flexDirection: "row", alignItems: "center", margin: 10, columnGap: 10 }}
                            backgroundColor="red" control={control} name="isConflictClient" label="Конфликтный" />
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "flex-end", margin: 10 }}>
                        <FormCheckBox style={{ flexDirection: "row", alignItems: "center", margin: 10, columnGap: 10 }}
                            backgroundColor="green" disabled={true} control={control} name="hasWarranty" label="Есть гарантия" />
                    </View>

                    <FormDatePicker style={styles.form} control={control} name="dateIn" label="Дата приемки" />
                    <FormDatePicker style={styles.form} control={control} name="dateOut" label="Дата выдачи" />

                    {onDelete && <Button text="Удалить" colorButton="#721414ff" onPress={onDelete} />}

                </ScrollView>
            </View>

            <View style={styles.menu}>
                <View style={{ rowGap: 15 }}>
                    <Button style={{ width: "100%", height: "40%" }} fontSizeText={12}
                        text="Все клиенты" onPress={() => navigation.navigate("AllClients")} />
                    <Button style={{ width: "100%", height: "40%" }} fontSizeText={12}
                        text="Меню" onPress={() => navigation.navigate("Home")} />
                </View>

                <Button style={styles.roundedButton} text="Сброс" onPress={() => reset(initialValues)} />

                <Button
                    style={styles.button}
                    text={submitText}
                    colorText="white"
                    colorButton="#116a86ff"
                    onPress={handleSubmit(onSubmit)}
                    disabled={!isValid || isSubmitting}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#2E2D3D",
    },
    form: {
        margin: 10,
    },
    menu: {
        flexDirection: "row",
        alignItems: "flex-start",
        paddingBottom: 20,
        paddingTop: 20,
        justifyContent: "center",
        backgroundColor: "#16171D",
        borderTopWidth: 1,
        borderTopColor: "#48465eff",
        height: "25%",
        gap: 20,
    },
    containerClient: {
        columnGap: 5,
        height: "75%",
        backgroundColor: "#16171D",
    },
    button: {
        width: "27%",
        height: "32%",
    },
    roundedButton: {
        width: "18%",
        height: "40%",
        borderRadius: 60,
        backgroundColor: "rgba(103, 147, 165, 0.87)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#f31800ff",
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
    },
});

export default ClientForm;