# Voice Notes & Video: Live Version Requirements

## Current State (Demo/V1)
- Voice recording UI exists in BeHeardPanel, IntentionPanel, SurveyResponsePanel, DailyBriefNotebook
- Uses browser MediaRecorder API for voice capture
- Video recording button exists in DailyBriefNotebook
- In demo mode, recordings are simulated (no actual media persistence)

## Requirements for Live Version

### Voice Notes
- Capture via browser MediaRecorder API (already scaffolded)
- Store audio blobs in persistent storage (IndexedDB for local, S3/Cloudflare R2 for cloud)
- Playback with waveform visualization
- Max duration: 5 minutes per voice note
- Supported in: Be Heard submissions, Survey responses, Daily Brief leadership notes
- Transcription (V2): Consider Whisper API or similar for auto-transcription

### Video
- Capture via getUserMedia + MediaRecorder
- Store video in persistent storage (same as voice)
- Thumbnail generation for preview
- Max duration: 3 minutes for Daily Brief, 2 minutes for responses
- Supported in: Daily Brief (leadership video message), Survey responses (optional)
- Compression: Consider client-side compression before upload

### Infrastructure Needed
- Media storage backend (S3-compatible or Cloudflare R2)
- Upload endpoint with progress indicator
- Media playback component with loading states
- Offline support: queue uploads when offline, sync when back online
- Storage limits per organization

### Privacy Considerations
- Voice/video never leaves the organization's storage
- Auto-delete after configurable retention period
- User can delete their own recordings
- No AI processing of voice/video without explicit consent
