# Healthcare Translator - Installation Verification Script
# Run this script to verify your setup is correct

Write-Host "===============================================" -ForegroundColor Cyan
Write-Host "Healthcare Translator - Installation Checker" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
Write-Host ""

$allGood = $true

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
    
    $versionNumber = $nodeVersion -replace 'v', ''
    $majorVersion = [int]($versionNumber.Split('.')[0])
    
    if ($majorVersion -lt 14) {
        Write-Host "⚠ Warning: Node.js version should be 14 or higher" -ForegroundColor Yellow
        $allGood = $false
    }
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js v14+" -ForegroundColor Red
    $allGood = $false
}

# Check npm
Write-Host "Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✓ npm installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ npm not found" -ForegroundColor Red
    $allGood = $false
}

Write-Host ""

# Check project structure
Write-Host "Checking project structure..." -ForegroundColor Yellow

$requiredDirs = @("backend", "frontend")
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "✓ $dir directory exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $dir directory not found" -ForegroundColor Red
        $allGood = $false
    }
}

Write-Host ""

# Check backend files
Write-Host "Checking backend files..." -ForegroundColor Yellow
$backendFiles = @(
    "backend\package.json",
    "backend\server.js",
    "backend\.env.example"
)

foreach ($file in $backendFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file not found" -ForegroundColor Red
        $allGood = $false
    }
}

# Check if backend .env exists
if (Test-Path "backend\.env") {
    Write-Host "✓ backend\.env exists" -ForegroundColor Green
    
    # Check for OpenAI API key
    $envContent = Get-Content "backend\.env" -Raw
    if ($envContent -match "OPENAI_API_KEY=sk-") {
        Write-Host "✓ OpenAI API key appears to be set" -ForegroundColor Green
    } else {
        Write-Host "⚠ Warning: OpenAI API key may not be set properly" -ForegroundColor Yellow
        Write-Host "  Make sure OPENAI_API_KEY starts with 'sk-' in backend\.env" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ backend\.env not found. Copy from .env.example and configure" -ForegroundColor Yellow
}

Write-Host ""

# Check frontend files
Write-Host "Checking frontend files..." -ForegroundColor Yellow
$frontendFiles = @(
    "frontend\package.json",
    "frontend\public\index.html",
    "frontend\src\App.js",
    "frontend\src\index.js",
    "frontend\.env.example"
)

foreach ($file in $frontendFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "✗ $file not found" -ForegroundColor Red
        $allGood = $false
    }
}

# Check if frontend .env exists
if (Test-Path "frontend\.env") {
    Write-Host "✓ frontend\.env exists" -ForegroundColor Green
} else {
    Write-Host "⚠ frontend\.env not found. Copy from .env.example" -ForegroundColor Yellow
}

Write-Host ""

# Check backend dependencies
Write-Host "Checking backend dependencies..." -ForegroundColor Yellow
if (Test-Path "backend\node_modules") {
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Backend dependencies not installed. Run: cd backend; npm install" -ForegroundColor Yellow
    $allGood = $false
}

# Check frontend dependencies
Write-Host "Checking frontend dependencies..." -ForegroundColor Yellow
if (Test-Path "frontend\node_modules") {
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠ Frontend dependencies not installed. Run: cd frontend; npm install" -ForegroundColor Yellow
    $allGood = $false
}

Write-Host ""

# Check documentation
Write-Host "Checking documentation..." -ForegroundColor Yellow
$docFiles = @(
    "README.md",
    "USER_GUIDE.md",
    "CODE_DOCUMENTATION.md",
    "DEPLOYMENT.md",
    "QUICKSTART.md",
    "PRESENTATION.md",
    "PROJECT_SUMMARY.md"
)

foreach ($file in $docFiles) {
    if (Test-Path $file) {
        Write-Host "✓ $file exists" -ForegroundColor Green
    } else {
        Write-Host "⚠ $file not found" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "===============================================" -ForegroundColor Cyan

if ($allGood) {
    Write-Host "✓ All critical checks passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Configure backend\.env with your OPENAI_API_KEY" -ForegroundColor White
    Write-Host "2. Configure frontend\.env with REACT_APP_API_URL" -ForegroundColor White
    Write-Host "3. Start backend: cd backend; npm start" -ForegroundColor White
    Write-Host "4. Start frontend (new terminal): cd frontend; npm start" -ForegroundColor White
    Write-Host "5. Open http://localhost:3000" -ForegroundColor White
} else {
    Write-Host "⚠ Some issues found. Please fix them before proceeding." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Common fixes:" -ForegroundColor Cyan
    Write-Host "- Install Node.js: https://nodejs.org/" -ForegroundColor White
    Write-Host "- Install dependencies: npm install (in backend and frontend)" -ForegroundColor White
    Write-Host "- Create .env files from .env.example" -ForegroundColor White
}

Write-Host ""
Write-Host "For detailed instructions, see QUICKSTART.md" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan
