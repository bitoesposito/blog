# Fase 2B: Modularizzazione data-utils.ts

**Data inizio:** 2025-01-27  
**Branch:** `refactor/unify-collections`  
**Stato:** 🚧 Pianificazione

---

## 🎯 Obiettivo

Separare `data-utils.ts` (668 righe) in moduli più piccoli e organizzati seguendo il principio di **Single Responsibility**.

---

## 📊 Analisi Responsabilità Attuali

Il file `data-utils.ts` contiene attualmente:

1. **Type Helpers** (~25 righe)
   - `PostCollection`, `CollectionEntryMap`, `GetCollectionEntry`
   - `TOCHeading`, `TOCSection`

2. **Funzioni Generiche** (~250 righe)
   - `isSubpostGeneric`, `getParentIdGeneric`
   - `getAllGeneric`, `getAllAndSubpostsGeneric`, `getByIdGeneric`
   - `getSubpostsForParentGeneric`, `getSubpostCountGeneric`, `hasSubpostsGeneric`, `getParentPostGeneric`
   - `getReadingTimeGeneric`, `getCombinedReadingTimeGeneric`
   - `getAdjacentGeneric`, `getTOCSectionsGeneric`

3. **Wrapper Blog** (~80 righe)
   - Tutte le funzioni `get*Posts*`, `get*Post*`, `isSubpost`, `getParentId`

4. **Wrapper Education** (~100 righe)
   - Tutte le funzioni `get*Education*`, `isEducationSubpost`, `getEducationParentId`

5. **Wrapper Quote** (~100 righe)
   - Tutte le funzioni `get*Quote*`, `isQuoteSubpost`, `getQuoteParentId`

6. **Authors** (~20 righe)
   - `getAllAuthors`, `getAuthorById`, `parseAuthors`

7. **Projects** (~30 righe)
   - `getAllProjects`, `getProjectById`, `getAdjacentProjects`

8. **Tags** (~30 righe)
   - `getAllTags`, `getSortedTags`, `getPostsByTag`, `getPostsByAuthor`, `getRecentPosts`

9. **Utilities Blog-specific** (~30 righe)
   - `groupPostsByYear`

---

## 🏗️ Struttura Proposta

```
src/lib/collections/
├── types.ts              # Type helpers e types comuni
├── generic.ts            # Funzioni generiche (private)
├── blog.ts               # Wrapper per blog collection
├── education.ts          # Wrapper per education collection
├── quote.ts              # Wrapper per quote collection
├── authors.ts            # Funzioni per authors
├── projects.ts           # Funzioni per projects
├── tags.ts               # Funzioni per tags
└── index.ts              # Barrel export (backward compatibility)
```

---

## 📝 Dettaglio Moduli

### `types.ts` (~50 righe)
```typescript
export type PostCollection = 'blog' | 'education' | 'quote'
export type TOCHeading = { ... }
export type TOCSection = { ... }
type CollectionEntryMap = { ... }
type GetCollectionEntry<T> = ...
```

### `generic.ts` (~250 righe)
```typescript
// Funzioni generiche private
function isSubpostGeneric(...)
function getParentIdGeneric(...)
async function getAllGeneric<T>(...)
async function getAllAndSubpostsGeneric<T>(...)
async function getByIdGeneric<T>(...)
async function getSubpostsForParentGeneric<T>(...)
async function getSubpostCountGeneric<T>(...)
async function hasSubpostsGeneric<T>(...)
async function getParentPostGeneric<T>(...)
async function getReadingTimeGeneric<T>(...)
async function getCombinedReadingTimeGeneric<T>(...)
async function getAdjacentGeneric<T>(...)
async function getTOCSectionsGeneric<T>(...)
```

### `blog.ts` (~80 righe)
```typescript
import { ... } from './generic'
import { ... } from './types'

export async function getAllPosts() { ... }
export async function getAllPostsAndSubposts() { ... }
export async function getPostById() { ... }
export async function getSubpostsForParent() { ... }
export async function getSubpostCount() { ... }
export async function hasSubposts() { ... }
export async function getParentPost() { ... }
export async function getCombinedReadingTime() { ... }
export async function getPostReadingTime() { ... }
export async function getAdjacentPosts() { ... }
export async function getTOCSections() { ... }
export function isSubpost() { ... }
export function getParentId() { ... }
export function groupPostsByYear() { ... }
```

### `education.ts` (~100 righe)
```typescript
// Stesso pattern di blog.ts
```

### `quote.ts` (~100 righe)
```typescript
// Stesso pattern di blog.ts
```

### `authors.ts` (~30 righe)
```typescript
export async function getAllAuthors() { ... }
export async function getAuthorById() { ... }
export async function parseAuthors() { ... }
```

### `projects.ts` (~40 righe)
```typescript
export async function getAllProjects() { ... }
export async function getProjectById() { ... }
export async function getAdjacentProjects() { ... }
```

### `tags.ts` (~50 righe)
```typescript
export async function getAllTags() { ... }
export async function getSortedTags() { ... }
export async function getPostsByTag() { ... }
export async function getPostsByAuthor() { ... }
export async function getRecentPosts() { ... }
```

### `index.ts` (~100 righe)
```typescript
// Barrel export per backward compatibility
// Re-export tutto da tutti i moduli
export * from './types'
export * from './blog'
export * from './education'
export * from './quote'
export * from './authors'
export * from './projects'
export * from './tags'
```

---

## ✅ Vantaggi

1. **Single Responsibility**: Ogni modulo ha una responsabilità chiara
2. **Manutenibilità**: Più facile trovare e modificare codice
3. **Testabilità**: Moduli più piccoli più facili da testare
4. **Leggibilità**: File più piccoli più facili da leggere
5. **Scalabilità**: Facile aggiungere nuove collections
6. **Backward Compatibility**: `index.ts` mantiene API esistente

---

## 🔄 Strategia di Migrazione

### Step 1: Creare struttura cartelle
```bash
mkdir -p src/lib/collections
```

### Step 2: Creare moduli (in ordine di dipendenza)
1. `types.ts` (nessuna dipendenza)
2. `generic.ts` (dipende da `types.ts`)
3. `authors.ts`, `projects.ts`, `tags.ts` (dipendenze minime)
4. `blog.ts`, `education.ts`, `quote.ts` (dipendono da `generic.ts` e `types.ts`)
5. `index.ts` (barrel export)

### Step 3: Aggiornare import
- Sostituire `@/lib/data-utils` con `@/lib/collections`
- Verificare che tutti gli import funzionino

### Step 4: Rimuovere `data-utils.ts`
- Dopo verifica completa, eliminare il file vecchio

### Step 5: Test
- Build completo
- Verifica funzionalità
- Type check

---

## 📋 Checklist

- [ ] Creare struttura cartelle `src/lib/collections/`
- [ ] Creare `types.ts` con tutti i types
- [ ] Creare `generic.ts` con funzioni generiche
- [ ] Creare `authors.ts`
- [ ] Creare `projects.ts`
- [ ] Creare `tags.ts`
- [ ] Creare `blog.ts`
- [ ] Creare `education.ts`
- [ ] Creare `quote.ts`
- [ ] Creare `index.ts` (barrel export)
- [ ] Aggiornare tutti gli import nel codebase
- [ ] Test build
- [ ] Test funzionalità
- [ ] Rimuovere `data-utils.ts`
- [ ] Aggiornare documentazione

---

## ⚠️ Note Importanti

1. **Backward Compatibility**: `index.ts` deve esportare tutto per mantenere compatibilità
2. **Circular Dependencies**: Evitare dipendenze circolari tra moduli
3. **Type Exports**: Assicurarsi che tutti i types siano esportati correttamente
4. **Private Functions**: Le funzioni generiche devono rimanere private (non esportate da `index.ts`)

---

**Ultimo aggiornamento:** 2025-01-27

