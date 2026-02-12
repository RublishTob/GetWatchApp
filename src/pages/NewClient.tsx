import { Alert } from "react-native";
import ClientForm, { ClientFormFields } from "@/widgets/ClientForm";
import { createOneClient } from "@/entities/Client/model/slice";
import { useAppDispatch } from "@/app/store/hook";
import { useDateConverter } from "@shared/hooks/useDataConverter";

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
    hasWarranty: false, // auto
    accepted: false,
    isConflictClient: false,
};

export default function CreateClientScreen() {
    const dispatch = useAppDispatch();
    const { toTimestamp } = useDateConverter();

    const handleCreate = (data: ClientFormFields) => {
        const payload = {
            ...data,
            price: Number(data.price),
            warrantyMonths: Number(data.warrantyMonths),
            dateIn: toTimestamp(data.dateIn),
            dateOut: toTimestamp(data.dateOut),
        };

        dispatch(createOneClient(payload));

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
