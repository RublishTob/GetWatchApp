// BackupControl.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  ActivityIndicator,
  ScrollView,
  Image,
  Alert,
} from "react-native";

import { useBackup } from "@/services/googleBackUp/useBackup";


export default function BackupControl() {

  const {
    loading,
    error,

    user,
    lastBackup,

    backupNow,
    restoreLatest,
    listBackups,

    signIn,
    signOut,
  } = useBackup();


  const [files, setFiles] = useState<any[]>([]);


  /* =============================
     HANDLERS
  ============================= */

  const handleBackup = async () => {
    try {
      await backupNow();
      Alert.alert("Готово", "Бэкап создан");
    } catch {}
  };


  const handleRestore = async () => {
    try {
      await restoreLatest();
      Alert.alert("Восстановлено");
    } catch {}
  };


  const handleLoad = async () => {
    try {
      const list = await listBackups();
      setFiles(list);
    } catch {}
  };


  const handleChangeAccount = async () => {
    await signOut();
    await signIn();
  };


  /* =============================
     UI
  ============================= */

  return (
    <ScrollView style={{ padding: 20 }}>

      {/* ================= ACCOUNT ================= */}

      <Text style={title}>Google аккаунт</Text>

      {user ? (
        <View style={userBox}>

          {user.photo && (
            <Image source={{ uri: user.photo }} style={avatar} />
          )}

          <View style={{ flex: 1 }}>
            <Text style={userName}>{user.name}</Text>
            <Text style={userEmail}>{user.email}</Text>
          </View>

          <Button title="Сменить" onPress={handleChangeAccount} />

        </View>
      ) : (
        <Button title="Войти в Google" onPress={signIn} />
      )}



      {/* ================= STATUS ================= */}

      {loading && (
        <View style={{ marginVertical: 15 }}>
          <ActivityIndicator size="large" />
          <Text style={{ textAlign: "center" }}>Обработка...</Text>
        </View>
      )}


      {error && (
        <Text style={errorText}>{error}</Text>
      )}



      {/* ================= ACTIONS ================= */}

      <Text style={title}>Резервное копирование</Text>

      <Button
        title="Создать бэкап"
        onPress={handleBackup}
        disabled={loading}
      />

      <View style={space} />

      <Button
        title="Восстановить последний"
        onPress={handleRestore}
        disabled={loading}
      />

      <View style={space} />

      <Button
        title="Показать список"
        onPress={handleLoad}
        disabled={loading}
      />


      {/* ================= INFO ================= */}

      {lastBackup && (
        <Text style={lastBackupText}>
          Последний бэкап:{" "}
          {new Date(lastBackup).toLocaleString()}
        </Text>
      )}



      {/* ================= LIST ================= */}

      {files.length > 0 && (
        <View style={{ marginTop: 20 }}>

          <Text style={title}>Файлы:</Text>

          {files.map((f) => (
            <View key={f.id} style={fileItem}>

              <Text>{f.name}</Text>

              <Text style={fileDate}>
                {new Date(f.createdTime).toLocaleString()}
              </Text>

            </View>
          ))}

        </View>
      )}

    </ScrollView>
  );
}


/* =============================
   STYLES
============================= */

const title = {
  fontSize: 20,
  marginVertical: 10,
};


const space = {
  height: 10,
};


const userBox = {
  flexDirection: "row" as const,
  alignItems: "center" as const,
  padding: 10,
  borderWidth: 1,
  borderColor: "#ddd",
  borderRadius: 8,
  marginBottom: 15,
};


const avatar = {
  width: 45,
  height: 45,
  borderRadius: 22,
  marginRight: 10,
};


const userName = {
};


const userEmail = {
  opacity: 0.6,
  fontSize: 12,
};


const errorText = {
  color: "red",
  textAlign: "center" as const,
  marginVertical: 10,
};


const lastBackupText = {
  marginTop: 15,
  opacity: 0.6,
};


const fileItem = {
  padding: 10,
  borderWidth: 1,
  borderColor: "#ccc",
  borderRadius: 6,
  marginBottom: 8,
};


const fileDate = {
  fontSize: 11,
  opacity: 0.5,
};