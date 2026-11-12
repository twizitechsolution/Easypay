@echo off
title Bachat Pay - Build Android APK
echo ====================================================
echo   BACHAT PAY - ANDROID APK BUILDER
echo ====================================================
echo.
echo Checking for Flutter environment...
where flutter >nul 2>nul
if %errorlevel% neq 0 (
    echo Flutter CLI was not found in your system PATH.
    echo.
    echo NOTE: You can immediately test the 100%% working app on your phone:
    echo 1. Run start-server.bat
    echo 2. Open http://localhost:5000/ on your mobile browser (or via your local IP)
    echo 3. Tap 'Install App' / 'Add to Home Screen' for native full-screen experience!
    echo.
    pause
    exit /b 1
)

echo Flutter detected. Fetching packages...
flutter pub get

echo.
echo Building Release APK...
flutter build apk --release

echo.
if exist "build\app\outputs\flutter-apk\app-release.apk" (
    echo [SUCCESS] Bachat Pay APK built successfully at:
    echo build\app\outputs\flutter-apk\app-release.apk
) else (
    echo Build finished. Check output logs above.
)
pause
