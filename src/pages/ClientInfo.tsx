import { useDispatch, useSelector } from "react-redux";
import ClientForm, { ClientFormFields } from "@features/ui/ClientForm";
import { Alert } from "react-native"
import { updateClientLocal } from "@/entities/Client/model/slice";
import { useDateConverter } from "@shared/hooks/useDataConverter";
import { selectSelectedClient,selectselectedClientId } from "@/entities/Client/model/selectors"
import { useNavigationApp } from "@features/model/useNavigationApp"

export default function ClientInfo() {
    const {...selectedClients} = useSelector(selectSelectedClient)
    const selectedId = useSelector(selectselectedClientId)
    const { toTimestamp, fromTimestamp } = useDateConverter();
    const dispatch = useDispatch();

    const dataAccept = fromTimestamp(selectedClients.dateIn)
    const dataTakeOut = fromTimestamp(selectedClients.dateOut)

    const navigation = useNavigationApp();

    const handleUpdate = (data: ClientFormFields) => {
        dispatch(updateClientLocal({
            id: selectedId as number,
            ...data,
            dateIn: toTimestamp(data.dateIn),
            dateOut: toTimestamp(data.dateOut),
        }));
        navigation.navigate("AllClients");
    };

    if (!selectedClients) return null;

    return (
        <ClientForm
            initialValues={{
                ...selectedClients,
                dateIn: new Date(dataAccept),
                dateOut: new Date(dataTakeOut),
            }}
            onSubmit={handleUpdate}
            submitText="Сохранить"
        />
    );
}