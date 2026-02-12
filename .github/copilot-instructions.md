## Коротко — цель для AI-агентов
Дать практические инструкции, чтобы быстро вникнуть в репозиторий React Native приложения "Master Manager" и быть продуктивным: где искать логику и данные, как запускать сборки и тесты, какие файлы менять для интеграций (Google Drive, SQLite, нотификации).

## Большая картина (архитектура)
- Приложение — React Native (TypeScript). Точка входа: [src/app/App.tsx](src/app/App.tsx#L1-L120). Здесь выполняются: `initDB()`, `configureGoogle()`, `initBackupNotificationChannel()` и `autoBackupOncePerMonth()`.
- UI/навигация: компонент `Navigation` (см. папку `src/navigation`).
- Состояние: Redux Toolkit — провайдится через `src/providers/ReduxProvider.tsx` и хранилище в `src/store`.
- Данные: локальная БД (SQLite) и абстракция доступа в `src/data` — обращайтесь через `apiDb` (`src/data/api.tsx`) и низкоуровневые функции в `src/data/db`.
- Сервисы: резервное копирование и интеграции в `src/services` (Google Drive, autoBackup, notifyBackUp).

## Ключевые интеграции и точки внимания
- Google Sign-In / Drive: [src/services/googleBackUp/googleAuth.tsx](src/services/googleBackUp/googleAuth.tsx#L1-L200) содержит `webClientId` и конфиг OAuth scopes; native credentials также в `android/app/google-services.json` и iOS Podfile/Info.plist.
- Локальное хранилище: `react-native-sqlite-storage` + `AsyncStorage` (см. `src/data` и `src/services/autoBackup/autoBackup.tsx`).
- Нотификации: используется `@notifee/react-native` и канал уведомлений создаётся в `src/services/autoBackup/notifyBackUp.tsx`.

## Скрипты и рабочие команды (из `package.json`)
- `npm run start` — Metro bundler (React Native).  
- `npm run android` — `react-native run-android` (Windows: использует `android/gradlew.bat`).  
- `npm run ios` — `react-native run-ios` (macOS + CocoaPods).  
- `npm run lint` — eslint с автофиксами.  
- `npm test` — jest.

Советы: для Windows-специфичных действий используйте `cd android && gradlew.bat assembleDebug` или `gradlew.bat installDebug`, если `react-native run-android` падает.

## Конвенции и паттерны в проекте
- Путь/алиасы: `@/*`, `@shared/*`, `@entities/*` настроены в `tsconfig.json` и `babel.config.js` — используйте их (пример: `@/shared/constants/colors`).
- Файловая организация: `src/pages` — экраны, `src/features` — переиспользуемая логика, `src/widgets` — маленькие UI-виджеты, `src/services` — side-effect и интеграции, `src/data` — доступ к БД.
- Data flow: UI → `features` / `widgets` → dispatch в Redux → persist в SQLite через `src/data/db` и `apiDb`.
- Хуки: кастомные хуки живут в `src/hooks` и `src/features/*/hooks` (пример: `useImmersiveMode`, `useSelectClient`).

## Что менять при добавлении фич/исправлении багов
- Изменения состояния: добавляйте slices в `src/store` и подключайте через `ReduxProvider`.  
- Для бэкапа/авто-бэкапа: см. `src/services/autoBackup/*` и `src/services/googleBackUp/*` — не забудьте обновить `webClientId` и native credentials при смене OAuth-клиента.
- Нативные изменения (Android/iOS): обновляйте `android/app/build.gradle`, `android/app/google-services.json`, `ios/Podfile` и запускайте сборку нативной части отдельно.

## Безопасность и секреты
- В репозитории виден `webClientId` в `googleAuth.tsx`. При перемещении в продакшен вынесите секреты в CI/secure storage и не коммитьте новые ключи в репо.

## Быстрые ссылки (начать разбираться)
- Точка входа: [src/app/App.tsx](src/app/App.tsx#L1-L120)  
- API для БД: [src/data/api.tsx](src/data/api.tsx#L1-L200)  
- Google OAuth: [src/services/googleBackUp/googleAuth.tsx](src/services/googleBackUp/googleAuth.tsx#L1-L200)  
- Auto-backup: [src/services/autoBackup/autoBackup.tsx](src/services/autoBackup/autoBackup.tsx#L1-L200)  
- Конфиги алиасов: [tsconfig.json](tsconfig.json#L1-L60) и [babel.config.js](babel.config.js#L1-L80)

Если нужно, могу сократить или расширить разделы, добавить примеры PR-паттерна, стандартные тест-кейсы или конкретные места для локализации/конфигураций — скажите, что приоритетнее.
