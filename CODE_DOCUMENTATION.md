# Code Documentation

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│  ┌────────────────────────────────────────────────┐    │
│  │           React Frontend (Port 3000)           │    │
│  │  - Web Speech API (Voice Recognition)         │    │
│  │  - UI Components                               │    │
│  │  - State Management                            │    │
│  └─────────────┬──────────────────────────────────┘    │
└────────────────┼─────────────────────────────────────────┘
                 │ HTTP/HTTPS
                 │ (Axios API Calls)
                 │
┌────────────────▼─────────────────────────────────────────┐
│         Express Backend API (Port 5000)                  │
│  ┌──────────────────────────────────────────────┐      │
│  │  Routes: /api/translation, /api/tts          │      │
│  │  Security: Helmet, CORS, Rate Limiting       │      │
│  └────────────┬─────────────────────────────────┘      │
│               │                                           │
│  ┌────────────▼─────────────────────────────────┐      │
│  │  Services Layer                              │      │
│  │  - TranslationService (GPT-4)               │      │
│  │  - TTSService (OpenAI TTS)                  │      │
│  └────────────┬─────────────────────────────────┘      │
└────────────────┼─────────────────────────────────────────┘
                 │
                 │ OpenAI API
                 │
┌────────────────▼─────────────────────────────────────────┐
│                    OpenAI Services                        │
│  - GPT-4 (Translation & Enhancement)                     │
│  - TTS (Text-to-Speech)                                  │
└──────────────────────────────────────────────────────────┘
```

---

## Backend Architecture

### File Structure

```
backend/
├── server.js                    # Main server entry point
├── routes/
│   ├── translation.js          # Translation endpoints
│   └── tts.js                  # Text-to-speech endpoints
├── services/
│   ├── translationService.js   # OpenAI translation logic
│   └── ttsService.js           # OpenAI TTS logic
├── middleware/                  # Future middleware (logging, auth)
├── package.json
└── .env.example
```

### server.js

**Purpose**: Initialize Express server with security middleware and route handlers

**Key Components**:
```javascript
// Security middleware
- helmet()              // Secure HTTP headers
- rateLimit()          // API rate limiting (100 req/15min)
- cors()               // Cross-origin resource sharing

// Body parsing
- express.json()       // Parse JSON payloads (10MB limit)

// Routes
- /api/translation/*   // Translation endpoints
- /api/tts/*          // Text-to-speech endpoints
- /api/health         // Health check

// Error handling
- Global error handler
- 404 handler
```

**Security Features**:
1. Helmet.js configures 11 security headers
2. Rate limiting prevents abuse
3. CORS restricts origins
4. Request size limits prevent DoS
5. Error messages sanitized in production

---

### Translation Service

**File**: `services/translationService.js`

**Class**: `TranslationService`

#### Methods

##### `translateText(text, sourceLang, targetLang)`
**Purpose**: Translate text using GPT-4 with medical context

**Parameters**:
- `text` (string): Text to translate (max 5000 chars)
- `sourceLang` (string): Source language name
- `targetLang` (string): Target language name

**Returns**: Object with:
- `translatedText`: Translated output
- `sourceLang`: Original language
- `targetLang`: Target language
- `originalText`: Input text

**AI Enhancement**:
```javascript
// System prompt sets medical translation context
role: "system"
content: "You are an expert medical translator..."

// Temperature: 0.3 for consistency
// Model: GPT-4 for accuracy
```

##### `detectLanguage(text)`
**Purpose**: Identify language of input text

**Model**: GPT-3.5-turbo (faster, cheaper for simple task)

##### `enhanceTranscription(text)`
**Purpose**: Correct medical terminology in transcription

**Use Case**: Fix speech recognition errors in medical terms

**Example**:
- Input: "Patient has diabeetus"
- Output: "Patient has diabetes"

---

### Text-to-Speech Service

**File**: `services/ttsService.js`

**Class**: `TextToSpeechService`

#### Methods

##### `textToSpeech(text, language)`
**Purpose**: Convert text to MP3 audio buffer

**Parameters**:
- `text` (string): Text to speak (max 4096 chars)
- `language` (string): Language code (en, es, fr, etc.)

**Voice Mapping**:
```javascript
{
  'en': 'alloy',    // Clear, professional
  'es': 'nova',     // Warm, friendly
  'fr': 'shimmer',  // Smooth
  'de': 'echo',     // Authoritative
  'zh': 'fable',    // Natural
  'default': 'alloy'
}
```

**Settings**:
- Model: tts-1 (faster, good quality)
- Speed: 0.9 (slightly slower for clarity)

##### `textToSpeechBase64(text, language)`
**Purpose**: Return audio as base64 string for JSON transmission

---

### API Routes

#### Translation Routes (`routes/translation.js`)

##### POST `/api/translation/translate`
**Request Body**:
```json
{
  "text": "Patient has fever",
  "sourceLang": "English",
  "targetLang": "Spanish"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "translatedText": "El paciente tiene fiebre",
    "sourceLang": "English",
    "targetLang": "Spanish",
    "originalText": "Patient has fever"
  }
}
```

**Validation**:
- All fields required
- Text max 5000 characters
- Returns 400 for invalid input

##### POST `/api/translation/detect`
**Purpose**: Auto-detect language

**Request**:
```json
{
  "text": "Bonjour, comment allez-vous?"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "language": "French"
  }
}
```

##### POST `/api/translation/enhance`
**Purpose**: Improve transcription accuracy

**Use**: Called before translation to fix speech recognition errors

#### TTS Routes (`routes/tts.js`)

##### POST `/api/tts/speak`
**Request**:
```json
{
  "text": "El paciente tiene fiebre",
  "language": "es"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "audio": "base64_encoded_mp3_data...",
    "format": "mp3"
  }
}
```

##### POST `/api/tts/speak-stream`
**Alternative**: Stream audio directly as binary

**Response**: MP3 audio file (Content-Type: audio/mpeg)

---

## Frontend Architecture

### File Structure

```
frontend/src/
├── App.js                      # Main application component
├── index.js                    # React entry point
├── components/
│   ├── LanguageSelector.js     # Language dropdown UI
│   └── TranscriptBox.js        # Transcript display panel
├── services/
│   ├── api.js                  # Backend API client
│   └── speechRecognition.js    # Web Speech API wrapper
└── styles/
    └── App.css                 # All styling
```

---

### Main Application Component

**File**: `App.js`

#### State Management

```javascript
// Language settings
sourceLanguage: 'English'
targetLanguage: 'Spanish'

// Transcription
originalTranscript: ''         // Final text
interimTranscript: ''          // Live, being spoken
translatedText: ''             // Translation result

// UI state
isListening: false             // Recording active
isSpeaking: false              // Audio playing
isTranslating: false           // Translation in progress
statusMessage: ''              // User feedback
statusType: 'info'             // success/error/info
```

#### Key Functions

##### `startListening()`
**Flow**:
1. Check Web Speech API support
2. Initialize speech recognition with source language
3. Set up event handlers (onresult, onend, onerror)
4. Start listening
5. Update UI state

**Speech Recognition Events**:
```javascript
onresult: (event) => {
  // Separate interim and final results
  // Update originalTranscript when final
  // Show interim text in gray
}

onend: () => {
  // Reset listening state
  // Show status message
}

onerror: (error) => {
  // Handle errors gracefully
  // Show user-friendly message
}
```

##### `translateText(text)`
**Flow**:
1. Debounce to avoid rapid API calls (1 second delay)
2. Call translation API
3. Update translatedText state
4. Show success/error status

**Debouncing**:
```javascript
// Prevents translation on every word
useEffect(() => {
  clearTimeout(translationTimeoutRef.current);
  translationTimeoutRef.current = setTimeout(() => {
    translateText(originalTranscript);
  }, 1000);
}, [originalTranscript]);
```

##### `speakText(text)`
**Flow**:
1. Call TTS API with text and language
2. Convert base64 to audio Blob
3. Create object URL
4. Play audio element
5. Clean up URL on completion

**Audio Handling**:
```javascript
const audioBlob = base64ToBlob(result.data.audio, 'audio/mpeg');
const audioUrl = URL.createObjectURL(audioBlob);
audioRef.current.src = audioUrl;
await audioRef.current.play();

// Cleanup
audioRef.current.onended = () => {
  URL.revokeObjectURL(audioUrl);
};
```

---

### Components

#### LanguageSelector Component

**File**: `components/LanguageSelector.js`

**Purpose**: Language selection dropdown interface

**Props**:
- `sourceLanguage`: Current source language
- `targetLanguage`: Current target language
- `onSourceChange`: Callback for source change
- `onTargetChange`: Callback for target change
- `onSwap`: Callback for swap button

**Features**:
- 12 supported languages
- Swap button with animation
- Accessible labels
- Mobile-responsive layout

#### TranscriptBox Component

**File**: `components/TranscriptBox.js`

**Purpose**: Display transcript with audio playback

**Props**:
- `title`: Panel title (e.g., "Original (English)")
- `content`: Final transcript text
- `interimContent`: Live interim text
- `language`: Language for audio
- `onSpeak`: Callback to play audio
- `isSpeaking`: Audio playback state

**UI Elements**:
- Header with title and speak button
- Content area with scrolling
- Visual distinction (interim = gray, final = black)
- Empty state placeholder

---

### Services

#### API Service

**File**: `services/api.js`

**Purpose**: Centralized API communication

**Features**:
```javascript
// Axios instance with defaults
baseURL: process.env.REACT_APP_API_URL
timeout: 30000 (30 seconds)
headers: { 'Content-Type': 'application/json' }

// Error interceptor
- Handles network errors
- Extracts error messages
- Provides user-friendly messages
```

**Exported Functions**:
```javascript
translationAPI.translate(text, sourceLang, targetLang)
translationAPI.detectLanguage(text)
translationAPI.enhanceTranscription(text)

ttsAPI.speak(text, language)
ttsAPI.speakStream(text, language)

healthCheck()
```

#### Speech Recognition Service

**File**: `services/speechRecognition.js`

**Purpose**: Wrapper for Web Speech API

**Class**: `SpeechRecognitionService`

**Configuration**:
```javascript
recognition.continuous = true      // Keep listening
recognition.interimResults = true  // Show live text
recognition.lang = 'en-US'        // Set language
```

**Methods**:

##### `startListening(language, onResult, onEnd, onError)`
- Initialize recognition
- Set language
- Attach event handlers
- Start listening

##### `stopListening()`
- Stop recognition gracefully
- Reset state

##### `getLanguageCode(language)`
- Convert language name to BCP-47 code
- Example: 'English' → 'en-US'

##### `getShortLanguageCode(language)`
- Convert to ISO 639-1 code
- Example: 'English' → 'en'

**Language Codes**:
```javascript
'English': 'en-US',
'Spanish': 'es-ES',
'French': 'fr-FR',
'German': 'de-DE',
'Chinese': 'zh-CN',
'Japanese': 'ja-JP',
// ... etc
```

---

### Styling

**File**: `styles/App.css`

**Approach**: Mobile-first responsive design

**Key Features**:
1. **Responsive Grid**: Side-by-side on desktop, stacked on mobile
2. **Color Scheme**: Purple gradient (#667eea, #764ba2)
3. **Animations**: Pulse effect for listening, spin for loading
4. **Accessibility**: High contrast, clear focus states
5. **Touch-Friendly**: Large buttons (50px min)

**Breakpoints**:
```css
@media (max-width: 768px) {
  /* Mobile layout */
  .transcripts {
    grid-template-columns: 1fr; /* Stack vertically */
  }
}
```

**Button States**:
- Default: Subtle shadow
- Hover: Elevated shadow, color shift
- Active: Scale down (0.95)
- Disabled: Gray, no pointer

**Animations**:
```css
.listening { animation: pulse 1.5s infinite; }
.speaking { animation: speakingAnimation 0.8s infinite; }
.loading-spinner { animation: spin 0.8s linear infinite; }
```

---

## Data Flow

### Complete Translation Flow

```
1. User clicks "Start Listening"
   ↓
2. App.js calls speechRecognitionService.startListening()
   ↓
3. Web Speech API captures audio
   ↓
4. speechRecognitionService emits results
   ↓
5. App.js updates originalTranscript state
   ↓
6. useEffect detects change, starts 1s debounce timer
   ↓
7. After 1s, translateText() called
   ↓
8. api.js sends POST to /api/translation/translate
   ↓
9. Express route receives request
   ↓
10. translationService.translateText() calls OpenAI GPT-4
   ↓
11. GPT-4 returns translation
   ↓
12. Response sent back to frontend
   ↓
13. App.js updates translatedText state
   ↓
14. TranscriptBox re-renders with new translation
```

### Audio Playback Flow

```
1. User clicks "Speak" button
   ↓
2. TranscriptBox calls onSpeak prop
   ↓
3. App.js speakText() sends POST to /api/tts/speak
   ↓
4. Express route receives request
   ↓
5. ttsService.textToSpeech() calls OpenAI TTS
   ↓
6. OpenAI returns MP3 audio buffer
   ↓
7. Service converts to base64
   ↓
8. Response sent to frontend
   ↓
9. App.js converts base64 to Blob
   ↓
10. Creates object URL
   ↓
11. Sets audio element src
   ↓
12. Plays audio
   ↓
13. Cleans up URL on completion
```

---

## Security Implementation

### Backend Security

#### 1. Helmet.js Headers
```javascript
helmet() // Sets 11 security headers:
- Content-Security-Policy
- X-DNS-Prefetch-Control
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
// ... and more
```

#### 2. Rate Limiting
```javascript
rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100                    // 100 requests per window
})
// Prevents API abuse and DoS attacks
```

#### 3. CORS Configuration
```javascript
cors({
  origin: process.env.FRONTEND_URL,  // Whitelist only
  credentials: true,                  // Allow cookies
  optionsSuccessStatus: 200
})
```

#### 4. Input Validation
```javascript
// Check required fields
if (!text || !sourceLang || !targetLang) {
  return res.status(400).json({ error: 'Missing fields' });
}

// Length limits
if (text.length > 5000) {
  return res.status(400).json({ error: 'Text too long' });
}
```

#### 5. Environment Variables
```javascript
// Never commit .env file
// Sensitive data stored securely
OPENAI_API_KEY=sk-...
PORT=5000
```

### Frontend Security

#### 1. XSS Prevention
```javascript
// React automatically escapes rendered text
<div>{userInput}</div>  // Safe, auto-escaped
```

#### 2. API Error Handling
```javascript
// Never expose internal errors
throw new Error('Server error');  // Generic message
```

#### 3. HTTPS Enforcement
```javascript
// In production, enforce HTTPS
// Redirect HTTP to HTTPS at deployment level
```

---

## AI Tools Integration

### 1. OpenAI GPT-4 (Translation)

**Why GPT-4**:
- Medical terminology accuracy
- Context awareness
- Cultural sensitivity
- Consistent results

**Configuration**:
```javascript
model: "gpt-4",
temperature: 0.3,        // Low = consistent
max_tokens: 1000,
```

**Prompt Engineering**:
```
System: "You are an expert medical translator..."
User: "Translate from X to Y: [text]"

Key instructions:
- Maintain medical accuracy
- Cultural appropriateness
- Preserve urgency/tone
- No extra explanation
```

### 2. OpenAI TTS (Audio)

**Why OpenAI TTS**:
- Natural pronunciation
- Multiple voices
- Supports many languages
- Low latency

**Configuration**:
```javascript
model: "tts-1",         // Fast, good quality
voice: "alloy",         // Clear, professional
speed: 0.9,            // Slightly slower
```

### 3. Web Speech API

**Browser Support**:
- ✅ Chrome/Edge: Excellent
- ✅ Safari: Good
- ❌ Firefox: Limited
- ❌ IE: Not supported

**Limitations**:
- Requires HTTPS in production
- Needs microphone permission
- Language support varies by browser

---

## Performance Optimization

### 1. Debouncing
```javascript
// Avoid translating every word
setTimeout(() => translateText(), 1000);
```

### 2. Audio Cleanup
```javascript
// Prevent memory leaks
URL.revokeObjectURL(audioUrl);
```

### 3. Component Memoization
```javascript
// Could add React.memo for TranscriptBox
export default React.memo(TranscriptBox);
```

### 4. Request Limits
```javascript
// Backend: 10MB JSON limit
app.use(express.json({ limit: '10mb' }));

// API: Character limits
text.length > 5000 → Error
```

---

## Error Handling

### Frontend Error Handling

```javascript
try {
  const result = await translationAPI.translate(...);
} catch (error) {
  // Show user-friendly message
  setStatusMessage(`Error: ${error.message}`);
  setStatusType('error');
}
```

### Backend Error Handling

```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});
```

### Speech Recognition Errors

```javascript
recognition.onerror = (event) => {
  switch(event.error) {
    case 'no-speech':
      return 'No speech detected';
    case 'audio-capture':
      return 'Microphone not available';
    case 'not-allowed':
      return 'Microphone permission denied';
    default:
      return 'Speech recognition error';
  }
};
```

---

## Testing Guidelines

### Backend Testing
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test translation
curl -X POST http://localhost:5000/api/translation/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello","sourceLang":"English","targetLang":"Spanish"}'
```

### Frontend Testing
1. Open browser console (F12)
2. Check for errors
3. Monitor network tab for API calls
4. Test microphone permission flow

### Integration Testing
1. Start both backend and frontend
2. Test complete flow:
   - Speech → Transcription
   - Transcription → Translation
   - Translation → Audio
3. Test error scenarios:
   - No microphone
   - Network failure
   - Invalid input

---

## Future Enhancements

### Code Improvements
1. Add TypeScript for type safety
2. Implement Redux for state management
3. Add unit tests (Jest, React Testing Library)
4. Add E2E tests (Cypress, Playwright)

### Feature Additions
1. Session recording/export
2. Multi-user support (WebSocket)
3. Offline mode (Service Workers)
4. PWA capabilities
5. Database integration (MongoDB)

### Performance
1. Implement caching (Redis)
2. Add CDN for static assets
3. Optimize bundle size
4. Add service workers

### Security
1. Add authentication (JWT)
2. Implement audit logging
3. Add encryption at rest
4. HIPAA compliance audit

---

## Deployment Considerations

### Environment Variables

**Backend (.env)**:
```
NODE_ENV=production
PORT=5000
OPENAI_API_KEY=sk-...
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://your-domain.com
```

**Frontend (.env)**:
```
REACT_APP_API_URL=https://api.your-domain.com
```

### Build Commands

```bash
# Frontend
cd frontend
npm run build
# Deploy build/ folder

# Backend
cd backend
npm start
# Deploy to server/container
```

### Recommended Services
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Heroku, AWS
- **Database**: MongoDB Atlas
- **Monitoring**: Sentry, LogRocket

---

## Code Quality

### ESLint Configuration
```json
{
  "extends": ["react-app"],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

### Prettier Configuration
```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2
}
```

---

## Conclusion

This codebase demonstrates:
- ✅ Clean architecture with separation of concerns
- ✅ Security-first design
- ✅ Scalable structure
- ✅ Modern best practices
- ✅ Comprehensive error handling
- ✅ Mobile-first responsive design
- ✅ AI integration for healthcare context

**Total Lines of Code**: ~1,500
**Development Time**: 48 hours
**AI Tools Used**: OpenAI GPT-4, TTS, GitHub Copilot

---

*Healthcare Translator - Code Documentation v1.0*
