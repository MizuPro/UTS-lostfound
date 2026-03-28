$ErrorActionPreference = "SilentlyContinue"

# Login
$loginBody = @{
    email = "petugas@commuterlink.id"
    password = "password"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost/lostfound/BackendLostFound/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"

if (-not $loginResponse.data.token) {
    Write-Host "Failed to login"
    exit
}

$token = $loginResponse.data.token

# Create Found Item
$foundItemBody = @{
    nama_barang = "Test Barang"
    lokasi = "Stasiun Jakarta"
    waktu_temuan = "2026-03-28 14:30:00"
    deskripsi = "Ini test"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "http://localhost/lostfound/BackendLostFound/api/found-items" -Method Post -Body $foundItemBody -ContentType "application/json" -Headers @{ Authorization = "Bearer $token" }
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error occurred:"
    Write-Host $_.Exception.Response.StatusCode.value__
    $stream = $_.Exception.Response.GetResponseStream()
    if ($stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        $errorResponse = $reader.ReadToEnd()
        Write-Host $errorResponse
    } else {
        Write-Host "No response stream"
    }
}
