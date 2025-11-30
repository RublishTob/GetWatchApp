import { View, Text } from "react-native";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import ClientForm, { ClientFormFields } from "@features/ui/ClientForm";
import { selectSelectedClient, selectselectedClientId } from "@/entities/Client/model/selectors";
import { updateClientPartial, deleteOneClient } from "@/entities/Client/model/slice";
import { useDateConverter } from "@shared/hooks/useDataConverter";
import { useNavigationApp } from "@features/model/useNavigationApp";
import { COLOR } from "@/shared/constants/colors";

export default function ClientInfo() {
    const dispatch = useAppDispatch();
    const navigation = useNavigationApp();
    const { toTimestamp, fromTimestamp } = useDateConverter();

    const selectedClient = useAppSelector(selectSelectedClient);
    const selectedId = useAppSelector(selectselectedClientId);

    // Если клиента нет
    if (!selectedClient) {
        return (
            <View>
                <Text>Нет информации</Text>
            </View>
        );
    }

    // Конвертация дат
    const dateIn = new Date(fromTimestamp(selectedClient.dateIn));
    const dateOut = new Date(fromTimestamp(selectedClient.dateOut));

    // --- Обновление клиента ---
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

                // timestamps
                dateIn: toTimestamp(data.dateIn),
                dateOut: toTimestamp(data.dateOut),

                // accepted/conflict
                accepted: data.accepted,
                isConflictClient: data.isConflictClient,

                // ❗ ВАЖНО: hasWarranty НЕ СЧИТАЕМ ТУТ
                // он пересчитывается в slice внутри updateClientPartial автоматически
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