# Gabbar Classes 2.0

## Current State
- Gallery photos are uploaded by reading files as base64 data URLs (`FileReader.readAsDataURL`) and storing the raw data URL string as `imageUrl` in the backend canister. ICP canisters have strict message size limits, so large base64 strings either fail silently or get corrupted -- photos don't appear on the public Gallery page or the student page.
- Study material files (PDF, worksheet, image files) in the class library are also read as base64 data URLs and stored in the `ClassContent.url` field. This same size limitation causes them to not load correctly when students try to open them.
- The blob-storage component (ExternalBlob) is already installed in the project and provides proper large file storage with HTTP CDN URLs.

## Requested Changes (Diff)

### Add
- Upload progress indicator in PhotoUploader while blob is being uploaded to storage.
- Upload progress indicator in ContentForm for file-based content types.

### Modify
- `PhotoUploader.tsx`: Change file handling to use `ExternalBlob.fromBytes()` to upload the image to blob storage, then call `blob.getDirectURL()` and pass that as the `imageUrl`. Remove base64 data URL approach entirely.
- `ContentForm.tsx`: Change file handling for PDF/Worksheet content types to use `ExternalBlob.fromBytes()` to upload the file to blob storage, then store `blob.getDirectURL()` as the `url` field. Remove base64 data URL approach entirely.
- Both uploaders should show an uploading state while the blob upload is in progress.

### Remove
- `FileReader.readAsDataURL()` usage in both PhotoUploader and ContentForm -- replaced with ExternalBlob.

## Implementation Plan
1. Update `PhotoUploader.tsx` to use `ExternalBlob.fromBytes(bytes)` upload flow with progress tracking, store the direct URL.
2. Update `ContentForm.tsx` to use `ExternalBlob.fromBytes(bytes)` upload flow for PDF/worksheet files, store the direct URL.
3. Validate (typecheck + build).
