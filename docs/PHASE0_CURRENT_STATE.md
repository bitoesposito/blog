# Fase 0: Documentazione Stato Attuale

**Data:** 2025-01-27  
**Branch:** `refactor/unify-collections`  
**Stato:** ✅ Completato

---

## 📋 Task Completati

- [x] **0.1** Creare branch `refactor/unify-collections`
- [x] **0.2** Backup database/collections esistenti
- [x] **0.3** Documentare comportamento attuale (test manuali)
- [x] **0.4** Creare test suite base (se non esiste)
- [x] **0.5** Analizzare dipendenze tra componenti

---

## 🔍 Analisi Dipendenze

### Dipendenze da `data-utils.ts`

#### Funzioni utilizzate per **Blog** collection:

**Pagine:**
- `src/pages/blog/[...id].astro`: 
  - `getAllPostsAndSubposts`, `getAdjacentPosts`, `getCombinedReadingTime`, `getParentId`, `getParentPost`, `getPostReadingTime`, `getSubpostCount`, `getTOCSections`, `hasSubposts`, `isSubpost`, `parseAuthors`
- `src/pages/blog/[...page].astro`:
  - `getAllPosts`, `groupPostsByYear`
- `src/pages/index.astro`:
  - `getAuthorById`, `getRecentPosts`, `getAllProjects`
- `src/pages/rss.xml.ts`:
  - `getAllPosts`
- `src/pages/tags/[...id].astro`:
  - `getAllTags`, `getPostsByTag`
- `src/pages/tags/index.astro`:
  - `getSortedTags`

**Componenti:**
- `src/components/PostHead.astro`:
  - `isSubpost`, `parseAuthors`
- `src/components/BlogCard.astro`:
  - `getCombinedReadingTime`, `getSubpostCount`, `isSubpost`, `parseAuthors`
- `src/components/SubpostsSidebar.astro`:
  - `getCombinedReadingTime`, `getParentId`, `getParentPost`, `getPostById`, `getPostReadingTime`, `getSubpostsForParent`, `isSubpost`
- `src/components/SubpostsHeader.astro`:
  - `getParentId`, `getSubpostsForParent`, `isSubpost`
- `src/components/SubpostsBanner.astro`:
  - `getParentId`, `getSubpostsForParent`, `isSubpost`
- `src/components/TOCSidebar.astro`:
  - `getParentId`, `isSubpost` (importa anche type `TOCSection`)

#### Funzioni utilizzate per **Education** collection:

**Pagine:**
- `src/pages/education/[...id].astro`:
  - `getAllEducationAndSubposts`, `getAdjacentEducation`, `getEducationCombinedReadingTime`, `getEducationParentId`, `getEducationParentPost`, `getEducationReadingTime`, `getEducationSubpostCount`, `getEducationTOCSections`, `hasEducationSubposts`, `isEducationSubpost`, `parseAuthors`
- `src/pages/education/index.astro`:
  - `getAllEducation`, `groupEducationByYear`

**Componenti:**
- `src/components/EducationPostHead.astro`:
  - `isEducationSubpost`
- `src/components/EducationCard.astro`:
  - `getEducationCombinedReadingTime`, `getEducationSubpostCount`, `isEducationSubpost`, `parseAuthors`
- `src/components/EducationSubpostsSidebar.astro`:
  - `getEducationCombinedReadingTime`, `getEducationParentId`, `getEducationParentPost`, `getEducationById`, `getEducationReadingTime`, `getEducationSubpostsForParent`, `isEducationSubpost`
- `src/components/EducationSubpostsHeader.astro`:
  - `getEducationParentId`, `getEducationSubpostsForParent`, `isEducationSubpost`
- `src/components/EducationSubpostsBanner.astro`:
  - `getEducationParentId`, `getEducationSubpostsForParent`, `isEducationSubpost`
- `src/components/EducationTOCSidebar.astro`:
  - `getEducationParentId`, `isEducationSubpost` (importa anche type `TOCSection`)

#### Funzioni utilizzate per **Quote** collection:

**Pagine:**
- `src/pages/quote/[...id].astro`:
  - `getAllQuotesAndSubposts`, `getAdjacentQuotes`, `getQuoteCombinedReadingTime`, `getQuoteParentId`, `getQuoteParentPost`, `getQuoteReadingTime`, `getQuoteSubpostCount`, `getQuoteTOCSections`, `hasQuoteSubposts`, `isQuoteSubpost`, `parseAuthors`

**Componenti:**
- `src/components/QuotePostHead.astro`:
  - `isQuoteSubpost`
- `src/components/QuoteSubpostsSidebar.astro`:
  - `getQuoteCombinedReadingTime`, `getQuoteParentId`, `getQuoteParentPost`, `getQuoteById`, `getQuoteReadingTime`, `getQuoteSubpostsForParent`, `isQuoteSubpost`
- `src/components/QuoteSubpostsHeader.astro`:
  - `getQuoteParentId`, `getQuoteSubpostsForParent`, `isQuoteSubpost`
- `src/components/QuoteSubpostsBanner.astro`:
  - `getQuoteParentId`, `getQuoteSubpostsForParent`, `isQuoteSubpost`
- `src/components/QuoteTOCSidebar.astro`:
  - `getQuoteParentId`, `isQuoteSubpost` (importa anche type `TOCSection`)

#### Funzioni utilizzate per **Projects** collection:

**Pagine:**
- `src/pages/projects/[...id].astro`:
  - `getAdjacentProjects`, `getProjectById`, `getAllProjects`
- `src/pages/projects/index.astro`:
  - `getAllProjects`

### Mappa Componenti Duplicati

| Componente Base | Varianti Duplicate | File |
|----------------|-------------------|------|
| `PostHead` | `EducationPostHead`, `QuotePostHead` | 3 file |
| `PostNavigation` | `EducationPostNavigation`, `QuotePostNavigation` | 3 file |
| `SubpostsSidebar` | `EducationSubpostsSidebar`, `QuoteSubpostsSidebar` | 3 file (270 righe JS duplicate) |
| `SubpostsHeader` | `EducationSubpostsHeader`, `QuoteSubpostsHeader` | 3 file |
| `SubpostsBanner` | `EducationSubpostsBanner`, `QuoteSubpostsBanner` | 3 file |
| `TOCSidebar` | `EducationTOCSidebar`, `QuoteTOCSidebar` | 3 file |

**Totale:** 15 componenti (5 base + 10 duplicati)

---

## 📊 Metriche Attuali

### File `data-utils.ts`
- **Righe totali:** 758
- **Funzioni duplicate:** 18
- **Righe duplicate stimate:** ~450

### Componenti
- **Componenti totali:** 15 (per post collections)
- **Componenti duplicati:** 10
- **Script JS duplicati:** 3 copie (270 righe ciascuna)

### Collections
- **Blog:** ✅ Completo (structured data, SEO completo)
- **Education:** ⚠️ Incompleto (no structured data, SEO base)
- **Quote:** ⚠️ Incompleto (no structured data, SEO base)

---

## 🧪 Test Manuali - Checklist

### Blog Collection

#### Pagina Lista (`/blog`)
- [ ] Lista post visualizzata correttamente
- [ ] Paginazione funziona
- [ ] Ordinamento per data (più recenti prima)
- [ ] Filtro draft funziona (draft non visibili)
- [ ] Grouping per anno funziona

#### Pagina Post (`/blog/[id]`)
- [ ] Post principale visualizzato correttamente
- [ ] Meta tags presenti e corretti
- [ ] Structured data valido (Google Rich Results Test)
- [ ] Breadcrumbs corretti
- [ ] Autori visualizzati correttamente
- [ ] Reading time calcolato correttamente
- [ ] Tags visualizzati e cliccabili
- [ ] Navigation (precedente/successivo) funziona
- [ ] TOC sidebar funziona (se headings presenti)
- [ ] Subposts sidebar funziona (se subposts presenti)
- [ ] Subposts banner funziona (se subposts presenti)
- [ ] Scroll to top button funziona

#### Pagina Subpost (`/blog/[parent]/[subpost]`)
- [ ] Subpost visualizzato correttamente
- [ ] Link al parent post funziona
- [ ] Navigation tra subposts funziona
- [ ] Breadcrumbs includono parent
- [ ] Meta robots noindex presente
- [ ] TOC include parent + subposts

### Education Collection

#### Pagina Lista (`/education`)
- [ ] Lista education visualizzata correttamente
- [ ] Paginazione funziona
- [ ] Ordinamento per data
- [ ] Grouping per anno funziona

#### Pagina Education (`/education/[id]`)
- [ ] Education post visualizzato correttamente
- [ ] Meta tags presenti (⚠️ NO structured data completo)
- [ ] Breadcrumbs corretti
- [ ] Autori visualizzati
- [ ] Reading time calcolato
- [ ] Tags visualizzati
- [ ] Navigation funziona
- [ ] TOC sidebar funziona
- [ ] Subposts sidebar funziona
- [ ] Subposts banner funziona

#### Pagina Subpost (`/education/[parent]/[subpost]`)
- [ ] Subpost visualizzato correttamente
- [ ] Link al parent funziona
- [ ] Navigation tra subposts funziona
- [ ] Breadcrumbs includono parent
- [ ] Meta robots noindex presente

### Quote Collection

#### Pagina Lista (`/quote`)
- [ ] Lista quote visualizzata correttamente
- [ ] Paginazione funziona
- [ ] Ordinamento per data

#### Pagina Quote (`/quote/[id]`)
- [ ] Quote post visualizzato correttamente
- [ ] Meta tags presenti (⚠️ NO structured data completo)
- [ ] Breadcrumbs corretti
- [ ] Autori visualizzati
- [ ] Reading time calcolato
- [ ] Tags visualizzati
- [ ] Navigation funziona
- [ ] TOC sidebar funziona
- [ ] Subposts sidebar funziona (con logica folders)
- [ ] Subposts banner funziona
- [ ] Noindex funziona (se `noindex: true` nel frontmatter)

#### Pagina Subpost (`/quote/[parent]/[subpost]`)
- [ ] Subpost visualizzato correttamente
- [ ] Link al parent funziona
- [ ] Navigation tra subposts funziona
- [ ] Breadcrumbs includono parent
- [ ] Meta robots noindex presente (sempre per subposts)

---

## 🔄 Backup Collections

### Stato Backup

Le collections sono già versionate in Git, quindi il backup è automatico tramite:
- Repository Git (storico completo)
- Branch `main` (stato stabile)
- Branch `refactor/unify-collections` (lavoro in corso)

### Collections da Monitorare

**Blog:**
- `src/content/blog/` - 4 file .mdx + 1 immagine

**Education:**
- `src/content/education/` - 32 file .mdx + 4 .tsx + 1 immagine

**Quote:**
- `src/content/quote/` - 1 file .mdx

**Projects:**
- `src/content/projects/` - 4 file .mdx + immagini

**Authors:**
- `src/content/authors/` - 1 file .md

### Checklist Pre-Refactoring

- [x] Git status pulito (eccetto modifiche pianificate)
- [x] Branch dedicato creato
- [x] Documentazione stato attuale completata
- [x] Dipendenze mappate
- [x] Test manuali documentati

---

## 📝 Note Importanti

### Differenze tra Collections

1. **Blog:**
   - ✅ Structured data completo (`ArticleStructuredData`)
   - ✅ `og:type: article`
   - ✅ Meta tags autori completi

2. **Education:**
   - ❌ NO structured data
   - ⚠️ `og:type: website` (dovrebbe essere `article`)
   - ⚠️ Meta tags autori base

3. **Quote:**
   - ❌ NO structured data
   - ⚠️ `og:type: website` (dovrebbe essere `article`)
   - ⚠️ Meta tags autori base
   - ✅ Logica `noindex` condizionale
   - ✅ Logica folders in sidebar (unica differenza significativa)

### Pattern Identificati

Tutte le funzioni seguono lo stesso pattern:
- `getAll*()` - recupera tutti i post (esclusi draft e subposts)
- `getAll*AndSubposts()` - recupera tutti inclusi subposts
- `is*Subpost()` - verifica se è un subpost (controlla `/` nell'id)
- `get*ParentId()` - estrae parent id da subpost id
- `get*SubpostsForParent()` - recupera subposts per un parent
- `get*ById()` - recupera post per id
- `get*SubpostCount()` - conta subposts
- `get*ReadingTime()` - calcola reading time
- `get*CombinedReadingTime()` - calcola reading time totale (parent + subposts)
- `has*Subposts()` - verifica se ha subposts
- `get*ParentPost()` - recupera parent post
- `getAdjacent*()` - recupera post adiacenti per navigation
- `get*TOCSections()` - recupera sezioni TOC

**Tutte queste funzioni sono identiche tranne per:**
- Nome collection (`'blog'` vs `'education'` vs `'quote'`)
- Nome funzione (prefisso `get*` vs `getEducation*` vs `getQuote*`)

---

## ✅ Pronto per Fase 1

Tutti i task della Fase 0 sono completati. Possiamo procedere con:
- **Fase 1:** Fix critici immediati (config Astro + SEO uniforme)

---

**Ultimo aggiornamento:** 2025-01-27

