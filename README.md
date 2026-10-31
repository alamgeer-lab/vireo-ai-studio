# Vireo AI Studio — Mobile MVP

A dark-themed Expo / React Native starter for Android and iOS.

## Included
- Home dashboard and quick-create workflows
- Text-to-video prompt builder
- Image-to-video placeholder workflow
- Style, aspect ratio, duration, voiceover and caption settings
- Template gallery
- Project list with local in-memory project creation/deletion
- Profile and upgrade placeholder
- Bottom-tab navigation

## Run locally
1. Install Node.js (LTS).
2. Extract this folder.
3. Run `npm install`.
4. Run `npx expo start`.
5. Use Expo Go on Android/iPhone to scan the QR code, or press `a` / `i` from a suitable development machine.

## Important MVP limitations
This is a front-end MVP. "Generate video preview" creates a local project entry; it does not render a real AI video. Image picking, authentication, cloud storage, real video generation, payments, and push notifications need backend/API integration.

## Suggested production architecture
- Mobile: Expo + React Native
- Auth/database/storage: Supabase or Firebase
- Video generation: a licensed video-generation API behind a secure backend
- Payments: Apple In-App Purchase and Google Play Billing (or a compliant subscription provider)
- Jobs: backend queue + webhook status updates
- Never put private API keys in the mobile app. Keep provider keys on the server.
