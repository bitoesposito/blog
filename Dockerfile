# Multi-stage build per ottimizzare le dimensioni dell'immagine
# syntax=docker/dockerfile:1.4
FROM node:20-alpine AS builder

# Imposta la directory di lavoro
WORKDIR /app

# Aumenta il limite di memoria heap di Node.js per il build
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Copia i file di configurazione delle dipendenze
# Questo layer viene cachato se package*.json non cambiano
COPY package*.json ./
COPY patches/ ./patches/

# Installa TUTTE le dipendenze (incluso devDependencies per il build)
# Usa cache mount per velocizzare le installazioni successive
# La cache di npm viene mantenuta tra i build, evitando di scaricare pacchetti già scaricati
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copia il codice sorgente
# Questo layer viene ricostruito solo quando cambiano i file sorgente
COPY . .

# Build dell'applicazione Astro
RUN npm run build

# Stage finale con nginx per servire i file statici
FROM nginx:alpine

# Copia i file statici buildati
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configurazione nginx personalizzata
COPY nginx.conf /etc/nginx/nginx.conf

# Espone la porta 80
EXPOSE 80

# Comando per avviare nginx
CMD ["nginx", "-g", "daemon off;"]
