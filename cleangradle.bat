@echo off
title React Native Build Fix Script
color 0A

echo ============================================
echo   🛠  Очистка и восстановление React Native
echo ============================================
echo.

:: 1. Переход в корень проекта
cd /d %~dp0

:: 2. Остановка Metro bundler (если запущен)
echo Остановка Metro bundler...
taskkill /F /IM node.exe >nul 2>&1

:: 3. Очистка node_modules и кешей npm
echo Очистка node_modules и кеша npm...
if exist node_modules rd /s /q node_modules
if exist package-lock.json del package-lock.json
call npm cache clean --force

:: 4. Переустановка зависимостей
echo Установка зависимостей...
call npm install

:: 5. Очистка Gradle кеша
echo Очистка Gradle кеша...
if exist "%USERPROFILE%\.gradle\caches" rd /s /q "%USERPROFILE%\.gradle\caches"
if exist "%USERPROFILE%\.gradle\daemon" rd /s /q "%USERPROFILE%\.gradle\daemon"
if exist "%USERPROFILE%\.gradle\wrapper" rd /s /q "%USERPROFILE%\.gradle\wrapper"

:: 6. Очистка Android сборки
echo Очистка Android проекта...
if exist android\.gradle rd /s /q android\.gradle
if exist android\build rd /s /q android\build

:: 7. Очистка через Gradle clean
cd android
call gradlew clean

:: 8. Возврат в корень и сборка проекта
cd ..
echo Запуск сборки React Native...
call npx react-native run-android

echo.
echo ✅ Готово! Если ошибка останется, попробуй перезагрузить ПК.
pause