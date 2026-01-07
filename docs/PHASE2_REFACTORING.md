# Fase 2: Refactoring data-utils.ts

**Data inizio:** 2025-01-27  
**Branch:** `refactor/unify-collections`  
**Stato:** 🚧 In corso

---

## 🎯 Obiettivo

Eliminare ~450 righe duplicate creando funzioni generiche con TypeScript generics che supportano tutte le collections (blog, education, quote).

---

## 📋 Strategia

### Approccio Incrementale

1. **Creare type helpers** per collections
2. **Creare funzioni generiche** parallele alle esistenti
3. **Testare** con una collection alla volta
4. **Mantenere backward compatibility** con wrapper functions
5. **Migrare gradualmente** i componenti
6. **Rimuovere** funzioni vecchie solo alla fine

### Pattern da Seguire

```typescript
// PRIMA: 3 funzioni duplicate
export function isSubpost(postId: string): boolean
export function isEducationSubpost(postId: string): boolean
export function isQuoteSubpost(postId: string): boolean

// DOPO: 1 funzione generica + wrapper per compatibilità
export function isSubpostGeneric<T extends PostCollection>(
  postId: string
): boolean

// Wrapper per backward compatibility
export function isSubpost(postId: string): boolean {
  return isSubpostGeneric<'blog'>(postId)
}
export function isEducationSubpost(postId: string): boolean {
  return isSubpostGeneric<'education'>(postId)
}
export function isQuoteSubpost(postId: string): boolean {
  return isSubpostGeneric<'quote'>(postId)
}
```

---

## 📝 Task List

- [ ] **2.1** Creare type helpers per collections
- [ ] **2.2** Refactoring funzioni base (isSubpost, getParentId)
- [ ] **2.3** Refactoring funzioni getter (getAll, getById)
- [ ] **2.4** Refactoring funzioni subposts
- [ ] **2.5** Refactoring funzioni reading time
- [ ] **2.6** Refactoring funzioni navigation
- [ ] **2.7** Refactoring funzioni TOC
- [ ] **2.8** Mantenere backward compatibility
- [ ] **2.9** Test e verifica funzionalità

---

## 🔧 Implementazione

### Step 1: Type Helpers

```typescript
type PostCollection = 'blog' | 'education' | 'quote'

type CollectionEntryMap = {
  blog: CollectionEntry<'blog'>
  education: CollectionEntry<'education'>
  quote: CollectionEntry<'quote'>
}

type GetCollectionEntry<T extends PostCollection> = CollectionEntryMap[T]
```

### Step 2: Funzioni Base

Funzioni che non dipendono dalla collection:
- `isSubpost()` - identica per tutte
- `getParentId()` - identica per tutte

### Step 3: Funzioni Getter

Funzioni che recuperano dati dalla collection:
- `getAll*()` - con filtro draft e subpost
- `getAll*AndSubposts()` - solo filtro draft
- `get*ById()` - recupera per ID

### Step 4: Funzioni Subposts

Funzioni che gestiscono subposts:
- `get*SubpostsForParent()`
- `get*SubpostCount()`
- `get*ParentPost()`
- `has*Subposts()`

### Step 5: Funzioni Reading Time

Funzioni che calcolano reading time:
- `get*ReadingTime()`
- `get*CombinedReadingTime()`

### Step 6: Funzioni Navigation

Funzioni per navigazione tra post:
- `getAdjacent*()`

### Step 7: Funzioni TOC

Funzioni per table of contents:
- `get*TOCSections()`

---

## ✅ Criteri di Successo

- [ ] `data-utils.ts` ridotto da 758 a ~250 righe
- [ ] 0 funzioni duplicate
- [ ] Tutte le funzioni esistenti funzionano (backward compatibility)
- [ ] Build production successo
- [ ] Nessuna regressione funzionale
- [ ] Type safety al 100%

---

**Ultimo aggiornamento:** 2025-01-27

