# Cat Gallery App – Implementation Plan

**Date**: November 17, 2025  
**Status**: Planning  
**Related Files**: `package.json`, `app/`, `app.json`, `tsconfig.json`

## Overview

Build a feature-rich React Native Cat Gallery app using The Cat API, Redux Toolkit for state management, RTK Query for API calls, and custom hooks for business logic. The app will include cat listing with pagination, detailed views, favorites management, and offline support with proper TypeScript typing and performance optimization.

**Key Technologies**:
- Expo Router for navigation
- Redux Toolkit + RTK Query for state management & API calls
- AsyncStorage for persistence
- Custom hooks for reusable logic
- React.memo, useCallback, useMemo for optimization

## Requirements

### Functional Requirements
- **Cat List Screen**: Fetch and display scrollable list of cats with pagination
- **Cat Detail Screen**: Show full cat details when user selects a cat
- **Favorites Management**: Mark/unmark cats as favorites; persist across sessions
- **Favorites Screen**: Display list of marked favorite cats
- **Offline Support**: Cache API data and allow viewing favorites offline

### Non-Functional Requirements
- TypeScript strict mode for type safety
- Clean, readable code with proper separation of concerns
- Performance optimization to prevent unnecessary re-renders
- Proper error handling and loading states
- Modular, scalable folder structure

### Constraints
- Use Redux Toolkit for state management and RTK Query for API
- Use FlatList with keyExtractor for cat list
- Implement custom hooks to separate UI from business logic
- Use Expo Router for navigation
- API Key: `live_VmQOLtk4O8ZpTj0dPTwd3D6mGujtsqKWF3oaYLTL6ylN78pxJvfJiWfdSe5iORcJ`

## Current State Analysis

### Existing Setup
- ✅ Expo project initialized with TypeScript support
- ✅ React 19, React Native 0.81.5 configured
- ✅ Expo Router v6 installed for navigation
- ✅ React Navigator setup available
- ✅ Vector icons available for UI
- ❌ Redux Toolkit not yet installed
- ❌ RTK Query not yet installed
- ❌ AsyncStorage not yet installed
- ❌ Folder structure for features/screens not created

### Dependencies to Add
```json
{
  "@reduxjs/toolkit": "^1.9.x",
  "react-redux": "^9.x.x",
  "@reduxjs/toolkit/query/react": "included",
  "@react-native-async-storage/async-storage": "^2.x.x"
}
```

### Current App Structure
```
app/
  _layout.tsx (Root Stack)
  index.tsx (Empty home screen)
app-example/ (Reference implementation)
```

## Proposed Solution

### Architecture Overview

```
TheCatsApi/
├── app/
│   ├── _layout.tsx (Root navigation setup)
│   ├── index.tsx (Cat list screen)
│   ├── [id].tsx (Cat detail screen)
│   ├── favorites/ (Favorites tab/screen)
│   └── _layout.tsx (Tab navigation if using bottom tabs)
├── hooks/
│   ├── useCats.ts (Custom hook for cat list with pagination)
│   ├── useCatDetail.ts (Custom hook for single cat)
│   ├── useFavorites.ts (Custom hook for favorites management)
│   └── useLocalStorage.ts (Persistence hook)
├── store/
│   ├── store.ts (Redux store configuration)
│   ├── slices/
│   │   └── favoritesSlice.ts (Favorites state)
│   └── api/
│       └── catsApi.ts (RTK Query API)
├── components/
│   ├── CatListItem.tsx (Memoized list item)
│   ├── CatCard.tsx (Cat detail card)
│   ├── FavoriteButton.tsx (Toggle favorite button)
│   ├── LoadingSpinner.tsx
│   └── ErrorBoundary.tsx
├── types/
│   └── index.ts (TypeScript interfaces)
├── constants/
│   └── api.ts (API URLs, keys)
└── utils/
    └── helpers.ts (Utility functions)
```

### Implementation Strategy

#### Phase 1: Setup & Store Configuration (Foundation)

**1.1 Install Dependencies**
```bash
npm install @reduxjs/toolkit react-redux @react-native-async-storage/async-storage
```

**1.2 Create Type Definitions** – [`types/index.ts`]
- Define `Cat` interface with all API response fields
- Define `FavoritesState` interface
- Define API pagination/response interfaces

**1.3 Create Constants** – [`constants/api.ts`]
- API base URL: `https://api.thecatapi.com/v1`
- API key constant
- Pagination defaults (limit per page)

**1.4 Configure Redux Store** – [`store/store.ts`]
- Initialize store with Redux Toolkit
- Add favorites slice reducer
- Configure persistence with AsyncStorage middleware
- Export typed hooks: `useAppDispatch`, `useAppSelector`

**1.5 Create Favorites Slice** – [`store/slices/favoritesSlice.ts`]
- State: array of favorite cat IDs
- Actions: `addFavorite`, `removeFavorite`, `initializeFavorites` (from storage)
- Selectors: `selectFavorites`, `selectIsFavorite`
- Handle AsyncStorage persistence on changes

#### Phase 2: API Layer with RTK Query (Data Fetching)

**2.1 Create RTK Query API** – [`store/api/catsApi.ts`]
- Configure base query with API URL and authentication header
- Endpoint: `getCats` (with pagination: limit, offset)
- Endpoint: `getCatById` (for detail view)
- Include cache invalidation strategy
- Setup refetch behavior for offline support

**2.2 Create Custom Hooks** – [`hooks/`]

**`useCats.ts`** – Pagination & list management
```
- Input: page number
- Output: { cats, isLoading, error, hasMore, loadMore }
- Internally manages offset calculation
- Uses RTK Query getCats endpoint
```

**`useCatDetail.ts`** – Single cat details
```
- Input: cat ID
- Output: { cat, isLoading, error }
- Uses RTK Query getCatById endpoint
```

**`useFavorites.ts`** – Favorites management
```
- Input: cat ID
- Output: { isFavorite, toggleFavorite }
- Dispatches Redux actions
- Manages AsyncStorage sync
```

**`useLocalStorage.ts`** – General persistence
```
- Generic hook for persisting data to AsyncStorage
- Input/Output: [value, setValue, isLoading]
```

#### Phase 3: UI Components (Reusable, Optimized)

**3.1 Create Memoized Components** – [`components/`]

**`CatListItem.tsx`** – Wrapped with `React.memo`
```
- Props: cat object, onPress callback
- Display: cat image, name, breed
- Optional: favorite indicator
- Uses useCallback for onPress
```

**`CatCard.tsx`** – Detail view component
```
- Props: cat object
- Display: full cat info (image, breed, description, temperament)
```

**`FavoriteButton.tsx`** – Toggle button
```
- Props: catId, isFavorite, onToggle
- Display: icon button with favorite state
- Uses useCallback
```

**`LoadingSpinner.tsx`** – Loading state
```
- ActivityIndicator or Skeleton
```

**`ErrorBoundary.tsx`** – Error handling
```
- Catch and display errors gracefully
```

#### Phase 4: Screens Implementation (Navigation Routes)

**4.1 Root Layout** – [`app/_layout.tsx`] (Modify existing)
```
- Wrap with Redux Provider
- Setup Stack navigation
- Configure screen options
```

**4.2 Cat List Screen** – [`app/index.tsx`] (Modify existing)
```
- FlatList component
- keyExtractor: item.id
- onEndReached: trigger loadMore (pagination)
- Render CatListItem for each cat
- Header with badge showing favorite count
- onPress navigates to detail screen: router.push(`/${cat.id}`)
```

**4.3 Cat Detail Screen** – [`app/[id].tsx`] (Create new)
```
- useLocalSearchParams to get cat ID
- useCatDetail hook for data
- Display CatCard component
- Header with:
  - FavoriteButton to toggle favorite status
  - Heart icon + badge showing favorites count
- Back button to return to list
```

**4.4 Favorites Screen** – [`app/favorites.tsx`] or Tab (Create new)
```
- useFavorites hook to get favorite cat IDs
- Filter cats from Redux state
- FlatList of favorite cats
- Option: Add to tab navigation (bottom tabs)
- Navigate to detail on tap
```

#### Phase 5: Navigation Setup (Expo Router)

**5.1 Root Layout Configuration** – [`app/_layout.tsx`]
- Provider wrapper for Redux store
- Stack or Tab navigator setup
- Define screen options (headers, transitions)

**5.2 Dynamic Routes**
- `/` – Cat list
- `/[id]` – Cat detail (dynamic route)
- `/favorites` – Favorites list

**5.3 Header Configuration**
- Cat list: show favorites count badge
- Cat detail: show favorite toggle button + favorites count
- Favorites: show list title

### Technical Details

#### Type System (TypeScript)
**`types/index.ts`**:
```typescript
interface Cat {
  id: string;
  name: string;
  description: string;
  image: {
    url: string;
    height: number;
    width: number;
  };
  breeds?: Array<{
    id: string;
    name: string;
    temperament: string;
    description: string;
  }>;
}

interface FavoritesState {
  ids: string[];
  isLoading: boolean;
}

interface CatsListParams {
  limit: number;
  offset: number;
}
```

#### RTK Query Configuration
**`store/api/catsApi.ts`**:
- Base URL: `https://api.thecatapi.com/v1`
- Auth header: `x-api-key: {API_KEY}`
- Cache behavior: Keep data for offline access
- Stale time: 5 minutes (cats don't change frequently)

#### Redux Store Structure
**`store/store.ts`**:
```
store
├── favorites (slice)
│   └── ids: string[]
├── catsApi (RTK Query)
│   └── queries cache
└── middleware
    └── AsyncStorage persistence
```

#### Performance Optimizations
1. **React.memo** on `CatListItem` – prevent re-renders on parent updates
2. **useCallback** on handlers – stable references
3. **useMemo** on derived data – expensive computations
4. **FlatList optimization**:
   - keyExtractor for stable keys
   - maxToRenderPerBatch: 10
   - updateCellsBatchingPeriod: 50
   - removeClippedSubviews: true
5. **Image optimization** – use Expo Image with placeholder

#### Error Handling
- Try-catch in async operations
- Error messages displayed to user
- Retry logic in RTK Query
- Graceful degradation for offline mode

#### Offline Support Implementation
1. **RTK Query caching** – automatically cache API responses
2. **Redux persistence** – favorites saved to AsyncStorage
3. **Detect offline** – use `@react-native-community/netinfo` (optional) or rely on RTK Query error handling
4. **Fallback UI** – show cached data when offline
5. **Sync on reconnect** – RTK Query automatic retry

### Code Patterns to Follow

1. **Custom Hook Pattern**:
```typescript
export function useCats(page: number) {
  const { data, isLoading, error } = useGetCatsQuery({...});
  const handleLoadMore = useCallback(() => {...}, []);
  return { cats: data?.results || [], isLoading, error, loadMore: handleLoadMore };
}
```

2. **Memoized Component Pattern**:
```typescript
const CatListItem = React.memo(({ cat, onPress }: Props) => (
  <TouchableOpacity onPress={() => onPress(cat.id)}>
    {/* Render */}
  </TouchableOpacity>
));
```

3. **Redux Selector Pattern**:
```typescript
export const selectIsFavorite = (state: RootState, catId: string) =>
  state.favorites.ids.includes(catId);
```

## Alternatives Considered

### 1. State Management Approach
- **Chosen**: Redux Toolkit + RTK Query (favorites + API data separately)
- **Alternative**: Context API + custom hooks (simpler but less scalable)
- **Rationale**: Redux provides better DevTools debugging, middleware support for persistence, and RTK Query handles caching elegantly

### 2. Navigation Structure
- **Chosen**: Tab navigation (List | Favorites) with dynamic detail route
- **Alternative**: Stack-only navigation
- **Rationale**: Tab navigation provides better UX for switching between list and favorites

### 3. Persistence Strategy
- **Chosen**: AsyncStorage for Redux state, RTK Query cache for API data
- **Alternative**: SQLite with WatermelonDB
- **Rationale**: AsyncStorage sufficient for favorites list; RTK Query handles API caching automatically

## Testing Strategy

### Unit Tests
- Redux slices: actions, reducers, selectors
- Custom hooks: mock RTK Query and Redux
- Utility functions: helpers.ts functions

### Integration Tests
- Screen navigation flow (list → detail → favorites)
- Favorite toggle workflow
- Pagination loading more cats

### Manual Testing Scenarios
1. Scroll cat list, mark favorites, see badge update
2. Navigate to detail, toggle favorite, return to list
3. Go to favorites screen, see only marked cats
4. Close and reopen app, favorites persist
5. Turn off internet, navigate through cached data
6. Return online, new data loads

## Risks & Mitigation

| Risk | Mitigation |
|------|-----------|
| API rate limiting | Implement exponential backoff, cache aggressively |
| Large image loading | Use lazy loading with FlatList, optimize image sizes |
| Redux state becomes too large | Start lean, only favorites in Redux; use RTK Query for API |
| Favorites sync issues | Test AsyncStorage persistence, add error boundaries |
| Offline mode confusion | Show offline indicator when no connection detected |

## Open Questions

1. **Tab Navigation vs Stack?** – Recommend bottom tab navigation for better UX switching between list and favorites
2. **Image caching strategy?** – Should we cache images locally or rely on device cache?
3. **How many cats per page?** – Suggest 10-15 for optimal pagination experience
4. **Should detail screen allow direct access via deep linking?** – Yes, setup route params

## Implementation Checklist

### Phase 1: Setup
- [ ] Add Redux Toolkit, React-Redux, AsyncStorage to package.json
- [ ] Create `store/store.ts` with Redux configuration
- [ ] Create `store/slices/favoritesSlice.ts` with actions/reducers
- [ ] Create `types/index.ts` with TypeScript interfaces
- [ ] Create `constants/api.ts` with API configuration

### Phase 2: API Layer
- [ ] Create `store/api/catsApi.ts` with RTK Query endpoints
- [ ] Create `hooks/useCats.ts` for pagination
- [ ] Create `hooks/useCatDetail.ts` for detail view
- [ ] Create `hooks/useFavorites.ts` for favorite management
- [ ] Create `hooks/useLocalStorage.ts` for persistence

### Phase 3: Components
- [ ] Create `components/CatListItem.tsx` (memoized)
- [ ] Create `components/CatCard.tsx`
- [ ] Create `components/FavoriteButton.tsx`
- [ ] Create `components/LoadingSpinner.tsx`
- [ ] Create `components/ErrorBoundary.tsx`

### Phase 4: Screens
- [ ] Update `app/_layout.tsx` with Redux Provider + navigation setup
- [ ] Update `app/index.tsx` as Cat List Screen
- [ ] Create `app/[id].tsx` as Cat Detail Screen
- [ ] Create `app/favorites.tsx` or tab for Favorites Screen

### Phase 5: Testing & Refinement
- [ ] Test cat list pagination
- [ ] Test favorite toggle and persistence
- [ ] Test navigation flow
- [ ] Test offline functionality
- [ ] Code review for performance optimization

## Resources

### Documentation Links
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- [Expo Router](https://docs.expo.dev/routing/introduction/)
- [The Cat API Docs](https://developers.thecatapi.com/)
- [React Native FlatList](https://reactnative.dev/docs/flatlist)
- [React.memo Documentation](https://react.dev/reference/react/memo)

### Related Files
- Configuration: `app.json`, `tsconfig.json`, `package.json`
- Example screens: `app-example/`

---

**Next Steps**: Review this plan. Provide feedback on:
1. Navigation structure preference (tabs vs stack)?
2. Image pagination count (cats per page)?
3. Any specific design preferences for UI?
4. Preference for how to organize favorites screen?
