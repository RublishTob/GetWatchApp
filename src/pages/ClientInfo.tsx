import { useDispatch, useSelector } from "react-redux";
import ClientForm, { ClientFormFields } from "@features/ui/ClientForm";
import { Alert, View, Text } from "react-native"
import { updateOneClient, deleteOneClient} from "@/entities/Client/model/slice";
import { useDateConverter } from "@shared/hooks/useDataConverter";
import { selectSelectedClient,selectselectedClientId } from "@/entities/Client/model/selectors"
import { useNavigationApp } from "@features/model/useNavigationApp"
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import Button from "@/shared/ui/Button";
import { COLOR } from "@/shared/constants/colors";

export default function ClientInfo() {

    const { toTimestamp, fromTimestamp } = useDateConverter();
    const {...selectedClient} = useSelector(selectSelectedClient) ?? {
        id:0,
        dateIn: toTimestamp(new Date()), 
        dateOut: toTimestamp(new Date()),
        clientName:"",
        lastname:"",
        numberOfPhone:"0",
        price:0,
        nameOfWatch:"",
        reason:"",
        viewOfWatch:"",
        warrantyMonths:0,
        hasWarranty:false,
        accepted:false,
        isConflictClient:false

        }
    const selectedId = useSelector(selectselectedClientId)
    const dispatch = useAppDispatch();
    
    const navigation = useNavigationApp();

    const dataAccept = fromTimestamp(selectedClient.dateIn)
    const dataTakeOut = fromTimestamp(selectedClient.dateOut)
    
    const handleUpdate = (data: ClientFormFields) => {
        dispatch(updateOneClient({
            id: selectedId as number,
            ...data,
            dateIn: toTimestamp(data.dateIn),
            dateOut: toTimestamp(data.dateOut),
        }));
        navigation.navigate("AllClients");
    };
    
    const handleDelete = () => {
        dispatch(deleteOneClient(selectedId as number));
        navigation.navigate("AllClients");
    };
    
    if (!selectedClient) 
        return (
    <View>
                <Text>
                    Нет информации
                </Text>
            </View>
    );
    
    return (
            <ClientForm
                initialValues={{
                    ...selectedClient,
                    dateIn: new Date(dataAccept),
                    dateOut: new Date(dataTakeOut),
                }}
                onSubmit={handleUpdate}
                onDelete={handleDelete}
                submitText="Сохранить"
            />
    );
}