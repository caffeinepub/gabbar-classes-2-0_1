# GABBAR CLASSES 2.0

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full-stack coaching institute web app for GABBAR CLASSES 2.0
- Institute info: Nursery to Class 8, CBSE Board, Director: Kamal Raj Sinha, Contact: 8709397378 / sinharajkamal2810@gmail.com, Address: Shanti Nagar, DSP Kothi, Naya Bazar, Sherghati, Gaya, Bihar
- Two roles: admin and student
- Authentication: mobile OTP login + Gmail/Google login simulation (stored credentials)
- Pages:
  1. Home -- hero section with institute name, tagline, quick navigation
  2. About -- institute info, director profile, mission/vision
  3. Faculty -- faculty cards with name, subject, photo placeholder
  4. Library -- study material hub with class-wise navigation
  5. Gallery -- photo grid with admin upload/delete capability
  6. Batches & Admission -- batch schedule cards, admission form info
  7. Classes (Nursery to Class 8, 10 total) -- each class has sub-tabs: PDFs, Worksheets, Messages, Videos, Tests
  8. Contact -- phone, email, address, map placeholder
  9. Login -- mobile number + OTP flow, Gmail login option
  10. Admin Panel -- manage gallery, per-class content, faculty, batches

### Modify
- Nothing (new project)

### Remove
- Nothing (new project)

## Implementation Plan

### Backend (Motoko)
- User type: { id, name, mobile, email, role: #admin | #student, createdAt }
- Auth: registerMobile, loginMobile (OTP-simulated), loginGoogle, logout, getMe
- Faculty type: { id, name, subject, qualification, bio, photoUrl }
- CRUD: addFaculty, updateFaculty, deleteFaculty, getFaculty
- Gallery type: { id, title, imageUrl, uploadedAt }
- CRUD: addGalleryItem, deleteGalleryItem, getGallery
- ClassContent type: { id, classLevel (Nursery|Class1..Class8), contentType (#pdf|#worksheet|#video|#test|#message), title, url, body, createdAt }
- CRUD: addContent, updateContent, deleteContent, getContentByClass, getContentByClassAndType
- Batch type: { id, className, schedule, timing, fee, seats, startDate }
- CRUD: addBatch, updateBatch, deleteBatch, getBatches
- AdmissionInquiry type: { id, name, mobile, email, classLevel, message, createdAt }
- submitInquiry, getInquiries (admin only)
- Role-based guards: admin-only mutations

### Frontend
- React + TypeScript + Tailwind CSS
- Golden (#FFD700, #FFC200) and black (#0a0a0a, #1a1a1a) theme via CSS variables in index.css
- React Router for navigation (10+ routes)
- Sidebar or top nav with gold-accented links
- Class pages share a template component with sub-tabs (PDFs, Worksheets, Messages, Videos, Tests)
- Admin panel at /admin/* protected by role check
- Gallery: masonry or grid layout, admin overlay controls
- Auth context for current user / role
- Blob storage for file/image uploads (gallery, faculty photos)
