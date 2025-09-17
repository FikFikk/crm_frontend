# Mini CRM - Development Server Launcher
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "    Mini CRM - Development Server" -ForegroundColor Cyan  
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Try to find and use Node.js/npm
$nodeFound = $false
$npmCmd = ""

Write-Host "Mencoba berbagai cara untuk menemukan Node.js..." -ForegroundColor Yellow
Write-Host ""

# Method 1: Try direct commands
Write-Host "[1] Mencoba npm langsung..." -ForegroundColor Cyan
try {
    $null = & npm -v
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ npm ditemukan!" -ForegroundColor Green
        $nodeFound = $true
        $npmCmd = "npm"
    }
}
catch {
    Write-Host "✗ npm tidak ditemukan langsung" -ForegroundColor Yellow
}

# Method 2: Try adding common paths
if (-not $nodeFound) {
    Write-Host "[2] Mencoba menambah PATH..." -ForegroundColor Cyan
    $originalPath = $env:PATH
    $env:PATH = $env:PATH + ";C:\Program Files\nodejs\;C:\nodejs\"
    
    try {
        $null = & npm -v
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ npm ditemukan setelah PATH update!" -ForegroundColor Green
            $nodeFound = $true
            $npmCmd = "npm"
        }
    }
    catch {
        Write-Host "✗ npm masih tidak ditemukan" -ForegroundColor Yellow
        $env:PATH = $originalPath
    }
}

# Method 3: Try full paths
if (-not $nodeFound) {
    Write-Host "[3] Mencoba dengan path lengkap..." -ForegroundColor Cyan
    
    $npmPaths = @(
        "C:\Program Files\nodejs\npm.cmd",
        "C:\nodejs\npm.cmd",
        "C:\Program Files (x86)\nodejs\npm.cmd"
    )
    
    foreach ($path in $npmPaths) {
        if (Test-Path $path) {
            Write-Host "✓ npm ditemukan di: $path" -ForegroundColor Green
            $nodeFound = $true
            $npmCmd = $path
            break
        }
    }
}

# Method 4: Try through nvm
if (-not $nodeFound) {
    Write-Host "[4] Mencoba dengan nvm..." -ForegroundColor Cyan
    try {
        & nvm use 22.19.0
        $null = & npm -v
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ npm ditemukan setelah nvm use!" -ForegroundColor Green
            $nodeFound = $true
            $npmCmd = "npm"
        }
    }
    catch {
        Write-Host "✗ nvm approach gagal" -ForegroundColor Yellow
    }
}

if (-not $nodeFound) {
    Write-Host ""
    Write-Host "❌ ERROR: Tidak dapat menemukan npm" -ForegroundColor Red
    Write-Host ""
    Write-Host "Solusi:" -ForegroundColor Yellow
    Write-Host "1. Tutup PowerShell, buka Command Prompt (CMD)" -ForegroundColor White
    Write-Host "2. Jalankan: start.bat" -ForegroundColor White
    Write-Host "3. Atau restart komputer setelah install Node.js" -ForegroundColor White
    Write-Host ""
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

Write-Host ""
Write-Host "Node.js dan npm ditemukan!" -ForegroundColor Green

try {
    $nodeVersion = & node -v
    Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "⚠ Warning: node command tidak ditemukan, tapi npm tersedia" -ForegroundColor Yellow
}

try {
    $npmVersion = & $npmCmd -v
    Write-Host "✓ npm version: $npmVersion" -ForegroundColor Green
}
catch {
    Write-Host "❌ Error getting npm version" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
try {
    & $npmCmd install
    if ($LASTEXITCODE -ne 0) {
        throw "npm install failed"
    }
    Write-Host "✓ Dependencies installed successfully" -ForegroundColor Green
}
catch {
    Write-Host "❌ ERROR: Gagal menginstall dependencies" -ForegroundColor Red
    Write-Host "Coba jalankan: start.bat di Command Prompt" -ForegroundColor White
    Write-Host ""
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host "Aplikasi akan terbuka di: http://localhost:5173" -ForegroundColor Green
Write-Host "Tekan Ctrl+C untuk menghentikan server" -ForegroundColor Yellow
Write-Host ""

# Start dev server
try {
    & $npmCmd run dev
}
catch {
    Write-Host "❌ Error starting development server" -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
}
