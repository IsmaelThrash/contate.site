# sync-env-to-winbot.ps1
# Este script sincroniza as variaveis de ambiente locais para o servidor winbot
# e reinicia o servico de autenticacao do Supabase.

$envSource = ".\.env.supabase.local"
$dest = "winbot@192.168.15.4:C:/Users/winbot/supabase/docker/.env"

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Sincronizando .env.supabase.local -> winbot" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

if (-Not (Test-Path $envSource)) {
    Write-Host "ERRO: O arquivo $envSource nao foi encontrado!" -ForegroundColor Red
    exit 1
}

Write-Host "1. Enviando arquivo .env para o servidor winbot (192.168.15.4)..."
scp.exe -o StrictHostKeyChecking=no $envSource $dest

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao copiar o arquivo via SCP." -ForegroundColor Red
    exit 1
}

Write-Host "Arquivo copiado com sucesso!" -ForegroundColor Green
Write-Host ""

Write-Host "2. Recriando container supabase-auth para aplicar novas variaveis..."
# Usando powershell remoto para garantir compatibilidade com o ponto e virgula
ssh.exe -o StrictHostKeyChecking=no winbot@192.168.15.4 "powershell -Command `"cd C:\Users\winbot\supabase\docker; docker compose up -d --force-recreate auth`""

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERRO: Falha ao recriar o container." -ForegroundColor Red
    exit 1
}

Write-Host "Container recriado com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "Sincronizacao concluida!" -ForegroundColor Green
