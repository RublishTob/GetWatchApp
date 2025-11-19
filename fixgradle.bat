@echo off
title 🔧 React Native / Gradle Auto-Fix (v8.13)
color 0A
echo ============================================
echo   🚀 Исправление и обновление Gradle до 8.13
echo ============================================
echo.

:: 1. Переход в корень проекта
cd /d %~dp0

:: 2. Остановка Metro bundler (если запущен)
taskkill /F /IM node.exe >nul 2>&1

:: 3. Очистка Gradle кешей
echo Очистка кешей Gradle...
if exist "%USERPROFILE%\.gradle\caches" rd /s /q "%USERPROFILE%\.gradle\caches"
if exist "%USERPROFILE%\.gradle\daemon" rd /s /q "%USERPROFILE%\.gradle\daemon"
if exist "%USERPROFILE%\.gradle\wrapper" rd /s /q "%USERPROFILE%\.gradle\wrapper"
if exist android\.gradle rd /s /q android\.gradle
if exist android\build rd /s /q android\build
if exist android\app\.cxx rd /s /q android\app\.cxx

echo Удаление .lock файлов...
for /r android %%f in (*.lock) do del "%%f" >nul 2>&1

:: 4. Обновление Gradle Wrapper до 8.13
echo Обновление Gradle Wrapper...
set "PROP_FILE=android\gradle\wrapper\gradle-wrapper.properties"
if exist "%PROP_FILE%" (
  powershell -Command "(Get-Content %PROP_FILE%) -replace 'distributionUrl=.*', 'distributionUrl=https://services.gradle.org/distributions/gradle-8.13-all.zip' | Set-Content %PROP_FILE%"
)

:: 5. Очистка проекта
cd android
echo Выполняется gradlew clean...
call gradlew clean --no-daemon
cd ..

:: 6. Пересборка приложения
echo Запуск React Native сборки...
call npx react-native run-android

echo.
echo ✅ Готово! Gradle обновлён до 8.13 и проект пересобран.
pause