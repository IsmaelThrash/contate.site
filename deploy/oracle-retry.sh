#!/usr/bin/env bash
# ============================================================
# contate.site — Retry automático da instância Oracle A1 (Always Free)
# Onde rodar: Oracle Cloud Shell (console → ícone >_ no topo)
# O que faz: tenta criar a instância em loop até conseguir,
#            respeitando rate-limit, e imprime o IP público no final.
# Parar: Ctrl+C
# ============================================================
set -uo pipefail

# ---------- CONFIGURAÇÃO ----------
INSTANCE_NAME="contate-brain"
SHAPE="VM.Standard.A1.Flex"
OCPUS=2
MEMORY=12
BOOT_SIZE=100
KEY_FILE="chave.pub"        # arquivo com a chave pública SSH (mesma do console)
INTERVAL_OK=120             # pausa entre tentativas normais (segundos)
INTERVAL_RATE=600           # pausa extra ao receber "Too many requests" (segundos)
# ----------------------------------

echo "🔍 Descobrindo ambiente (tenancy, AD, sub-rede, imagem)..."

TENANCY=$(grep -E '^tenancy' ~/.oci/config | awk '{print $3}')
if [[ -z "$TENANCY" ]]; then echo "❌ Não achei a tenancy em ~/.oci/config"; exit 1; fi

AD=$(oci iam availability-domain list --compartment-id "$TENANCY" \
      --query 'data[0].name' --raw-output)

SUBNET=$(oci network subnet list --compartment-id "$TENANCY" \
          --display-name "subnet-20250626-1545" \
          --query 'data[0].id' --raw-output)

IMAGE=$(oci compute image list --compartment-id "$TENANCY" \
          --operating-system "Canonical Ubuntu" --operating-system-version "24.04" \
          --shape "$SHAPE" --sort-by TIMECREATED --sort-order DESC \
          --query 'data[0].id' --raw-output)

if [[ -z "$SUBNET" || -z "$IMAGE" ]]; then
  echo "❌ Sub-rede ou imagem não encontrada. Confira o nome da sub-rede."; exit 1
fi

if [[ ! -f "$KEY_FILE" ]]; then
  echo "❌ Crie o arquivo $KEY_FILE com sua chave pública SSH antes de rodar:"
  echo "   nano $KEY_FILE   → cole a chave (ssh-rsa AAAA...) → salve"
  exit 1
fi

# Evita duplicar: se já existe instância com esse nome, aborta
EXISTE=$(oci compute instance list --compartment-id "$TENANCY" \
          --display-name "$INSTANCE_NAME" \
          --query 'length(data[?"lifecycle-state"=="RUNNING" || "lifecycle-state"=="STARTING"])' \
          --raw-output 2>/dev/null || echo 0)
if [[ "$EXISTE" != "0" ]]; then
  echo "⚠️  Já existe uma instância '$INSTANCE_NAME' ativa. Abortando para não duplicar."
  exit 1
fi

echo "   Tenancy : $TENANCY"
echo "   AD      : $AD"
echo "   Sub-rede: $SUBNET"
echo "   Imagem  : $IMAGE"
echo ""
echo "🚀 Iniciando loop de tentativas (Ctrl+C para parar)..."

n=0
while true; do
  n=$((n+1))
  echo "──────────────────────────────────────────"
  echo "⏱  Tentativa #$n — $(date '+%d/%m %H:%M:%S')"

  RESP=$(oci compute instance launch \
    --availability-domain "$AD" \
    --compartment-id "$TENANCY" \
    --shape "$SHAPE" \
    --shape-config "{\"ocpus\":$OCPUS,\"memoryInGBs\":$MEMORY}" \
    --image-id "$IMAGE" \
    --subnet-id "$SUBNET" \
    --assign-public-ip true \
    --boot-volume-size-in-gbs "$BOOT_SIZE" \
    --ssh-authorized-keys-file "$KEY_FILE" \
    --display-name "$INSTANCE_NAME" 2>&1)
  RC=$?

  if [[ $RC -eq 0 ]]; then
    INST_ID=$(echo "$RESP" | grep -o '"id": "ocid1\.instance[^"]*"' | head -1 | cut -d'"' -f4)
    echo "✅ INSTÂNCIA CRIADA! OCID: $INST_ID"
    echo "⏳ Aguardando estado RUNNING..."
    oci compute instance get --instance-id "$INST_ID" \
        --wait-for-state RUNNING --wait-interval-seconds 15 >/dev/null 2>&1
    IP=$(oci compute instance list-vnics --instance-id "$INST_ID" \
           --query 'data[0]."public-ip"' --raw-output)
    echo ""
    echo "🎉 PRONTO! IP público: $IP"
    echo "   Próximo passo (no seu Windows):"
    echo "   ssh -i C:\\Users\\Ismael\\.ssh\\<sua-chave> ubuntu@$IP"
    exit 0
  fi

  if echo "$RESP" | grep -qiE "too many requests|TooManyRequests"; then
    echo "⏳ Rate-limit da API. Aguardando $INTERVAL_RATEs..."
    sleep "$INTERVAL_RATE"
  elif echo "$RESP" | grep -qiE "out of (host )?capacity|capacidade insuficiente|NotAvailable|unavailable"; then
    echo "❌ Sem capacidade agora. Nova tentativa em ${INTERVAL_OK}s..."
    sleep "$INTERVAL_OK"
  elif echo "$RESP" | grep -qiE "NotAuthenticated|NotAuthorized|authorization"; then
    echo "❌ Erro de autenticação/permissão. Verifique a sessão do Cloud Shell:"
    echo "$RESP" | head -5
    exit 1
  else
    echo "⚠️  Erro inesperado:"
    echo "$RESP" | head -5
    echo "   Nova tentativa em ${INTERVAL_OK}s..."
    sleep "$INTERVAL_OK"
  fi
done
