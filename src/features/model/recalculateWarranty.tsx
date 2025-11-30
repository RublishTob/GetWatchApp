import { recalcHasWarranty } from "@/shared/hooks/recalcHasWarranty";
import { useSelector } from "react-redux";
import { COLOR } from "@shared/constants/colors"
import { SelectClient } from "@/features";
import { stylesCommon } from "@shared/styles/commonStyles";
import { useDispatch } from "react-redux";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { selectFilteredClients } from "@/features/model/selectedFilterdClients";
import { updateOneClient, deleteOneClient, updateClientPartial} from "@/entities/Client/model/slice";
import { Client } from "@/entities/Client/model/types";


export async function recalcWarrantyForClients(clients: Client[], dispatch: any) {
    for (const c of clients) {
        const newWarranty = recalcHasWarranty(c);
        if (newWarranty === c.hasWarranty) continue;

        dispatch(updateClientPartial({
            id: c.id,
            hasWarranty: newWarranty
        }));
    }
}