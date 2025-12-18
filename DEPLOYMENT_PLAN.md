# Piano di Intervento: CI/CD con pa11y e Zero-Downtime Deployment

## 📋 Situazione Attuale

### Configurazione Esistente
- **Workflow**: `.github/workflows/deploy.yml`
- **Deploy Strategy**: `docker compose down -v && docker compose up --build -d`
- **Problemi**:
  - ⚠️ Downtime durante il deploy (container viene fermato prima di avviare il nuovo)
  - ⚠️ Nessun test di accessibilità (pa11y)
  - ⚠️ Nessun rollback automatico in caso di fallimento
  - ⚠️ Nessun health check prima dello switch

### Infrastruttura
- **Stack**: Astro (static site) → Docker → Nginx (nel container)
- **Reverse Proxy**: Caddy sulla VPS (`/etc/caddy/Caddyfile`)
- **Porta attuale**: 3001 sulla VPS (blog)
- **Porte per blue-green**: 3000 (blue) e 3001 (green)
- **Dominio**: blog.vitoesposito.it, vitoesposito.it, www.vitoesposito.it

---

## 🎯 Obiettivi

1. ✅ Integrare **pa11y** per test di accessibilità automatici
2. ✅ Implementare **zero-downtime deployment** (blue-green strategy)
3. ✅ **Rollback automatico** se il deploy fallisce o health check non passa
4. ✅ **Health checks** prima dello switch di traffico

---

## 🏗️ Architettura Proposta

### Strategia: Blue-Green Deployment con Docker Compose

```
┌─────────────────────────────────────────┐
│         GitHub Actions Workflow         │
├─────────────────────────────────────────┤
│  1. Checkout code                       │
│  2. Build Astro                         │
│  3. Run pa11y tests                     │
│  4. Build Docker image (tag: timestamp) │
│  5. SSH to VPS                          │
│  6. Deploy to inactive stack            │
│  7. Health check                        │
│  8. Switch traffic (nginx/port swap)    │
│  9. Cleanup old stack                   │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              VPS Server                  │
├─────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐   │
│  │  blog-blue   │  │  blog-green  │   │
│  │  (port 3000) │  │  (port 3001) │   │
│  └──────┬───────┘  └──────┬───────┘   │
│         │                 │            │
│         └────────┬────────┘            │
│                  ▼                      │
│         Caddy Reverse Proxy             │
│         (/etc/caddy/Caddyfile)         │
│         (switch tra 3000 e 3001)       │
└─────────────────────────────────────────┘
```

---

## 📝 Piano di Implementazione

### Fase 1: Setup Struttura Base

#### 1.1 Creare script di deploy sulla VPS
**File**: `scripts/deploy.sh` (da creare)
- Gestisce il blue-green switching
- Health checks
- Rollback automatico
- Logging per debugging

**Responsabilità**:
- Identificare quale stack è attivo (blue/green)
- Deployare sul stack inattivo
- Eseguire health check
- Switchare traffico se OK
- Rollback se fallisce

#### 1.2 Modificare docker-compose.yml
**File**: `docker-compose.yml` → `docker-compose.blue.yml` e `docker-compose.green.yml`

**Cambiamenti**:
- Due file separati per blue e green
- Porte diverse (3000 per blue, 3001 per green)
- Naming dei container diverso (`blog-blue`, `blog-green`)
- Volume condiviso per mantenere stato (opzionale)

#### 1.3 Gestione switch Caddy
**File**: `scripts/switch-caddy.sh` (da creare)

**Funzione**:
- Modifica `/etc/caddy/Caddyfile` per switchare tra porta 3001 (blue) e 3003 (green)
- Esegue `sudo caddy reload` per applicare le modifiche senza downtime
- Mantiene backup del Caddyfile prima della modifica
- Log delle modifiche per audit

**Approccio**:
- Script legge quale stack è attivo (blue/green)
- Modifica la riga `reverse_proxy localhost:3001` → `reverse_proxy localhost:3003` (o viceversa)
- Reload Caddy con `sudo caddy reload` (zero-downtime reload)
- Se fallisce, ripristina Caddyfile precedente

---

### Fase 2: Integrazione pa11y

#### 2.1 Aggiungere pa11y al workflow
**File**: `.github/workflows/deploy.yml`

**Step da aggiungere**:
```yaml
- name: Install dependencies
  run: npm ci

- name: Build Astro site
  run: npm run build

- name: Start preview server
  run: npm run preview &
  
- name: Run pa11y accessibility tests
  run: |
    npm install -g pa11y-ci
    pa11y-ci --sitemap http://localhost:4321/sitemap.xml
```

**Configurazione pa11y**:
- File `.pa11yci.json` con configurazione
- Test su pagine principali + sitemap
- Threshold di errori accettabili
- Fail workflow se supera threshold

#### 2.2 Configurazione pa11y
**File**: `.pa11yci.json` (da creare)

**Contenuto**:
- Standard WCAG (AA level)
- Pagine da testare (homepage, blog, education)
- Timeout e retry logic
- Report formato JSON/HTML

---

### Fase 3: Zero-Downtime Deployment

#### 3.1 Script di deploy avanzato
**File**: `scripts/deploy.sh` (implementazione completa)

**Logica**:
1. **Identifica stack attivo**: 
   - Legge `/etc/caddy/Caddyfile` per vedere quale porta è configurata (3000=blue, 3001=green)
   - Oppure controlla quale container è running (`docker ps`)
2. **Deploy su stack inattivo**: 
   - `docker compose -f docker-compose.{color}.yml up --build -d`
   - Attende che container sia healthy (max 60s)
3. **Health check**: 
   - `curl -f http://localhost:{port}/` con retry (max 5 tentativi, 10s intervallo)
   - Verifica status code 200
   - Verifica contenuto base (es. presenza di `<html>`)
   - Verifica che risponda in < 2s
4. **Switch traffico Caddy**:
   - Se health check OK: modifica `/etc/caddy/Caddyfile` e esegue `sudo caddy reload`
   - Se health check FAIL: rollback (mantieni stack attivo, ferma nuovo stack)
5. **Cleanup**: Rimuove vecchio stack dopo conferma (opzionale, con delay di 5 minuti per sicurezza)

#### 3.2 Health check endpoint
**File**: `scripts/health-check.sh` (da creare)

**Funzione**:
- Verifica che il container risponda
- Verifica che la risposta sia valida HTML
- Verifica che non ci siano errori 5xx
- Ritorna exit code 0 se OK, 1 se FAIL

---

### Fase 4: Rollback Automatico

#### 4.1 Gestione errori nel workflow
**File**: `.github/workflows/deploy.yml`

**Strategia**:
- Ogni step critico ha `continue-on-error: false` (default)
- Se deploy fallisce: script di rollback automatico
- Se health check fallisce: script ferma nuovo stack, mantiene vecchio
- Notifica via GitHub Actions (commento su commit o issue)

#### 4.2 Script di rollback
**File**: `scripts/rollback.sh` (da creare)

**Funzione**:
- Ferma il nuovo stack fallito
- Verifica che lo stack precedente sia ancora attivo
- Se necessario, riavvia lo stack precedente
- Log dell'errore per debugging

---

### Fase 5: Miglioramenti e Monitoring

#### 5.1 Logging e reporting
- Log strutturati degli step di deploy
- Report pa11y salvato come artifact
- Notifiche (opzionale: Slack, email, Discord)

#### 5.2 Monitoring post-deploy
- Verifica che il sito sia raggiungibile pubblicamente
- Smoke test su URL principali
- Alert se qualcosa va storto

---

## 📁 Struttura File da Creare/Modificare

### File Nuovi da Creare

```
.github/
  workflows/
    deploy.yml                    # MODIFICARE (aggiungere pa11y, migliorare deploy)
    
scripts/
  deploy.sh                      # NUOVO - Script principale di deploy
  health-check.sh                # NUOVO - Health check del container
  rollback.sh                    # NUOVO - Rollback automatico
  switch-caddy.sh                # NUOVO - Switch Caddyfile tra blue/green
  
docker-compose.blue.yml          # NUOVO - Stack blue (porta 3000)
docker-compose.green.yml         # NUOVO - Stack green (porta 3001)

.pa11yci.json                    # NUOVO - Configurazione pa11y
```

### File da Modificare

```
docker-compose.yml               # MODIFICARE o sostituire con blue/green
package.json                     # MODIFICARE - Aggiungere script per health check locale
```

---

## 🔧 Dettagli Tecnici

### Blue-Green Strategy con Caddy

**Implementazione**:
- `docker-compose.blue.yml` → porta 3000 (stack blue)
- `docker-compose.green.yml` → porta 3001 (stack green)
- Caddy reverse proxy (`/etc/caddy/Caddyfile`) punta a `localhost:3000` o `localhost:3001`
- Script `switch-caddy.sh` modifica Caddyfile e esegue `sudo caddy reload` (zero-downtime)
- Backup automatico del Caddyfile prima di ogni modifica
- Rollback automatico se reload fallisce

**Processo di Switch**:
1. Identifica porta attiva leggendo Caddyfile: `grep "reverse_proxy localhost:" /etc/caddy/Caddyfile`
2. Deploy su stack inattivo (porta opposta)
3. Health check sul nuovo stack
4. Se OK: modifica Caddyfile e `sudo caddy reload`
5. Se FAIL: mantiene Caddyfile originale, ferma nuovo stack

**Esempio Switch Caddyfile**:
```bash
# Caddyfile attuale (blue attivo su porta 3000)
blog.vitoesposito.it, vitoesposito.it, www.vitoesposito.it {
	reverse_proxy localhost:3000
}

# Dopo switch (green attivo su porta 3001)
blog.vitoesposito.it, vitoesposito.it, www.vitoesposito.it {
	reverse_proxy localhost:3001
}
```

**Script switch-caddy.sh**:
- Legge porta attuale dal Caddyfile
- Crea backup: `/etc/caddy/Caddyfile.backup.$(date +%Y%m%d_%H%M%S)`
- Sostituisce porta nel Caddyfile (3000 ↔ 3001)
- Esegue `sudo caddy reload` (zero-downtime)
- Se reload fallisce: ripristina backup e exit 1

**Nota Migrazione Iniziale**:
- Al primo deploy, il Caddyfile attualmente punta a `localhost:3001`
- Lo script dovrà riconoscere questa situazione e configurare:
  - Blue stack su porta 3000 (nuovo)
  - Green stack su porta 3001 (attuale)
  - Switchare Caddyfile da 3001 a 3000 per attivare blue
  - Oppure mantenere 3001 come green e deployare blue su 3000, poi switchare

### Health Check

**Criteri**:
1. Container Docker è running (`docker ps`)
2. Porta risponde (`curl -f http://localhost:{port}`)
3. Status code 200
4. Contenuto HTML valido
5. Tempo di risposta < 2s

**Implementazione**:
```bash
# Retry logic: 5 tentativi, 10s intervallo
for i in {1..5}; do
  if curl -f -s --max-time 5 http://localhost:$PORT/ > /dev/null; then
    echo "Health check passed"
    exit 0
  fi
  sleep 10
done
exit 1
```

### pa11y Configuration

**Standard**: WCAG 2.1 Level AA
**Pagine da testare**:
- Homepage (`/`)
- Blog index (`/blog`)
- Education index (`/education`)
- Pagine dinamiche (sample da sitemap)

**Threshold**: Max 5 errori per pagina (configurabile)

---

## 🚀 Ordine di Implementazione Consigliato

### Step 1: Setup Base (Senza modificare deploy attuale)
1. ✅ Creare `scripts/deploy.sh` con logica base
2. ✅ Creare `docker-compose.blue.yml` e `docker-compose.green.yml`
3. ✅ Testare manualmente sulla VPS

### Step 2: Integrare pa11y (Test locale)
1. ✅ Aggiungere `.pa11yci.json`
2. ✅ Testare pa11y localmente
3. ✅ Aggiungere step pa11y al workflow (prima del deploy)

### Step 3: Zero-Downtime Deploy (Test su branch separato)
1. ✅ Modificare workflow per usare nuovo script
2. ✅ Implementare health checks
3. ✅ Testare su branch di test prima di merge su main

### Step 4: Rollback e Monitoring
1. ✅ Implementare rollback automatico
2. ✅ Aggiungere logging dettagliato
3. ✅ Testare scenario di fallimento

### Step 5: Cleanup e Documentazione
1. ✅ Rimuovere vecchio `docker-compose.yml` (o mantenerlo come backup)
2. ✅ Documentare processo
3. ✅ Aggiungere commenti agli script

---

## ⚠️ Considerazioni e Rischi

### Rischi
1. **Complessità**: Blue-green aggiunge complessità al deploy
2. **Storage**: Due stack possono usare più spazio (mitigato: cleanup automatico)
3. **Porte**: Necessità di gestire due porte (3000, 3001)
4. **Migrazione iniziale**: Il primo deploy dovrà migrare da porta 3001 attuale a porta 3000 (blue), lasciando 3001 per green
5. **Permessi sudo**: Script deve avere permessi per modificare `/etc/caddy/Caddyfile` e eseguire `caddy reload`
6. **Testing**: Necessario testare su ambiente di staging prima
7. **Caddy reload**: Se il reload fallisce, potrebbe causare downtime (mitigato: backup e rollback automatico)

### Mitigazioni
1. **Backup del vecchio workflow**: Mantenere branch con deploy originale
2. **Dry-run mode**: Script con `--dry-run` per testare senza modifiche
3. **Backup Caddyfile**: Backup automatico prima di ogni modifica (`/etc/caddy/Caddyfile.backup`)
4. **Rollback automatico**: Se `caddy reload` fallisce, ripristina Caddyfile originale
5. **Permessi SSH**: Verificare che l'utente SSH possa eseguire `sudo caddy reload` senza password (NOPASSWD)
6. **Rollback manuale**: Documentare come fare rollback manuale se necessario
7. **Monitoring**: Log dettagliati per debugging

### Alternative Considerate
- **Rolling Update**: Più complesso con docker-compose
- **Canary Deployment**: Overkill per un blog statico
- **Simple Health Check + Swap**: Meno robusto ma più semplice

---

## 📊 Checklist Finale

### Prima di Implementare
- [ ] Backup del workflow attuale
- [ ] Test locale di pa11y
- [ ] Verifica spazio disponibile sulla VPS
- [ ] Documentare processo di rollback manuale

### Dopo Implementazione
- [ ] Test su branch separato
- [ ] Verifica zero-downtime (monitorare durante deploy)
- [ ] Test scenario di fallimento (simulare errore)
- [ ] Verifica cleanup automatico
- [ ] Monitorare per alcuni deploy

---

## 🔗 Risorse Utili

- **pa11y**: https://github.com/pa11y/pa11y
- **pa11y-ci**: https://github.com/pa11y/pa11y-ci
- **Blue-Green Deployment**: https://martinfowler.com/bliki/BlueGreenDeployment.html
- **Docker Compose Health Checks**: https://docs.docker.com/compose/compose-file/compose-file-v3/#healthcheck
- **Caddy Reload**: https://caddyserver.com/docs/command-line#caddy-reload

## 🔐 Configurazione Permessi Sudo (Richiesta)

Per permettere allo script di modificare il Caddyfile e ricaricare Caddy senza password, aggiungere al file `/etc/sudoers` sulla VPS:

```bash
# Permettere all'utente SSH di eseguire caddy reload senza password
vito ALL=(ALL) NOPASSWD: /usr/bin/caddy reload
```

Oppure creare un file in `/etc/sudoers.d/caddy-reload`:
```
vito ALL=(ALL) NOPASSWD: /usr/bin/caddy reload
```

**Nota**: Sostituire `vito` con l'utente SSH effettivo configurato in `HOST_USERNAME`.

---

## 📝 Note Finali

Questo piano mantiene la compatibilità con i secrets esistenti e non richiede modifiche alla configurazione della VPS oltre agli script di deploy. L'implementazione può essere fatta gradualmente, testando ogni fase prima di procedere alla successiva.

**Prossimi Passi**: Iniziare con Fase 1 (Setup Base) e testare manualmente prima di integrare nel workflow GitHub Actions.
