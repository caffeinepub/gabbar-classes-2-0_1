# Gabbar Classes 2.0

## Current State
- Gallery (Photos) page allows admin to upload photos via blob storage. Photos are saved to the backend via `addGalleryItem`.
- The `claimFirstAdmin()` backend function uses a `adminAssigned` flag that only allows the VERY FIRST logged-in user to become admin. If anyone else logged in first, the real admin can never get admin rights -- meaning photo uploads fail with "Unauthorized" silently, so photos are never saved to the backend.
- Class content (PDF, Worksheet, Video, Test, Message) is managed per class. File uploads use blob storage CDN URLs.
- Google Drive links are not supported anywhere.

## Requested Changes (Diff)

### Add
- Google Drive link option in ContentForm: for PDF and Worksheet content types, allow admin to either upload a file OR paste a Google Drive shareable link. The link is stored as the `url` field.
- A "Google Drive Links" section in the Photos page (GalleryPage) for admin: allow pasting Google Drive photo links directly without file upload.

### Modify
- **Backend (`main.mo`)**: Remove the `adminAssigned` flag restriction from `claimFirstAdmin()`. Instead, allow the function to always grant admin to the caller if they are logged in (not anonymous). This way the real admin can always claim admin rights.
- **GalleryPage**: After upload, always re-fetch from backend to confirm persistence. Show a clear error if save fails.
- **ContentForm**: Add a toggle between "Upload File" and "Paste Google Drive Link" for PDF/Worksheet content types.

### Remove
- The `adminAssigned` / `if (adminAssigned) { return false }` guard in `claimFirstAdmin()` that blocks repeated admin claims.

## Implementation Plan
1. Update `main.mo`: Make `claimFirstAdmin()` always succeed for any non-anonymous caller (remove single-admin restriction). This is the root cause of photos not saving.
2. Update `ContentForm.tsx`: Add a toggle (Upload File | Google Drive Link) for PDF and Worksheet types. When "Google Drive Link" is selected, show a text input for the Drive URL.
3. Update `GalleryPage.tsx`: Add a "Add via Google Drive Link" option alongside the photo uploader.
4. Update `ContentList.tsx`: Detect Google Drive links and open them correctly (not via Google Docs viewer which doesn't work for Drive links).
