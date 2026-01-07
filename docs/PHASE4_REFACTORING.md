# Fase 4: Unificazione Pagine Post - Piano di Refactoring

**Data inizio:** 2025-01-27  
**Branch:** `refactor/unify-collections`  
**Stato:** 🟡 In corso

---

## 🎯 Obiettivo

Unificare le 3 pagine duplicate (`blog/[...id].astro`, `education/[...id].astro`, `quote/[...id].astro`) in un template generico riutilizzabile, eliminando ~600 righe di codice duplicato.

---

## 📊 Analisi Differenze

### Differenze Identificate

| Aspetto | Blog | Education | Quote |
|---------|------|-----------|-------|
| **getStaticPaths** | `getAllPostsAndSubposts()` | `getAllEducationAndSubposts()` | `getAllQuotesAndSubposts()` |
| **Funzioni** | `getAdjacentPosts`, `getPostById`, etc. | `getAdjacentEducation`, `getEducationById`, etc. | `getQuoteById`, etc. (no navigation) |
| **Breadcrumbs label** | "Blog" | "Formazione" | "Preventivi" |
| **Breadcrumbs icon** | `lucide:library-big` | `lucide:graduation-cap` | N/A (no Breadcrumbs component) |
| **PostNavigation** | ✅ Sì | ✅ Sì | ❌ No |
| **Image** | Commentato | ✅ Mostrato | ❌ No |
| **Campi specifici** | Tags | Certificate | Client |
| **BreadcrumbListStructuredData** | ✅ Sì | ❌ No | ❌ No |
| **Layout struttura** | Standard | Standard | Leggermente diversa |

### Righe Duplicate

- **Blog**: ~339 righe
- **Education**: ~348 righe  
- **Quote**: ~256 righe
- **Totale**: ~943 righe
- **Stima duplicazione**: ~600 righe (~64%)

---

## 🏗️ Strategia di Unificazione

### Approccio: Template Generico con Configurazione

Creare un template generico che:
1. Usa le funzioni generiche già create in Phase 2
2. Accetta `collection` come parametro
3. Gestisce differenze con configurazione per collection
4. Unifica `getStaticPaths` usando funzioni generiche

### Configurazione per Collection

```typescript
const config = {
  blog: {
    breadcrumbLabel: 'Blog',
    breadcrumbIcon: 'lucide:library-big',
    showPostNavigation: true,
    showImage: false, // commentato
    showBreadcrumbListStructuredData: true,
    showBreadcrumbsComponent: true,
    specificFields: ['tags'],
  },
  education: {
    breadcrumbLabel: 'Formazione',
    breadcrumbIcon: 'lucide:graduation-cap',
    showPostNavigation: true,
    showImage: true,
    showBreadcrumbListStructuredData: false,
    showBreadcrumbsComponent: true,
    specificFields: ['certificate'],
  },
  quote: {
    breadcrumbLabel: 'Preventivi',
    breadcrumbIcon: null,
    showPostNavigation: false,
    showImage: false,
    showBreadcrumbListStructuredData: false,
    showBreadcrumbsComponent: false,
    specificFields: ['client'],
  },
}
```

---

## 📋 Task List

### Task 1: Creare Template Generico
- [ ] Creare `src/templates/PostPage.astro`
- [ ] Implementare logica generica per tutte le collections
- [ ] Gestire configurazione per collection
- [ ] Unificare `getStaticPaths` usando funzioni generiche

### Task 2: Unificare Funzioni
- [ ] Usare funzioni generiche da `@/lib/collections`
- [ ] Rimuovere dipendenze da funzioni collection-specifiche
- [ ] Gestire casi edge (es. Quote senza navigation)

### Task 3: Unificare Breadcrumbs
- [ ] Creare helper per generare breadcrumbs
- [ ] Gestire icone e label per collection
- [ ] Gestire caso Quote (no Breadcrumbs component)

### Task 4: Unificare Layout
- [ ] Standardizzare struttura layout
- [ ] Gestire campi specifici (certificate, client)
- [ ] Gestire immagine condizionale
- [ ] Gestire PostNavigation condizionale

### Task 5: Aggiornare Pagine
- [ ] Aggiornare `blog/[...id].astro` per usare template
- [ ] Aggiornare `education/[...id].astro` per usare template
- [ ] Aggiornare `quote/[...id].astro` per usare template

### Task 6: Test e Verifica
- [ ] Build test
- [ ] Type check
- [ ] Verifica funzionalità per tutte le collections
- [ ] Verifica SEO e structured data

---

## 🔧 Implementazione Tecnica

### Template Structure

```astro
---
// src/templates/PostPage.astro
import type { PostCollection } from '@/lib/collections'

interface Props {
  collection: PostCollection
  // ... altre props
}

// Configurazione per collection
const config = { ... }

// Usa funzioni generiche
const {
  getAllAndSubpostsGeneric,
  getByIdGeneric,
  getAdjacentGeneric,
  // ...
} = await import('@/lib/collections/generic')

// Logica unificata
---
```

### Funzioni da Usare

Usare le funzioni generiche già create:
- `getAllAndSubpostsGeneric<T>(collection)`
- `getByIdGeneric<T>(collection, id)`
- `getAdjacentGeneric<T>(collection, id)`
- `getTOCSectionsGeneric<T>(collection, id)`
- etc.

---

## ⚠️ Considerazioni

### Quote Special Cases
- Quote non ha PostNavigation
- Quote non ha Breadcrumbs component
- Quote ha campo `client` invece di tags
- Quote ha struttura layout leggermente diversa

### Education Special Cases
- Education mostra immagine
- Education ha campo `certificate`
- Education non ha BreadcrumbListStructuredData

### Blog Special Cases
- Blog ha BreadcrumbListStructuredData
- Blog ha immagine commentata
- Blog ha tags

---

## 📊 Metriche Attese

| Metrica | Prima | Dopo | Miglioramento |
|---------|-------|------|---------------|
| **File pagine** | 3 | 1 template + 3 wrapper | ✅ -67% duplicazione |
| **Righe duplicate** | ~600 | 0 | ✅ -100% |
| **Funzioni chiamate** | Collection-specifiche | Generiche | ✅ DRY |
| **Manutenibilità** | Bassa | Alta | ✅ Migliorata |

---

## ✅ Checklist

- [ ] Analisi differenze completata
- [ ] Piano di refactoring creato
- [ ] Template generico creato
- [ ] Funzioni unificate
- [ ] Breadcrumbs unificati
- [ ] Layout unificato
- [ ] Pagine aggiornate
- [ ] Test completati
- [ ] Documentazione aggiornata

---

**Ultimo aggiornamento:** 2025-01-27

