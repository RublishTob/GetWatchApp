import { View, StyleSheet,ScrollView,Alert } from "react-native";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import Button from "@/shared/ui/Button";
import { addClientLocal } from "@/entities/Client/model/slice";
import { useDateConverter } from "@shared/hooks/useDataConverter";
import { FormInput } from "@/shared/ui/FormInput";
import { clientYupSchema } from "@features/model/client.yup.schema";
import { useNavigationApp } from "@/features/hooks/useNavigationApp";
import { FormCheckBox } from "@/shared/ui/FormCheckBox";
import FormDatePicker from "@shared/ui/FormDatePicker";
import { yupResolver } from '@hookform/resolvers/yup';


interface FormProp {
    clientName:string,
    lastname:string,
    numberOfPhone:string,
    price:number,
    nameOfWatch:string,
    reason:string,
    viewOfWatch:string,
    warrantyMonths:number,
    dateIn:Date,
    dateOut:Date
    hasWarranty:boolean
    accepted:boolean,
    isConflictClient:boolean,
}

const EditClientWidget = () => {

    const { toTimestamp} = useDateConverter();

    const dispatch = useDispatch();
    const navigation = useNavigationApp();

    const { control, handleSubmit, reset, formState: { isValid, isSubmitting } } = useForm<FormProp>({
        resolver:yupResolver(clientYupSchema),
        mode: "onChange",
        defaultValues: {
            clientName: "",
            lastname: "",
            numberOfPhone: "",
            price: 0,
            nameOfWatch: "",
            reason: "",
            viewOfWatch: "",
            warrantyMonths: 0,
            dateIn: new Date(),
            dateOut: new Date(),
            accepted: false,
            isConflictClient: false,
            hasWarranty:false,
        },
    });
    const client:FormProp={
            clientName: "Дима",
            lastname: "Шестопалов",
            numberOfPhone: "89025345947",
            price: 40,
            nameOfWatch: "333",
            reason: "333",
            viewOfWatch: "3333",
            warrantyMonths: 4,
            dateIn: new Date(),
            dateOut: new Date(),
            accepted: false,
            isConflictClient: false,
            hasWarranty:true,
    }
    const client1:FormProp={
            clientName: "Вова",
            lastname: "Тяпкин",
            numberOfPhone: "89035345947",
            price: 40,
            nameOfWatch: "333",
            reason: "333",
            viewOfWatch: "3333",
            warrantyMonths: 4,
            dateIn: new Date(),
            dateOut: new Date(),
            accepted: true,
            isConflictClient: false,
            hasWarranty:false,
    }
    const client2:FormProp={
            clientName: "Вика",
            lastname: "Глухова",
            numberOfPhone: "89245345947",
            price: 40,
            nameOfWatch: "333",
            reason: "333",
            viewOfWatch: "3333",
            warrantyMonths: 4,
            dateIn: new Date(),
            dateOut: new Date(),
            accepted: false,
            isConflictClient: true,
            hasWarranty:false,
    }

    const addClientToStore = (data: FormProp) =>{
        const {dateIn, dateOut, clientName, lastname, ...rest} = data;

        const newClient = {
            id:Date.now(),
            clientName:clientName,
            lastname:lastname,
            dateIn: toTimestamp(dateIn),
            dateOut: toTimestamp(dateOut),
            ...rest};

        dispatch(addClientLocal(newClient));
        Alert.alert("Клиент создан", `${data.clientName} ${data.lastname}`);
        reset();
    };
    
    useEffect(()=>{
        addClientToStore(client);
        addClientToStore(client1);
        addClientToStore(client2);
    },[])

    return (
        <View style={styles.container}>

            <View style={styles.containerClient}>
                <ScrollView>
                    <FormInput style={styles.form} control={control} name={"clientName"} placeholder={"Введите имя"} label={"Имя"}/>
                    <FormInput style={styles.form} control={control} name={"lastname"} placeholder={"Введите фамилию"} label={"Фамилия"}/>
                    <FormInput style={styles.form} control={control} name={"numberOfPhone"} placeholder={"Номер телефона"} label={"Номер телефона"}/>
                    <FormInput style={styles.form} control={control} name={"price"} placeholder={"Цена"} label={"Цена"}/>
                    <FormInput style={styles.form} control={control} name={"nameOfWatch"} placeholder={"Название часов"} label={"Название часов"}/>
                    <FormInput style={styles.form} control={control} name={"reason"} placeholder={"Причина поломки"} label={"Причина поломки"}/>
                    <FormInput style={styles.form} control={control} name={"viewOfWatch"} placeholder={"Внешний вид часов"} label={"Внешний вид часов"}/>
                    <FormInput style={styles.form} control={control} name={"warrantyMonths"} placeholder={"Гарантия(мес)"} label={"Гарантия(мес)"}/>
                    <FormCheckBox style={styles.form} control={control} name={"accepted"} label={"Принять в работу"}/>
                    <FormCheckBox style={styles.form} control={control} name={"isConflictClient"} label={"Конфликтный клиент"}/>
                    <FormCheckBox style={styles.form} control={control} name={"hasWarranty" }label={"Есть гарантия"}/>
                    <FormDatePicker style={styles.form} control={control} name={"dateIn"} label={"Дата приемки"}/>
                    <FormDatePicker style={styles.form} control={control} name={"dateOut"}label={"Дата выдачи"}/>
                </ScrollView>
            </View>
            <View style={styles.menu}>
                <Button style={styles.button} fontSizeText={12} text="Все клиенты" onPress={() => navigation.navigate("AllClients")}/>
                <Button style={styles.button} fontSizeText={12} text="Сброс" onPress={()=> reset()}/>
                <Button style={styles.button} fontSizeText={12} text="Ок" onPress={handleSubmit(addClientToStore)} colorText="white" colorButton="#116a86ff" disabled={isSubmitting || !isValid} />
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
        margin: 10
    },
    menu: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#16171D",
        borderTopWidth: 1,
        borderTopColor: "#48465eff",
        height: "20%",
        gap: 20,
    },
    containerClient: {
        columnGap: 5,
        height: "80%",
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

export default EditClientWidget