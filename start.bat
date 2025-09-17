@echo off
echo ==========================================
echo    Mini CRM - Development Server
echo ==========================================
echo.

echo Mencoba berbagai cara untuk menjalankan Node.js...
echo.

REM Try direct npm
echo [1] Mencoba npm langsung...
npm -v >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm ditemukan!
    goto :run_npm
)

REM Try through PATH
echo [2] Mencoba menambah PATH...
set PATH=%PATH%;C:\Program Files\nodejs\;C:\nodejs\
npm -v >nul 2>&1
if %errorlevel% equ 0 (
    echo ✓ npm ditemukan setelah PATH update!
    goto :run_npm
)

REM Try with full path
echo [3] Mencoba dengan path lengkap...
if exist "C:\Program Files\nodejs\npm.cmd" (
    echo ✓ npm ditemukan di Program Files!
    set NPM_CMD="C:\Program Files\nodejs\npm.cmd"
    goto :run_npm_full
)

if exist "C:\nodejs\npm.cmd" (
    echo ✓ npm ditemukan di C:\nodejs!
    set NPM_CMD="C:\nodejs\npm.cmd"
    goto :run_npm_full
)

REM Try nvm approach
echo [4] Mencoba dengan nvm...
nvm use 22.19.0 >nul 2>&1
if %errorlevel% equ 0 (
    npm -v >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✓ npm ditemukan setelah nvm use!
        goto :run_npm
    )
)

echo.
echo ❌ ERROR: Tidak dapat menemukan npm
echo.
echo Solusi:
echo 1. Buka Command Prompt BARU (restart terminal)
echo 2. Atau install ulang Node.js dari https://nodejs.org/
echo 3. Pastikan centang "Add to PATH" saat install
echo.
pause
exit /b 1

:run_npm
echo.
echo Node.js version:
node -v
echo npm version:
npm -v
echo.
echo Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Gagal install dependencies
    pause
    exit /b 1
)
echo.
echo Starting development server...
echo Aplikasi akan terbuka di: http://localhost:5173
echo Tekan Ctrl+C untuk menghentikan server
echo.
npm run dev
goto :end

:run_npm_full
echo.
echo Menggunakan npm dari: %NPM_CMD%
%NPM_CMD% -v
echo.
echo Installing dependencies...
%NPM_CMD% install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Gagal install dependencies
    pause
    exit /b 1
)
echo.
echo Starting development server...
echo Aplikasi akan terbuka di: http://localhost:5173
echo Tekan Ctrl+C untuk menghentikan server
echo.
%NPM_CMD% run dev

:end
pause
