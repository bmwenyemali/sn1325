# Script PowerShell pour initialiser la base de données SN1325
Write-Host "Initialisation de la base de données SN1325..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/api/init" -Method Post -ContentType "application/json"
    
    Write-Host "✅ Base de données initialisée avec succès!" -ForegroundColor Green
    Write-Host "Résultat: $($response | ConvertTo-Json -Depth 3)" -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Erreur lors de l'initialisation: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Assurez-vous que le serveur de développement est lancé avec 'npm run dev'" -ForegroundColor Yellow
}