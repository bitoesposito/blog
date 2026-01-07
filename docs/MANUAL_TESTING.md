# Manual Testing Guide

**Scopo:** Checklist per test manuali durante il refactoring

---

## 🚀 Setup Test

### Ambiente Locale

```bash
# Avvia dev server
npm run dev

# Build production
npm run build
npm run preview
```

### Tools Utili

- **Google Rich Results Test:** https://search.google.com/test/rich-results
- **Lighthouse:** DevTools > Lighthouse
- **Schema.org Validator:** https://validator.schema.org/
- **Open Graph Debugger:** https://www.opengraph.xyz/

---

## 📋 Test Checklist

### Pre-Refactoring (Baseline)

Eseguire questi test PRIMA di iniziare il refactoring per stabilire il baseline.

#### Blog Collection

**URL da testare:**
- `/blog` - Lista post
- `/blog/[id]` - Post principale
- `/blog/[parent]/[subpost]` - Subpost

**Checklist:**
- [ ] Lista post visualizzata
- [ ] Paginazione funziona
- [ ] Post principale: contenuto corretto
- [ ] Post principale: meta tags corretti
- [ ] Post principale: structured data valido
- [ ] Post principale: breadcrumbs corretti
- [ ] Post principale: navigation funziona
- [ ] Post principale: TOC sidebar funziona
- [ ] Post principale: subposts sidebar funziona
- [ ] Subpost: contenuto corretto
- [ ] Subpost: link parent funziona
- [ ] Subpost: navigation tra subposts funziona
- [ ] Subpost: noindex presente

#### Education Collection

**URL da testare:**
- `/education` - Lista education
- `/education/[id]` - Education principale
- `/education/[parent]/[subpost]` - Subpost

**Checklist:**
- [ ] Lista education visualizzata
- [ ] Education principale: contenuto corretto
- [ ] Education principale: meta tags presenti
- [ ] Education principale: breadcrumbs corretti
- [ ] Education principale: navigation funziona
- [ ] Education principale: TOC sidebar funziona
- [ ] Education principale: subposts sidebar funziona
- [ ] Subpost: contenuto corretto
- [ ] Subpost: link parent funziona
- [ ] Subpost: navigation funziona
- [ ] Subpost: noindex presente

#### Quote Collection

**URL da testare:**
- `/quote` - Lista quote
- `/quote/[id]` - Quote principale
- `/quote/[parent]/[subpost]` - Subpost

**Checklist:**
- [ ] Lista quote visualizzata
- [ ] Quote principale: contenuto corretto
- [ ] Quote principale: meta tags presenti
- [ ] Quote principale: breadcrumbs corretti
- [ ] Quote principale: navigation funziona
- [ ] Quote principale: TOC sidebar funziona
- [ ] Quote principale: subposts sidebar funziona (con folders)
- [ ] Quote principale: noindex funziona (se configurato)
- [ ] Subpost: contenuto corretto
- [ ] Subpost: link parent funziona
- [ ] Subpost: navigation funziona
- [ ] Subpost: noindex presente

---

## 🔍 Test Dettagliati

### Test SEO

Per ogni tipo di post (blog/education/quote):

1. **Meta Tags:**
   ```html
   <!-- Verificare presenza: -->
   <title>...</title>
   <meta name="description" content="...">
   <link rel="canonical" href="...">
   <meta property="og:title" content="...">
   <meta property="og:description" content="...">
   <meta property="og:image" content="...">
   <meta property="og:type" content="article"> <!-- IMPORTANTE -->
   <meta name="twitter:card" content="summary_large_image">
   ```

2. **Structured Data:**
   - Aprire Google Rich Results Test
   - Inserire URL del post
   - Verificare che `BlogPosting` sia valido
   - Verificare che tutti i campi richiesti siano presenti

3. **Breadcrumbs:**
   - Verificare visualizzazione corretta
   - Verificare link funzionanti
   - Verificare structured data breadcrumbs

### Test Navigation

1. **Post Navigation:**
   - Verificare link "precedente" funziona
   - Verificare link "successivo" funziona
   - Verificare link "parent" (se subpost) funziona
   - Verificare stati disabled quando non disponibili

2. **Subposts Sidebar:**
   - Verificare lista subposts corretta
   - Verificare highlight post corrente
   - Verificare link funzionanti
   - Verificare scroll automatico al post corrente
   - Verificare reading time visualizzato

3. **TOC Sidebar:**
   - Verificare headings corretti
   - Verificare link anchor funzionanti
   - Verificare struttura parent/subposts

### Test Responsive

Testare su:
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

Verificare:
- [ ] Layout non si rompe
- [ ] Sidebar si nasconde su mobile
- [ ] Navigation funziona
- [ ] Touch targets adeguati

### Test Performance

1. **Lighthouse:**
   - Eseguire audit
   - Verificare score ≥ baseline
   - Verificare Core Web Vitals

2. **Bundle Size:**
   ```bash
   npm run build
   # Verificare dimensione dist/
   ```

3. **Build Time:**
   ```bash
   time npm run build
   # Confrontare con baseline
   ```

---

## 🐛 Test Regressione

Dopo ogni fase di refactoring, verificare che:

- [ ] Nessuna funzionalità esistente sia rotta
- [ ] Tutti i link funzionano
- [ ] Tutte le immagini caricano
- [ ] Nessun errore in console
- [ ] Nessun warning TypeScript
- [ ] Build production successo

---

## 📝 Template Report Test

```markdown
## Test Report - [Fase X] - [Data]

### Ambiente
- Branch: `refactor/unify-collections`
- Commit: `[hash]`
- Build: ✅/❌

### Test Eseguiti
- [ ] Blog collection
- [ ] Education collection
- [ ] Quote collection
- [ ] SEO validation
- [ ] Performance

### Problemi Trovati
1. [Descrizione problema]
   - URL: `/blog/...`
   - Severità: Alta/Media/Bassa
   - Status: Aperto/Risolto

### Note
[Eventuali note aggiuntive]
```

---

**Nota:** Eseguire questi test dopo ogni fase significativa del refactoring.

