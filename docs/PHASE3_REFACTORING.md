# Fase 3: Unificazione Componenti

**Data inizio:** 2025-01-27  
**Branch:** `refactor/unify-collections`  
**Stato:** 🚧 In corso

---

## 🎯 Obiettivo

Ridurre 15 componenti duplicati a 5 componenti generici riutilizzabili, eliminando ~810 righe di codice duplicato.

---

## 📊 Analisi Componenti Duplicati

### Componenti da Unificare

| Componente Base | Varianti Duplicate | Righe Duplicate | Note |
|----------------|-------------------|-----------------|------|
| `PostHead` | `EducationPostHead`, `QuotePostHead` | ~200 righe | SEO e structured data |
| `PostNavigation` | `EducationPostNavigation`, `QuotePostNavigation` | ~150 righe | Navigazione tra post |
| `SubpostsSidebar` | `EducationSubpostsSidebar`, `QuoteSubpostsSidebar` | ~810 righe | **270 righe JS duplicate x3** |
| `SubpostsHeader` | `EducationSubpostsHeader`, `QuoteSubpostsHeader` | ~150 righe | Header navigazione |
| `SubpostsBanner` | `EducationSubpostsBanner`, `QuoteSubpostsBanner` | ~120 righe | Banner subposts |
| `TOCSidebar` | `EducationTOCSidebar`, `QuoteTOCSidebar` | ~180 righe | Table of contents |

**Totale:** 15 componenti → 5 generici  
**Righe duplicate stimate:** ~1,610 righe

---

## 🏗️ Strategia di Unificazione

### Pattern Generico

Ogni componente generico accetterà:
- `collection`: `'blog' | 'education' | 'quote'`
- `basePath`: percorso base per URL (es. `/blog`, `/education`, `/quote`)
- Props specifiche per collection quando necessario

### Approccio Incrementale

1. **Analizzare differenze** tra componenti duplicati
2. **Creare componente generico** parallelo
3. **Migrare una collection** per volta
4. **Testare** dopo ogni migrazione
5. **Rimuovere** componenti vecchi

---

## 📝 Task List

- [ ] **3.1** Analizzare componenti PostHead duplicati
- [ ] **3.2** Creare componente generico `PostHead.astro`
- [ ] **3.3** Creare componente generico `PostNavigation.astro`
- [ ] **3.4** Creare componente generico `SubpostsSidebar.astro`
- [ ] **3.5** Creare componente generico `SubpostsHeader.astro`
- [ ] **3.6** Creare componente generico `TOCSidebar.astro`
- [ ] **3.7** Creare componente generico `SubpostsBanner.astro`
- [ ] **3.8** Aggiornare pagine per usare componenti generici
- [ ] **3.9** Rimuovere componenti duplicati
- [ ] **3.10** Test e verifica funzionalità

---

## 🔧 Implementazione

### PostHead.astro

**Props:**
```typescript
interface Props {
  post: CollectionEntry<'blog' | 'education' | 'quote'>
  collection: 'blog' | 'education' | 'quote'
  basePath: string
  breadcrumbs?: BreadcrumbItem[]
}
```

**Features:**
- SEO meta tags uniformi
- Structured data condizionale (già fatto in Fase 1)
- Supporto per tutte le collections

### PostNavigation.astro

**Props:**
```typescript
interface Props {
  adjacent: {
    newer: CollectionEntry<T> | null
    older: CollectionEntry<T> | null
    parent: CollectionEntry<T> | null
  }
  collection: 'blog' | 'education' | 'quote'
  basePath: string
}
```

### SubpostsSidebar.astro

**Props:**
```typescript
interface Props {
  post: CollectionEntry<T>
  collection: 'blog' | 'education' | 'quote'
  basePath: string
  showFolders?: boolean // Solo per Quote
}
```

**Features:**
- Script JS condiviso (1 sola copia)
- Supporto logica folders per Quote
- Funzioni generiche da collections/

### Altri Componenti

Stesso pattern per:
- `SubpostsHeader.astro`
- `SubpostsBanner.astro`
- `TOCSidebar.astro`

---

## ✅ Criteri di Successo

- [ ] 15 componenti ridotti a 5 generici
- [ ] ~1,610 righe duplicate eliminate
- [ ] Script JS condiviso (da 3 copie a 1)
- [ ] Tutte le collections funzionano
- [ ] Build completato senza errori
- [ ] Nessuna regressione funzionale
- [ ] Type safety al 100%

---

**Ultimo aggiornamento:** 2025-01-27

