# Cat Gallery App – Implementation Plan (CONFIRMED)

**Date**: November 17, 2025  
**Status**: ✅ Ready for Implementation  
**Related Files**: `package.json`, `app/`, `app.json`, `tsconfig.json`

---

## ✅ CONFIRMED SPECIFICATIONS

| Aspect | Decision |
|--------|----------|
| **Navigation** | Stack-based with header (no bottom tabs) |
| **Pagination** | 12 cats per page (within 10-15 range) |
| **Offline Indicator** | YES - Visual banner when offline |
| **Header Badge** | Total favorites count (global) |
| **Type Organization** | Dedicated `types/` folder (separate) |
| **UI Components** | React.memo, useCallback, useMemo optimized |
| **State Management** | Redux Toolkit + RTK Query |
| **API Caching** | RTK Query automatic + AsyncStorage for favorites |

---

## Architecture Overview

```
TheCatsApi/
├── app/
│   ├── _layout.tsx → Root with Redux Provider + Stack navigation
│   ├── index.tsx → Cat list with FlatList (12/page)
│   └── [id].tsx → Cat detail screen (dynamic route)
├── types/
│   ├── index.ts → Cat, API response interfaces
│   ├── store.ts → Redux state types
│   └── navigation.ts → Route parameter types
├── hooks/
│   ├── useCats.ts → List pagination logic
│   ├── useCatDetail.ts → Single cat fetching
│   ├── useFavorites.ts → Favorite toggle + count
│   ├── useNetworkStatus.ts → Offline detection
│   └── useLocalStorage.ts → AsyncStorage persistence
├── store/
│   ├── store.ts → Redux store config
│   ├── slices/favoritesSlice.ts → Favorites state
│   └── api/catsApi.ts → RTK Query endpoints
├── components/
│   ├── CatListItem.tsx → Memoized list item
│   ├── CatCard.tsx → Detail view component
│   ├── FavoriteButton.tsx → Heart toggle button
│   ├── Header.tsx → Custom header + badge
│   ├── OfflineIndicator.tsx → Network status
│   ├── LoadingSpinner.tsx → Loading state
│   └── ErrorMessage.tsx → Error display
├── constants/
│   ├── api.ts → API URLs, keys, defaults
│   └── theme.ts → Colors, spacing
└── utils/
    ├── helpers.ts → Utility functions
    └── asyncStorage.ts → Storage helpers
```

---

## Phase 1: Setup & Dependencies ⚙️

### 1.1 Install Required Packages
```bash
npm install @reduxjs/toolkit react-redux \
  @react-native-async-storage/async-storage \
  @react-native-community/netinfo
```

### 1.2 Type Files (Order matters!)

**`types/index.ts`** - Cat API types
```typescript
// Cat interface from The Cat API
// CatsResponse interface for paginated results
// All fields properly typed
```

**`types/store.ts`** - Redux state types
```typescript
// FavoritesState interface
// RootState (full Redux state)
// AppDispatch type
```

**`types/navigation.ts`** - Router types
```typescript
// RootStackParamList
// Navigation prop types
```

### 1.3 Constants

**`constants/api.ts`**
```typescript
export const CAT_API_BASE_URL = 'https://api.thecatapi.com/v1';
export const CAT_API_KEY = 'live_VmQOLtk4O8ZpTj0dPTwd3D6mGujtsqKWF3oaYLTL6ylN78pxJvfJiWfdSe5iORcJ';
export const CATS_PER_PAGE = 12;
export const CACHE_TIME_MINUTES = 5;
```

### 1.4 Redux Store

**`store/store.ts`** - Configure with:
- Redux Toolkit setup
- AsyncStorage persistence middleware
- Typed hooks export: `useAppDispatch`, `useAppSelector`

**`store/slices/favoritesSlice.ts`** - Includes:
- State: `{ ids: string[] }`
- Actions: `addFavorite`, `removeFavorite`, `initializeFavorites`
- Selectors: `selectFavorites`, `selectIsFavorite`, `selectFavoritesCount`
- Persist to AsyncStorage on change

---

## Phase 2: API Layer 🔌

### 2.1 RTK Query Setup

**`store/api/catsApi.ts`**
- Base query: API URL + headers (x-api-key)
- Endpoint `getCats`: `{ limit, offset }` → returns paginated list
- Endpoint `getCatById`: `{ id }` → returns single cat
- Cache strategy: 5 min stale time
- Error handling with try-catch

### 2.2 Custom Hooks

**`hooks/useCats.ts`**
- Input: `page` number
- Output: `{ cats, isLoading, error, hasMore, loadMore, currentPage }`
- Handles offset calculation
- Integrates with RTK Query

**`hooks/useCatDetail.ts`**
- Input: `catId`
- Output: `{ cat, isLoading, error }`
- Fetches single cat from API

**`hooks/useFavorites.ts`**
- Input: `catId`
- Output: `{ isFavorite, toggleFavorite, favoritesCount }`
- Dispatches Redux actions
- Returns count for badge

**`hooks/useNetworkStatus.ts`**
- Output: `{ isOnline, isLoading }`
- Uses NetInfo to detect connection

**`hooks/useLocalStorage.ts`** (Generic persistence)
- Input: `key, initialValue`
- Output: `[value, setValue, isLoading]`
- Auto-syncs to AsyncStorage

---

## Phase 3: Components 🎨

All components use `React.memo` with custom comparison to prevent unnecessary re-renders.

### List Item Component
**`components/CatListItem.tsx`**
- Props: `cat` (Cat), `onPress` (callback)
- Display: image + name + breed
- Memoized to prevent re-renders

### Detail View Component
**`components/CatCard.tsx`**
- Props: `cat` (Cat)
- Display: full image, breed details, description, temperament

### Favorite Button
**`components/FavoriteButton.tsx`**
- Props: `catId`, `isFavorite`, `onToggle`
- Display: heart icon (filled when favorite)
- Callback on press with useCallback

### Header Component
**`components/Header.tsx`**
- Props: `favoritesCount`
- Display: title + heart icon with badge showing count
- Badge appears globally on all screens

### Offline Indicator
**`components/OfflineIndicator.tsx`**
- Props: `isOnline` (boolean)
- Display: red banner "You are offline" when offline
- Hidden when online

### Loading & Error
**`components/LoadingSpinner.tsx`** - ActivityIndicator
**`components/ErrorMessage.tsx`** - Error text + retry button

---

## Phase 4: Screens 📱

### Root Layout
**`app/_layout.tsx`** (Modify)
```tsx
- Wrap with Redux Provider (store)
- Setup Stack navigator
- Initialize AsyncStorage listeners
- Setup network status listener
- Configure header options
```

### Cat List Screen
**`app/index.tsx`** (Modify)
```tsx
- useCats(1) hook for initial load
- FlatList:
  * keyExtractor: (item) => item.id
  * onEndReached: handleLoadMore
  * renderItem: CatListItem
- Header: OfflineIndicator + favoritesCount badge
- onPress: navigate to detail
  router.push(`/${cat.id}`)
- Error/Loading states
```

### Cat Detail Screen
**`app/[id].tsx`** (Create)
```tsx
- useLocalSearchParams() get ID
- useCatDetail(id) hook for data
- useFavorites(id) hook for toggle
- Display CatCard
- Header:
  * Back button
  * FavoriteButton
  * favoritesCount badge
- Loading/Error/Offline states
```

---

## Phase 5: Offline Support 🔌➡️❌

### AsyncStorage Integration
**`utils/asyncStorage.ts`**
```typescript
- saveToStorage(key, value)
- loadFromStorage(key)
- removeFromStorage(key)
```

### Persistence Strategy
1. **Favorites**: Redux state → AsyncStorage (on every change)
2. **API Cache**: RTK Query automatic (keeps data indefinitely)
3. **Initialize**: Load favorites on app startup
4. **Offline**: Show banner, use cached data, queue updates
5. **Online**: Sync queued changes, refresh if needed

---

## Performance Optimizations 🚀

### React.memo Usage
```typescript
const CatListItem = React.memo(
  ({ cat, onPress }) => (...),
  (prev, next) => 
    prev.cat.id === next.cat.id &&
    prev.onPress === next.onPress
);
```

### useCallback for Handlers
```typescript
const handleLoadMore = useCallback(() => {
  // only recreated if dependencies change
}, [dependencies]);
```

### useMemo for Derived Data
```typescript
const favoriteIds = useMemo(
  () => favorites.map(f => f.id),
  [favorites]
);
```

### FlatList Optimization
```typescript
<FlatList
  keyExtractor={(item) => item.id}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
  removeClippedSubviews={true}
  {...}
/>
```

---

## Code Style Guidelines 📝

### TypeScript
- Use strict mode (already enabled)
- Type all props and returns
- Use interfaces from `types/` folder
- Avoid `any` type

### File Naming
- Components: PascalCase (CatListItem.tsx)
- Hooks: camelCase with 'use' prefix (useCats.ts)
- Utils: camelCase (helpers.ts)
- Types: snake_case file, exports PascalCase

### Import Order
1. React/React Native
2. Third-party libraries
3. Redux/store
4. Custom hooks
5. Components
6. Types
7. Constants
8. Utils

### Comments
- Function purpose (JSDoc style)
- Complex logic explanation
- TODO items
- No excessive comments on obvious code

---

## Testing Checklist ✅

### Manual QA Before Review
1. ✅ App opens, loads cats (first page)
2. ✅ Scroll to bottom, loads next page (pagination)
3. ✅ Tap cat, navigate to detail screen
4. ✅ See full cat details
5. ✅ Toggle favorite (heart fills)
6. ✅ Favorites count badge updates globally
7. ✅ Go back to list, favorite still marked
8. ✅ Close app completely
9. ✅ Reopen app, favorites persist
10. ✅ Toggle offline (turn off WiFi)
11. ✅ See offline banner
12. ✅ Navigate list/detail with cached data
13. ✅ Toggle online, new data loads

---

## Implementation Checklist ✅

### Phase 1: Setup
- [ ] Run `npm install` with new packages
- [ ] Create `types/index.ts`
- [ ] Create `types/store.ts`
- [ ] Create `types/navigation.ts`
- [ ] Create `constants/api.ts`
- [ ] Create `constants/theme.ts`
- [ ] Create `store/store.ts`
- [ ] Create `store/slices/favoritesSlice.ts`

### Phase 2: API Layer
- [ ] Create `store/api/catsApi.ts`
- [ ] Create `hooks/useCats.ts`
- [ ] Create `hooks/useCatDetail.ts`
- [ ] Create `hooks/useFavorites.ts`
- [ ] Create `hooks/useNetworkStatus.ts`
- [ ] Create `utils/asyncStorage.ts`

### Phase 3: Components
- [ ] Create `components/CatListItem.tsx` (memo)
- [ ] Create `components/CatCard.tsx`
- [ ] Create `components/FavoriteButton.tsx`
- [ ] Create `components/Header.tsx`
- [ ] Create `components/OfflineIndicator.tsx`
- [ ] Create `components/LoadingSpinner.tsx`
- [ ] Create `components/ErrorMessage.tsx`

### Phase 4: Screens
- [ ] Update `app/_layout.tsx`
- [ ] Update `app/index.tsx` (list screen)
- [ ] Create `app/[id].tsx` (detail screen)

### Phase 5: Polish
- [ ] Test all QA scenarios
- [ ] Fix any bugs
- [ ] Run eslint
- [ ] Code review

---

## 🎯 Ready to Start!

All specifications confirmed and documented. Start with **Phase 1** (Setup) - create types, constants, and Redux store first. This builds the solid foundation for all other phases.

**Questions?** Refer to this plan for architecture, patterns, and file locations.

Good luck! 🚀
