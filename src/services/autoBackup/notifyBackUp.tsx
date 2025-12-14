import notifee, { AndroidImportance, AndroidColor } from '@notifee/react-native';

export async function initBackupNotificationChannel() {
  await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
    importance: AndroidImportance.HIGH,
  });
}

// Показ локального уведомления
export async function showBackupNotification() {
  await notifee.displayNotification({
    title: 'Резервное копирование',
    body: 'Сохранение базы данных успешно выполнено.',
    android: {
      channelId: 'default',
      smallIcon: 'ic_launcher',
      color: AndroidColor.BLUE,
    },
  });
}