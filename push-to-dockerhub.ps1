param (
    [Parameter(Mandatory=$false)]
    [string]$Username,
    
    [Parameter(Mandatory=$false)]
    [string]$ImageName = "mdalats-villa",
    
    [Parameter(Mandatory=$false)]
    [string]$Tag = "latest"
)

Write-Host "==================================================" -ForegroundColor Green
Write-Host "  M_Dalats Villa - Đóng gói & Đẩy lên Docker Hub  " -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

# 1. Ask for Docker Hub username if not passed
if (-not $Username) {
    $Username = Read-Host "Nhập Docker Hub Username của bạn (ví dụ: myusername)"
}

if (-not $Username) {
    Write-Host "Lỗi: Cần nhập Docker Hub Username để tag và đẩy image!" -ForegroundColor Red
    exit 1
}

$FullImageTag = "${Username}/${ImageName}:${Tag}"
$LatestTag = "${Username}/${ImageName}:latest"

Write-Host "`n[1/3] Đang đóng gói Docker image: $FullImageTag ..." -ForegroundColor Cyan
docker build -t $FullImageTag -t $LatestTag .

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nĐóng gói Docker image thất bại!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n[2/3] Kiểm tra đăng nhập Docker Hub..." -ForegroundColor Cyan
docker login

if ($LASTEXITCODE -ne 0) {
    Write-Host "`nĐăng nhập Docker Hub thất bại!" -ForegroundColor Red
    exit $LASTEXITCODE
}

Write-Host "`n[3/3] Đang đẩy image lên Docker Hub..." -ForegroundColor Cyan
docker push $FullImageTag
if ($Tag -ne "latest") {
    docker push $LatestTag
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n==================================================" -ForegroundColor Green
    Write-Host "  HOÀN TẤT! Image đã được đẩy lên Docker Hub:    " -ForegroundColor Green
    Write-Host "  👉 https://hub.docker.com/r/${Username}/${ImageName}" -ForegroundColor Yellow
    Write-Host "==================================================" -ForegroundColor Green
    Write-Host "Để chạy trên máy chủ bất kỳ:" -ForegroundColor Cyan
    Write-Host "docker run -d -p 3000:3000 --name mdalats-app ${FullImageTag}" -ForegroundColor White
} else {
    Write-Host "`nĐẩy image lên Docker Hub thất bại!" -ForegroundColor Red
}
