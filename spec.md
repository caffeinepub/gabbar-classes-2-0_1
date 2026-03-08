# Gabbar Classes 2.0

## Current State
Gallery section shows "Gallery coming soon" after uploading photos. Root causes:
1. `useAllGalleryItems` query has `enabled: !isFetching` (not `!!actor && !isFetching`), so it fires with a null actor, returns `[]`, caches it as empty, and the cached empty result persists.
2. `useFileUpload` creates a fresh anonymous `HttpAgent` instead of reusing the authenticated actor's agent — so the certificate call for blob storage may be unauthenticated/fail silently, meaning the CDN URL never gets stored.
3. After `addGalleryItem` succeeds, `invalidateQueries` is called but stale cache from the initial empty fetch may still be served.
4. Admin gallery section has no gallery view — admin must navigate to `/gallery` to see photos.

## Requested Changes (Diff)

### Add
- A `useFileUpload` that reuses the authenticated actor from `useActor` instead of creating a new anonymous agent
- A gallery preview section in the admin panel (or redirect to gallery)
- Force refetch of gallery after add/delete

### Modify
- `useAllGalleryItems`: change `enabled: !isFetching` to `enabled: !!actor && !isFetching` so it only runs once actor is ready
- `useFileUpload`: replace anonymous `HttpAgent` creation with identity-aware agent using the actor's identity from `useInternetIdentity`
- `GalleryPage`: after upload success, call `refetch()` explicitly in addition to invalidation
- `GalleryGrid` empty state: change text to show "No photos yet" instead of "Gallery coming soon" (which confuses users when items actually exist but fail to load)

### Remove
- The silent swallow of upload errors — show proper error toast when CDN upload fails

## Implementation Plan
1. Fix `useFileUpload.ts` to use authenticated identity from `useInternetIdentity` hook
2. Fix `useQueries.ts` `useAllGalleryItems` to require actor: `enabled: !!actor && !isFetching`
3. Fix `GalleryPage.tsx` to call `refetch()` after successful add
4. Fix `GalleryGrid.tsx` empty state text so it doesn't say "coming soon"
5. Add error handling in `PhotoUploader.tsx` to surface upload failures
