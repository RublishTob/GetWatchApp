import { MenuWidget } from "@/widgets/MenuWidget";
import { useScreen } from "@/shared/hooks/useScreenSize";
import { recalcWarrantyForClients } from "@features/model/recalculateWarranty"
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { selectSelectedClient,selectselectedClientId } from "@/entities/Client/model/selectors"
import { selectFilteredClients } from "@/features/model/selectedFilterdClients";
import {selectAllClients} from "@entities/Client/model/selectors"

const Home = () => {
  const { width, height } = useScreen();

  const dispatch = useAppDispatch();
  const clients = useAppSelector(selectAllClients);

  useEffect(() => {
    if (!clients?.length) return;
    
    recalcWarrantyForClients(clients, dispatch);
}, [clients]);

  return (
    <MenuWidget width={width} height={height} />
  );
};

export default Home;
