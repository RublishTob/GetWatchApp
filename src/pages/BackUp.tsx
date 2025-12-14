// BackupControl.tsx
import React, { useState } from "react";
import { View, Text, Button, ActivityIndicator, Alert, ScrollView } from "react-native";
import { useBackup } from "@/services/googleBackUp/useBackup"; 
import { fetchClientsInfo } from "@/entities/Client/model/slice";

export function BackUp() {
  const { loading, backupNow, restoreLatest, listBackups, lastBackup } = useBackup();
  const [files, setFiles] = useState<any[]>([]);

  const handleBackup = async () => {
    try {
      await backupNow();
      Alert.alert("Готово", "Резервная копия успешно создана!");
    } catch (e: any) {
      Alert.alert("Ошибка", e.message || "Не удалось создать бэкап");
    }
  };

  const handleRestore = async () => {
    try {
      const res = await restoreLatest();
      fetchClientsInfo();
      Alert.alert('Восстановлено');
    } catch (e: any) {
      Alert.alert("Ошибка", e.message || "Не удалось восстановить");
    }
  };

  const handleLoadList = async () => {
    try {
      const list = await listBackups();
      setFiles(list);
    } catch (e: any) {
      Alert.alert("Ошибка", e.message);
    }
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Управление резервным копированием
      </Text>

      {loading && (
        <View style={{ marginVertical: 10 }}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center", marginTop: 5 }}>Обработка...</Text>
        </View>
      )}

      <Button title="Создать резервную копию" onPress={handleBackup} disabled={loading} />
      <View style={{ height: 10 }} />

      <Button title="Восстановить последнюю" onPress={handleRestore} disabled={loading} />
      <View style={{ height: 10 }} />

      <Button title="Показать список бэкапов" onPress={handleLoadList} disabled={loading} />

      {lastBackup && (
        <Text style={{ marginTop: 20, opacity: 0.7 }}>
          Последний бэкап: {new Date(lastBackup).toLocaleString()}
        </Text>
      )}

      {files.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 10 }}>Список бэкапов:</Text>

          {files.map((f) => (
            <View
              key={f.id}
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 6,
                marginBottom: 8,
              }}
            >
              <Text>{f.name}</Text>
              <Text style={{ opacity: 0.5, fontSize: 12 }}>
                {new Date(f.createdTime).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

export default BackUp;