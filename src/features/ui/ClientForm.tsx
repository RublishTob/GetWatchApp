import { View, StyleSheet, ScrollView } from "react-native";
import { useEffect } from "react"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigationApp } from "@/features/model/useNavigationApp";
import { clientYupSchema } from "../model/client.yup.schema";
import Button from "@/shared/ui/Button";
import { FormInput } from "@/shared/ui/FormInput";
import { FormCheckBox } from "@/shared/ui/FormCheckBox";
import FormDatePicker from "@/shared/ui/FormDatePicker";
import {PhoneInput} from "@shared/ui/FormNumberOfPhone"

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

const ClientForm = ({ initialValues, onSubmit,  onDelete, submitText }: Props) => {
    const navigation = useNavigationApp();

    const { control, handleSubmit, reset, formState: { isValid, isSubmitting } } =
        useForm<ClientFormFields>({
            resolver: yupResolver(clientYupSchema),
            mode: "onChange",
            defaultValues: initialValues,
        });

    return (
        <View style={styles.container}>
            <View style={styles.containerClient}>
                <ScrollView>
                    
                    <FormInput style={styles.form} control={control} name="clientName" label="Имя" placeholder="Введите имя" />
                    <FormInput style={styles.form} control={control} name="lastname" label="Фамилия" placeholder="Введите фамилию" />
                    <PhoneInput style={styles.form} control={control} name="numberOfPhone" label="Номер телефона" placeholder="Введите номер телефона" />
                    <FormInput style={styles.form} control={control} name="price" label="Цена" placeholder="Введите цену" />
                    <View style={{flexDirection: "row", justifyContent:"flex-end", margin:10}}>
                        <FormCheckBox style={{flexDirection: "row", justifyContent:"flex-end", margin:10, alignItems:"center", columnGap:10}} control={control} name="accepted" label="Принять в работу" />
                    </View>
                    <FormInput style={styles.form} control={control} name="nameOfWatch" label="Название часов" placeholder="Введите название часов" />
                    <FormInput style={styles.form} control={control} name="reason" label="Причина поломки" placeholder="Причина поломки" />
                    <FormInput style={styles.form} control={control} name="viewOfWatch" label="Внешний вид" placeholder="Опишите" />
                    <FormInput style={styles.form} control={control} name="warrantyMonths" label="Гарантия(мес)" placeholder="Гарантия" />

                    <View style={{flexDirection: "row", justifyContent:"flex-end", margin:10}}>
                        <FormCheckBox style={{flexDirection: "row", justifyContent:"flex-end", margin:10, alignItems:"center", columnGap:10}} control={control} name="isConflictClient" label="Конфликтный" />
                    </View>
                    <View style={{flexDirection: "row", justifyContent:"flex-end", margin:10}}>
                        <FormCheckBox style={{flexDirection: "row", justifyContent:"flex-end", margin:10, alignItems:"center", columnGap:10}} control={control} name="hasWarranty" label="Есть гарантия" />
                    </View>

                    <FormDatePicker style={styles.form} control={control} name="dateIn" label="Дата приемки" />
                    <FormDatePicker style={styles.form} control={control} name="dateOut" label="Дата выдачи" />

                    {onDelete && <Button text="Удалить" colorButton="#721414ff" onPress={onDelete}/>}
                </ScrollView>
            </View>

            <View style={styles.menu}>
                    <View style={{rowGap:15}}>
                        <Button style={{width:"100%", height:"40%"}}  fontSizeText={12} text="Все клиенты" onPress={() => navigation.navigate("AllClients")}/>
                        <Button style={{width:"100%", height:"40%"}} fontSizeText={12} text="Меню" onPress={() => navigation.navigate("Home")}/>
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
        paddingBottom:20,
        paddingTop:20,
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
    text: {
        fontSize:16,
        color: "rgba(125, 189, 216, 0.87)",
    },
    button: {
        width:'27%',
        height:'32%',
        color: "rgba(255, 137, 41, 0.87)",
    },
    roundedButton: {
        width:'18%',
        height:'40%',
        borderRadius: 60,
        backgroundColor: "rgba(103, 147, 165, 0.87)",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#f31800ff",
        shadowOpacity: 0.8,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 0 },
    },
    infoClient: {
        backgroundColor: "#16171D",
        gap: 10,
        margin: 10,
    },
    iput: {
        backgroundColor: "#48465eff",
        height: 40,
        borderRadius: 10,
    },
});

export default ClientForm;