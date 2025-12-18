# Healthcare Translation Web App with Generative AI

A real-time, multilingual translation web application designed specifically for healthcare providers and patients to communicate effectively across language barriers.

## 🎯 Project Overview

This application leverages the MERN stack (MongoDB, Express.js, React, Node.js) combined with OpenAI's GPT-4 and TTS APIs to provide:
- Real-time voice-to-text transcription
- AI-powered medical translation with context awareness
- Text-to-speech audio playback
- Mobile-first responsive design
- HIPAA-compliant security measures

## 🚀 Features

### Core Functionalities
- **Voice-to-Text**: Uses Web Speech API for real-time speech recognition with medical terminology enhancement via GPT-4
- **Real-Time Translation**: Powered by OpenAI GPT-4 for accurate medical terminology translation
- **Audio Playback**: Text-to-speech using OpenAI TTS API with natural-sounding voices
- **Dual Transcript Display**: Side-by-side view of original and translated text
- **12 Languages Supported**: English, Spanish, French, German, Chinese, Japanese, Korean, Arabic, Hindi, Portuguese, Russian, Italian

### Security Features
- Helmet.js for HTTP security headers
- Rate limiting to prevent API abuse
- CORS protection
- Environment variable protection
- No data persistence (HIPAA compliance)
- Secure API communication

## 📁 Project Structure

```
healthcare-translator/
├── backend/
│   ├── routes/
│   │   ├── translation.js      # Translation endpoints
│   │   └── tts.js              # Text-to-speech endpoints
│   ├── services/
│   │   ├── translationService.js  # OpenAI translation logic
│   │   └── ttsService.js          # OpenAI TTS logic
│   ├── server.js               # Express server setup
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LanguageSelector.js
│   │   │   └── TranscriptBox.js
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── speechRecognition.js
│   │   ├── styles/
│   │   │   └── App.css
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern UI library
- **Web Speech API**: Browser-based speech recognition
- **Axios**: HTTP client for API communication
- **CSS3**: Responsive design with mobile-first approach

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **OpenAI API**: GPT-4 for translation, TTS for audio
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing
- **Express Rate Limit**: API rate limiting

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Modern web browser (Chrome, Edge, Safari recommended for speech recognition)

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
cd healthcare-translator
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
copy .env.example .env

# Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=your_api_key_here
# PORT=5000
# FRONTEND_URL=http://localhost:3000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Create .env file
copy .env.example .env

# Edit .env:
# REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

The application will open at `http://localhost:3000`

## 📱 How to Use

### For Healthcare Providers & Patients:

1. **Select Languages**
   - Choose the source language (patient's language)
   - Choose the target language (provider's language)
   - Use the swap button (⇄) to quickly reverse languages

2. **Start Conversation**
   - Click "Start Listening" button
   - Speak clearly into your microphone
   - The app will transcribe in real-time (gray text = interim, black text = final)

3. **View Translation**
   - Translation appears automatically in the right panel
   - Click "Speak" button to hear the translation
   - Audio plays in natural-sounding voice

4. **Manage Session**
   - Use "Clear" button to start fresh conversation
   - Stop/Start listening as needed
   - Status bar shows current operation

### Browser Permissions
- Allow microphone access when prompted
- For best results, use Chrome, Edge, or Safari

## 🔒 Security & Privacy

### HIPAA Compliance Measures
- **No Data Persistence**: Conversations are not stored in databases
- **Encrypted Communication**: All API calls use HTTPS in production
- **Rate Limiting**: Prevents abuse and ensures fair usage
- **Security Headers**: Helmet.js configures secure HTTP headers
- **CORS Protection**: Only allowed origins can access API
- **Environment Variables**: Sensitive data stored securely

### Privacy Notice
- Conversations are processed through OpenAI API
- No patient information is retained after session
- For production use, ensure BAA with OpenAI

## 🚀 Deployment

### Recommended Platforms
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend**: Heroku, Railway, or AWS Elastic Beanstalk

### Vercel Deployment (Frontend)
```bash
cd frontend
npm run build
# Deploy build folder to Vercel
```

### Environment Variables for Production
- Set `REACT_APP_API_URL` to production backend URL
- Set `OPENAI_API_KEY` in backend environment
- Enable HTTPS for all communications
- Update CORS settings for production domain

## 🧪 Testing

### Test Speech Recognition
1. Click "Start Listening"
2. Say: "The patient has a fever and headache"
3. Verify transcription appears correctly

### Test Translation
1. Ensure text appears in original transcript
2. Verify translation appears in target language
3. Check medical terms are accurate

### Test Audio Playback
1. Click "Speak" button on translated text
2. Verify audio plays clearly
3. Check pronunciation is natural

## 🐛 Troubleshooting

### Speech Recognition Not Working
- Ensure using Chrome, Edge, or Safari
- Check microphone permissions
- Verify HTTPS connection (required for production)

### Translation Errors
- Verify OpenAI API key is valid
- Check API rate limits
- Ensure backend is running

### Audio Not Playing
- Check browser audio permissions
- Verify speakers/headphones are connected
- Check backend TTS endpoint is responding

## 🔄 API Endpoints

### Translation API
- `POST /api/translation/translate` - Translate text
- `POST /api/translation/detect` - Detect language
- `POST /api/translation/enhance` - Enhance medical transcription

### Text-to-Speech API
- `POST /api/tts/speak` - Convert text to speech (base64)
- `POST /api/tts/speak-stream` - Stream audio directly

### Health Check
- `GET /api/health` - Check API status

## 🎨 AI Tools Used

1. **OpenAI GPT-4**: Medical translation with context awareness
2. **OpenAI TTS**: Natural voice synthesis
3. **Web Speech API**: Browser-based speech recognition
4. **GitHub Copilot**: Code assistance and optimization

## 📊 Performance Considerations

- Translation debounced to 1 second to reduce API calls
- Audio cached for playback efficiency
- Responsive design optimized for mobile and desktop
- Rate limiting prevents server overload

## 🌟 Future Enhancements

- Session recording for medical records
- Multi-participant support
- Dialect-specific translations
- Offline mode with cached translations
- Integration with EHR systems
- Video call integration
- Professional medical interpreter verification

## 📄 License

This project is created for the NaoMedical pre-interview assignment.

## 👥 Support

For issues or questions:
- Check troubleshooting section
- Review browser console for errors
- Ensure all environment variables are set

## 🙏 Acknowledgments

- OpenAI for GPT-4 and TTS APIs
- Web Speech API for browser-based recognition
- React community for excellent documentation
- Healthcare professionals who inspired this solution

---

**Built with ❤️ for NaoMedical Pre-Interview Assignment**

*Completed within 48 hours using MERN stack and Generative AI tools*
