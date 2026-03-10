import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { selectAllClients } from "@entities/Client/model/selectors";
import { recalcWarrantyForClients } from "@features/model/recalculateWarranty";
import { fetchClientsInfo } from "@/entities/Client/model/slice";

export const EntryPointProvider = () => {
  const dispatch = useAppDispatch();
  const clients = useAppSelector(selectAllClients);

  const initialized = useRef(false);

  // загрузка клиентов при старте приложения
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      dispatch(fetchClientsInfo());
    }
  }, [dispatch]);

  // пересчет гарантий после загрузки клиентов
  useEffect(() => {
    if (!clients.length) return;

    recalcWarrantyForClients(clients, dispatch);
  }, [clients.length, dispatch]);

  return null;
};

export default EntryPointProvider;