# Gabbar Classes 2.0

## Current State
- Gallery page loads items from `getAllGalleryItems()` backend call and displays them in `GalleryGrid`
- Class content pages load items via `getByClass()` and display them in `ContentList`
- Photos are uploaded via `PhotoUploader` using `useFileUpload` → `StorageClient` → CDN URL stored in backend
- Files (PDF/worksheet) are uploaded via `ContentForm` using the same flow
- All queries use `enabled: !!actor && !isFetching` pattern
- The `getDirectURL` returns a URL in format: `${storageGatewayUrl}/v1/blob/?blob_hash=...&owner_id=...&project_id=...`
- `GalleryGrid` renders images with `<img src={item.imageUrl}>` — no fallback error handling
- `ContentList` renders file URLs with a plain `<a>` tag

## Requested Changes (Diff)

### Add
- Error handling for broken/failed image loads in `GalleryGrid` — show placeholder when `<img>` fails to load (onerror fallback)
- Visual feedback in `ContentList` when a resource URL is a CDN blob URL (show "Download" label instead of just "Open Resource")
- A "Retry" / "Refresh" button on the gallery page to manually refetch items if the initial load fails
- Better loading state handling: show skeleton until actor AND gallery data are both ready

### Modify
- `GalleryGrid.tsx`: Add `onError` handler on `<img>` to show placeholder on load failure; add `crossOrigin="anonymous"` attribute to help with CORS
- `useQueries.ts`: Fix `useAllGalleryItems` and `useClassContent` / `useClassContentByType` to use `staleTime: 0` and `refetchOnMount: true` so data always refreshes on page visit
- `GalleryPage.tsx`: Add manual refetch button; show proper loading state while actor is initializing
- `ContentList.tsx`: improve the "Open Resource" link to open in new tab with proper rel attributes, and add a download attribute for PDF/worksheet URLs

### Remove
- Nothing removed

## Implementation Plan
1. Update `useAllGalleryItems` in `useQueries.ts` to add `staleTime: 0` and `refetchOnMount: true` so gallery always loads fresh data
2. Update `useClassContent` and `useClassContentByType` with same staleness fix
3. Update `GalleryGrid.tsx` to handle broken image URLs gracefully with `onError` fallback and `crossOrigin="anonymous"`
4. Update `GalleryPage.tsx` to show actor-initializing loading state and add a manual refresh button
5. Update `ContentList.tsx` to improve resource link opening with proper attributes
