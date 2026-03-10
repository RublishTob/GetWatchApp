import { View, Text } from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { FlashList } from "@shopify/flash-list";
import { COLOR } from "@shared/constants/colors";
import { SelectClient } from "@/features";
import { stylesCommon } from "@shared/styles/commonStyles";
import { useAppDispatch, useAppSelector } from "@/app/store/hook";
import { Client } from "@/entities";

import {
  selectClientId,
  updateClientPartial,
  fetchClientsInfo,
} from "@/entities/Client/model/slice";
import { useNavigationApp } from "@/features/hooks/useNavigationApp";
import { selectFilteredClients } from "@/features/model/selectedFilterdClients";

interface ClientListProp {
  height: number;
  width: number;
}

export const ClientListWidget = ({ height, width }: ClientListProp) => {
  const [highlightId, setHighlightId] = useState<number | null>(null);

  const allClients : Client[] = useAppSelector(selectFilteredClients);
  const dispatch = useAppDispatch();
  const navigation = useNavigationApp();

  const itemHeight = height * 0.3;

  // 🔹 выбор клиента
  const handleGetId = useCallback((id: number) => {
    setHighlightId((prev) => (prev === id ? null : id));
  }, []);

  // 🔹 переход
  const handleShowClientInfo = useCallback(() => {
    if (highlightId !== null) {
      dispatch(selectClientId(highlightId));
      navigation.navigate("ClientInfo");
    }
  }, [highlightId, dispatch, navigation]);

  // 🔹 статус
  const changeAcceptedStatusOfClient = useCallback(
    (id: number, accepted: boolean) => {
      dispatch(updateClientPartial({ id, accepted }));
    },
    [dispatch]
  );

  useEffect(() => {
    dispatch(fetchClientsInfo());
  }, [dispatch]);

  const renderItem = useCallback(
    ({ item }: { item: Client }) => (
      <SelectClient
        item={item}
        isSelected={item.id === highlightId}
        onPress={handleGetId}
        onShowInfo={handleShowClientInfo}
        onChangeAccepted={changeAcceptedStatusOfClient}
        height={itemHeight}
      />
    ),
    [highlightId, handleGetId, handleShowClientInfo, changeAcceptedStatusOfClient]
  );

  if (allClients.length === 0) {
    return (
      <View
        style={[
          stylesCommon.containerClient,
          { flex: 1, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={stylesCommon.text}>Нет клиентов</Text>
      </View>
    );
  }

  return (
    <View style={{ height, width, backgroundColor:"#222a37" }}>
      <FlashList 
        data={allClients}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={highlightId}

        // 🔥 доп оптимизация
        getItemType={() => "client"}
      />
    </View>
  );
};
