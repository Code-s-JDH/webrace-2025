# 1. Fáze: Build
FROM node:18-alpine AS builder

# Nastavení pracovní složky
WORKDIR /app

# Kopírujeme package.json a package-lock.json (nebo yarn.lock)
COPY package*.json ./

# Instalace všech závislostí
RUN npm install

# Kopírujeme celý zdrojový kód do pracovního adresáře
COPY . .

# (Volitelně) Vygenerování Prisma klienta
RUN npx prisma generate

# Build aplikace
RUN npm run build

# 2. Fáze: Produkční obraz
FROM node:18-alpine AS runner

WORKDIR /app

# Kopírujeme jen produkční závislosti
COPY package*.json ./
RUN npm ci --only=production

# Kopírujeme build z předchozí fáze
COPY --from=builder /app/dist ./dist

# Exponujeme port (upravte dle potřeby)
EXPOSE 3000

# Spouštíme aplikaci
CMD ["node", "dist/main.js"]
