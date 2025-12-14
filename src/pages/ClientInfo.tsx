import { View, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import ClientForm, { ClientFormFields } from "@features/ui/ClientForm";
import { selectSelectedClient, selectselectedClientId } from "@/entities/Client/model/selectors";
import { updateClientPartial, deleteOneClient } from "@/entities/Client/model/slice";
import { useDateConverter } from "@shared/hooks/useDataConverter";
import { useNavigationApp } from "@/features/hooks/useNavigationApp";

export default function ClientInfo() {
    const dispatch = useAppDispatch();
    const navigation = useNavigationApp();
    const { toTimestamp, fromTimestamp } = useDateConverter();

    const selectedClient = useAppSelector(selectSelectedClient);
    const selectedId = useAppSelector(selectselectedClientId);

    if (!selectedClient) {
        return (
            <View>
                <Text>Нет информации</Text>
            </View>
        );
    }
    const dateIn = new Date(fromTimestamp(selectedClient.dateIn));
    const dateOut = new Date(fromTimestamp(selectedClient.dateOut));

    const handleUpdate = (data: ClientFormFields) => {
        dispatch(
            updateClientPartial({
                id: selectedId as number,

                clientName: data.clientName,
                lastname: data.lastname,
                numberOfPhone: data.numberOfPhone,

                price: Number(data.price),
                warrantyMonths: Number(data.warrantyMonths),

                nameOfWatch: data.nameOfWatch,
                viewOfWatch: data.viewOfWatch,
                reason: data.reason,

                dateIn: toTimestamp(data.dateIn),
                dateOut: toTimestamp(data.dateOut),

                accepted: data.accepted,
                isConflictClient: data.isConflictClient,

            })
        );

        navigation.navigate("AllClients");
    };

    const handleDelete = () => {
        dispatch(deleteOneClient(selectedId as number));
        navigation.navigate("AllClients");
    };

    return (
        <ClientForm
            initialValues={{
                ...selectedClient,
                warrantyMonths: String(selectedClient.warrantyMonths),
                price: String(selectedClient.price),
                dateIn,
                dateOut,
            }}
            onSubmit={handleUpdate}
            onDelete={handleDelete}
            submitText="Сохранить"
        />
    );
}