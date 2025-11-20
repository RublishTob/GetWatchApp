import { useDispatch } from "react-redux";
import ClientForm, { ClientFormFields } from "@features/ui/ClientForm";
import { addClientLocal } from "@/entities/Client/model/slice";
import { useDateConverter } from "@shared/hooks/useDataConverter";
import { Alert } from "react-native"

const defaultValues: ClientFormFields = {
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
    hasWarranty: false,
    accepted: false,
    isConflictClient: false,
};

export default function CreateClientScreen() {
    const dispatch = useDispatch();
    const { toTimestamp } = useDateConverter();

    const handleCreate = (data: ClientFormFields) => {
        dispatch(addClientLocal({
            id: Date.now(),
            ...data,
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
