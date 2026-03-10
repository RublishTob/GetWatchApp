import React, { memo, useCallback } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Client } from "@/entities";
import Button from "@/shared/ui/Button";
import { ClientInfo } from "@/entities/Client";
import { Checkbox } from "@shared/ui/CheckBox";
import { Text } from "react-native-paper";

interface Props {
  item: Client;
  isSelected: boolean;
  onPress: (id: number) => void;
  onShowInfo: () => void;
  onChangeAccepted: (id: number, accepted: boolean) => void;
  height: number;
}

export const SelectClient = memo(({
  item,
  isSelected,
  onPress,
  onShowInfo,
  onChangeAccepted,
  height,
}: Props) => {

  const handlePress = useCallback(() => {
    onPress(item.id);
  }, [item.id, onPress]);

  const handleAccepted = useCallback((value: boolean) => {
    onChangeAccepted(item.id, value);
  }, [item.id, onChangeAccepted]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.container,
        { height },
        isSelected && styles.selected,
      ]}
    >
      <ClientInfo
        style={{ width: "35%"}}
        item={item}
        isSelected={isSelected}
      />

      {isSelected && (
        <View style={styles.actions}>
          <Button
            style={styles.button}
            onPress={onShowInfo}
            text="открыть"
            colorButton="#116a86ff"
            colorText="white"
          />

          <View style={styles.checkboxBlock}>
            <Checkbox
              size="50%"
              value={item.accepted}
              onValueChange={handleAccepted}
            />
            <Text style={styles.text}>
              принят в работу
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#16171D",
    borderBottomWidth: 1,
    borderBottomColor: "#48465e",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },
  selected: {
    backgroundColor: "#4c5271",
    padding: 10,
  },
  actions: {
    width: "65%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 20,
  },
  button: {
    width: "40%",
    height: "40%",
  },
  checkboxBlock: {
    width: "35%",
    alignItems: "center",
    flexDirection: "column",
    rowGap: 5,
  },
  text: {
    color: "white",
    fontSize: 8,
    textAlign: "center",
  },
});
