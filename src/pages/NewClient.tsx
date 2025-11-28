import { useDispatch } from "react-redux";
import ClientForm, { ClientFormFields } from "@features/ui/ClientForm";
import { addClientLocal, createOneClient } from "@/entities/Client/model/slice";
import { useDateConverter } from "@shared/hooks/useDataConverter";
import { Alert } from "react-native"
import { useAppDispatch, useAppSelector } from "@/app/store/hook";

const defaultValues: ClientFormFields = {
    clientName: "",
    lastname: "",
    numberOfPhone: "",
    price: "",
    nameOfWatch: "",
    reason: "",
    viewOfWatch: "",
    warrantyMonths: "",
    dateIn: new Date(),
    dateOut: new Date(),
    hasWarranty: false,
    accepted: false,
    isConflictClient: false,
};

export default function CreateClientScreen() {
    const dispatch = useAppDispatch();
    const { toTimestamp } = useDateConverter();

    const handleCreate = (data: ClientFormFields) => {
        dispatch(createOneClient({
            id: Date.now(),
            ...data,
            warrantyMonths: Number(data.warrantyMonths || 0), 
            price: Number(data.warrantyMonths || 0), 
            dateIn: toTimestamp(data.dateIn),
            dateOut: toTimestamp(data.dateOut),
        }));
        Alert.alert("Клиент создан", `${data.clientName} ${data.lastname}`);
    };

    return (
        <ClientForm
            initialValues={defaultValues}
            onSubmit={handleCreate}
            submitText="Создать"
        />
    );
}
