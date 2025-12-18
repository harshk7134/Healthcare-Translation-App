# Healthcare Translator - Quick Start

## 🚀 One-Command Setup (Windows PowerShell)

### Prerequisites
- Node.js v14+ installed
- npm installed
- OpenAI API key

### Setup Instructions

1. **Navigate to project directory:**
```powershell
cd V:\NaoMedical\healthcare-translator
```

2. **Backend Setup:**
```powershell
cd backend
npm install
Copy-Item .env.example .env
# Edit .env file and add your OPENAI_API_KEY
notepad .env
```

3. **Frontend Setup:**
```powershell
cd ..\frontend
npm install
Copy-Item .env.example .env
notepad .env
```

4. **Start Backend (Terminal 1):**
```powershell
cd ..\backend
npm start
```

5. **Start Frontend (Terminal 2):**
```powershell
cd ..\frontend
npm start
```

6. **Open Browser:**
```
http://localhost:3000
```

---

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
OPENAI_API_KEY=sk-your_key_here
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ✅ Verify Installation

1. **Check Backend:**
   - Open http://localhost:5000/api/health
   - Should see: `{"status":"OK","message":"Healthcare Translator API is running"}`

2. **Check Frontend:**
   - Open http://localhost:3000
   - Should see Healthcare Translator interface

3. **Test Features:**
   - Click "Start Listening" (allow microphone)
   - Speak: "Hello, how are you?"
   - Verify translation appears
   - Click "Speak" button for audio

---

## 🐛 Troubleshooting

### Backend won't start
```powershell
# Check if port 5000 is in use
netstat -ano | findstr :5000
# Kill process if needed
taskkill /PID <PID> /F
```

### Frontend won't start
```powershell
# Clear cache and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### OpenAI API errors
- Verify API key is correct
- Check OpenAI account has credits
- Ensure GPT-4 access is enabled

---

## 📚 Documentation

- **README.md** - Project overview and setup
- **USER_GUIDE.md** - End-user instructions
- **CODE_DOCUMENTATION.md** - Technical details
- **DEPLOYMENT.md** - Production deployment
- **PRESENTATION.md** - Project approach and demo

---

## 🎯 Quick Test Commands

### Test Backend API
```powershell
# Health check
curl http://localhost:5000/api/health

# Test translation (requires backend running)
curl -X POST http://localhost:5000/api/translation/translate `
  -H "Content-Type: application/json" `
  -d '{\"text\":\"Hello\",\"sourceLang\":\"English\",\"targetLang\":\"Spanish\"}'
```

---

## 📞 Support

Issues? Check:
1. Node.js version: `node --version` (should be v14+)
2. npm version: `npm --version`
3. OpenAI API key is set
4. Both backend and frontend are running
5. Browser is Chrome, Edge, or Safari

---

## 🌟 Features to Test

1. ✅ Speech recognition (click Start Listening)
2. ✅ Real-time transcription
3. ✅ Automatic translation
4. ✅ Audio playback (Speak button)
5. ✅ Language switching
6. ✅ Mobile responsive (resize browser)
7. ✅ Clear button
8. ✅ Error messages

---

**Ready to use!** 🎉

Visit http://localhost:3000 to start translating.
