import { Dialog, Portal, Button, Text } from 'react-native-paper';
import React from 'react';
import { StyleSheet } from 'react-native';
import { COLOR } from '../constants/colors';

interface Props {
  visible: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<Props> = ({
  visible,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onCancel} style={styles.box}>
        <Dialog.Title style={styles.title} >{title}</Dialog.Title>

        <Dialog.Content style={styles.msg}>
          <Text style={styles.btnText}>{message}</Text>
        </Dialog.Content>

        <Dialog.Actions style={styles.msg}>
          <Button onPress={onCancel} textColor="#fff" style={styles.cancel}>Отмена</Button>
          <Button onPress={onConfirm} textColor="#fff" style={styles.ok}>Удалить</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  box: {
    backgroundColor: COLOR.primary,
    padding: 20,
    borderRadius: 12,
    justifyContent:"center"
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    color:"#fff"
  },
  msg: {
    fontSize: 16,
    marginBottom: 20,
    justifyContent:"center"
  },
  cancel: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLOR.blue,
    borderRadius: 8,
  },
  ok: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLOR.delete,
    borderRadius: 8,
  },
  btnText: {
    color: "#fff",
    fontWeight: "500"
  }
});