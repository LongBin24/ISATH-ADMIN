#!/usr/bin/env bash

set -e

ENV_FILE=".env.production"
TARGET="production"

if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE not found"
  exit 1
fi

echo "Uploading environment variables to Vercel ($TARGET)..."

while IFS='=' read -r key value; do
  # Skip empty lines and comments
  [[ -z "$key" ]] && continue
  [[ "$key" =~ ^[[:space:]]*# ]] && continue

  # Remove CR from Windows-style files
  key=$(printf '%s' "$key" | tr -d '\r')
  value=$(printf '%s' "$value" | tr -d '\r')

  case "$key" in
    KEYCLOAK_CLIENT_SECRET|BETTER_AUTH_SECRET|GOOGLE_CLIENT_SECRET|FACEBOOK_CLIENT_SECRET)
      printf '%s' "$value" |
        vercel env add "$key" "$TARGET" --sensitive --force
      ;;

    *)
      printf '%s' "$value" |
        vercel env add "$key" "$TARGET" --force
      ;;
  esac

done < "$ENV_FILE"

echo ""
echo "✅ Environment variables uploaded."
echo ""
vercel env ls production
