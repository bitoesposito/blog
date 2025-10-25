# Multi-stage build per ottimizzare le dimensioni dell'immagine
FROM node:20-alpine AS builder

# Imposta la directory di lavoro
WORKDIR /app

# Copia i file di configurazione delle dipendenze
COPY package*.json ./
COPY patches/ ./patches/

# Installa le dipendenze
RUN npm ci --only=production

# Copia il codice sorgente
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
