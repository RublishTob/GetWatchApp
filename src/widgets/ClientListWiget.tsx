import { View,FlatList,Text} from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { COLOR } from "@shared/constants/colors"
import { SelectClient } from "@/features";
import { stylesCommon } from "@shared/styles/commonStyles";
import { selectFilteredClients } from "@/features/model/filterClients/selectors/selectedFilterdClients";

interface ClientListProp{
    height:number,
    width:number
}

export const ClientListWidget = ({height,width}:ClientListProp) => {
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const allClients = useSelector(selectFilteredClients);

  const handleGetId = (id: number) => {
    setHighlightId((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    console.log(allClients.length);
  }, [allClients]);

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
  const itemHeight = height * 0.2;

  return (
    <View style={{ height, width }}>
      <FlatList
        style={{ flex: 1, backgroundColor: COLOR.primary }}
        data={allClients}
        renderItem={({ item }) => (
          <SelectClient
            style={{
              alignItems: 'center',
              justifyContent: "space-between",
              paddingHorizontal: 15,
              height: itemHeight,
              width: "100%",
              backgroundColor: COLOR.primary,
            }}
            selectId={highlightId}
            item={item}
            handlePress={handleGetId}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};
