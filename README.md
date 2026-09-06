# MindPulse - Mindful Journal, Stress Intelligence & Geotagged Sanctuaries

MindPulse is a full-stack, user-authenticated mental health application built with **React**, **Tailwind CSS**, **Google Cloud Firestore**, **Firebase Authentication**, **Gemini 3.6 Flash API**, and **Google Maps Platform**.

---

## Architecture & Features

1. **User Identity & Security**:
   - Federated authentication via **Google Sign-In** using Firebase Auth (no passwords stored in application code).
   - Strict owner-bound document isolation in Cloud Firestore (`users/{userId}/*`), guaranteeing zero cross-user data leakage.
2. **AI-Powered Reflection Engine (Gemini 3.6 Flash)**:
   - Resilient server-side fallback ladder: `gemini-3.6-flash` &rarr; `gemini-3.1-flash-lite` &rarr; `gemini-flash-latest` &rarr; `gemini-3.7-flash`.
   - Multi-turn cognitive reframing, empathetic dialogue, automated reflection summarization (`/api/gemini/summarize`), and actionable somatic brainstorming (`/api/gemini/brainstorm`).
3. **Google Maps Platform Integration**:
   - Built with the zero-legacy `@vis.gl/react-google-maps` library.
   - Interactive map featuring curated peaceful sanctuaries, user-pinned geotagged reflections, and custom mindful sanctuary logging with `<AdvancedMarker>`.
4. **Offline Resilience & Data Integrity**:
   - Zero-data loss local storage caching with automated background synchronization to Cloud Firestore.
   - Strict undefined-stripping (`stripUndefined`) prior to all database writes.
   - Guaranteed transaction verification with UI retry options.
5. **Bilingual Accessibility**:
   - Full English and Hindi (हिन्दी) localization with instant dynamic switching.

---

## 1. Environment & Prerequisites

Ensure the Google Cloud SDK (`gcloud`) and Node.js (v18+) are installed on your machine.

### Enable Required Google Cloud APIs

```bash
# Set your active Google Cloud project
gcloud config set project YOUR_PROJECT_ID

# Enable Cloud Run, Secret Manager, and Firestore APIs
gcloud services enable run.googleapis.com \
  secretmanager.googleapis.com \
  firestore.googleapis.com
```

---

## 2. Secret Management Setup

Follow the zero-hardcoding security standard by storing your Gemini API key in **Google Cloud Secret Manager**:

```bash
# Create the secret
gcloud secrets create GEMINI_API_KEY --replication-policy="automatic"

# Populate the secret with your Gemini API key
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add GEMINI_API_KEY --data-file=-

# Obtain your project number
PROJECT_NUMBER=$(gcloud projects describe YOUR_PROJECT_ID --format="value(projectNumber)")

# Grant the Cloud Run compute service account access to read the secret
gcloud secrets add-iam-policy-binding GEMINI_API_KEY \
  --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

## 3. Database Security Configuration (Cloud Firestore)

Deploy the owner-bound security rules to ensure strict user data isolation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }

    // User Profile
    match /users/{userId} {
      allow read, write: if isOwner(userId);

      // Stress Assessments
      match /assessments/{assessmentId} {
        allow read, write: if isOwner(userId);
      }

      // Mindful Journal Sessions
      match /journal_sessions/{sessionId} {
        allow read, write: if isOwner(userId);
      }

      // Prompt & Response Interactions
      match /interactions/{interactionId} {
        allow read, write: if isOwner(userId);
      }

      // Daily Mood Logs
      match /daily_moods/{moodId} {
        allow read, write: if isOwner(userId);
      }

      // Mindful Spaces & Geotagged Locations
      match /places/{placeId} {
        allow read, write: if isOwner(userId);
      }
    }

    // Deny all other collections by default
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

Deploy the rules using the Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

---

## 4. Google Cloud Run Deployment Flow

Deploy the full-stack container directly using the Google Cloud Run CLI:

```bash
gcloud run deploy mindpulse \
  --source . \
  --region asia-southeast1 \
  --platform managed \
  --allow-unauthenticated \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest" \
  --port 3000
```

---

## 5. Required Campaign Labeling (Verification Binding)

Apply the mandatory resource label to register the service for automated challenge verification:

```bash
gcloud run services update mindpulse \
  --update-labels=dev-tutorial=cloud-run-ai-challenge \
  --region=asia-southeast1
```

---

## 6. Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. Populate `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
   ```

4. Launch development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.
