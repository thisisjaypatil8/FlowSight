# **FlowSight — AI-Powered PDF Speed Reader**

Link: [https://flowsight.app](https://flow-sight-kappa.vercel.app/)

FlowSight is a next-generation React-based speed reading application that uses **AI-powered Natural Reading**, **RSVP (Rapid Serial Visual Presentation)**, and **intelligent phrase detection** to dramatically improve reading speed and comprehension.  

Built entirely **client-side** with cutting-edge technologies, FlowSight provides a distraction-free, privacy-first reading experience.

---

## 🌟 Key Features

### 🧠 AI-Powered Natural Reading ✨ **NEW**
- **Smart Phrase Detection**: Uses local AI (Transformers.js) to understand text structure
- **POS Tagging**: Groups words into natural phrases (noun phrases, verb phrases, etc.)
- **Context-Aware Chunking**: Reads text the way humans naturally process it
- **100% Local**: No API keys, no data sent to servers, complete privacy
- **Browser-Based AI**: Runs directly in your browser using WebAssembly

### 🎯 Intelligent Reading Experience
- **Natural Pausing**: Automatically pauses at:
  - Periods and questions (2.5x pause)
  - Line breaks (1.8x pause) 
  - Commas and semicolons (1.5x pause)
- **Line Break Detection**: Recognizes when text moves to a new line
- **Dynamic Pacing**: Adapts reading speed based on punctuation and structure

### 🎨 Smooth Visual Transitions
- **Sliding Animations**: Highlight smoothly glides between phrases
- **Gradient Highlights**: Professional blue gradient with shadows
- **Continuous Strips**: Multi-word phrases highlighted as single blocks
- **GPU Accelerated**: Butter-smooth 60fps animations

### 🚀 Dual Reading Modes
- **RSVP Mode**: Display phrases in center screen (2-4 words at once)
- **PDF Mode**: Original layout with intelligent phrase highlighting
- **Flexible Chunking**: 1-5 words per chunk (or AI-determined)

### 📄 Advanced PDF Processing
- **PDF.js Engine**: Secure, in-browser PDF rendering
- **Word-Level Extraction**: Precise positioning data for every word
- **Multi-Page Support**: Seamless reading across pages
- **Smart Scrolling**: Auto-centers current reading position

### ⚙️ Customizable Settings
- **Variable WPM**: 100-1000+ words per minute
- **Natural Reading Toggle**: Switch between modes instantly
- **AI Enhancement**: Optional AI-powered phrase detection
- **Zoom Controls**: Adjust PDF scale (50%-300%)
- **Dark Mode**: Elegant dark theme support

### 📱 Modern Design
- **Responsive**: Works on desktop, tablet, and mobile
- **Tailwind CSS**: Clean, professional styling
- **Lucide Icons**: Beautiful, consistent iconography

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React 18 (Vite) |
| Styling | Tailwind CSS v4 |
| PDF Engine | PDF.js |
| AI/ML | Transformers.js |
| POS Tagging | BERT Multilingual |
| Icons | Lucide React |
| State | React Hooks |
| Animation | CSS Transitions |

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js v18 or higher
- npm (comes with Node.js)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/thisisjaypatil8/FlowSight.git
cd FlowSight

# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📂 Project Structure
```text
src/
├── components/         # UI Components
│   ├── ControlBar.jsx  # Playback controls
│   ├── PDFDisplay.jsx  # PDF rendering with smart highlighting
│   ├── RSVPDisplay.jsx # Center-screen phrase display
│   ├── TopBar.jsx      # Mode switching & settings
│   └── SettingsModal.jsx # Configuration panel
├── hooks/              # Custom React Hooks
│   ├── usePdfLoader.js # PDF processing and text extraction
│   ├── useReaderEngine.js # Reading engine with variable timing
│   └── useAIProcessor.js # AI model management
├── utils/              # Utility Functions
│   ├── naturalReadingUtils.js # Heuristic phrase detection
│   └── aiChunker.js    # AI-powered phrase boundaries
├── workers/            # Web Workers
│   └── aiWorker.js     # Background AI processing
└── App.jsx             # Main application
```

---

## 📖 How to Use

### 1. **Upload a PDF**
- Click **"Select PDF File"** or drag and drop
- File is processed entirely in your browser

### 2. **Enable Natural Reading** (Optional)
- Open **Settings** (gear icon)
- Toggle **Natural Reading** ON
- For AI mode: Toggle **AI Enhanced** ON
  - First time loads ~60MB model (cached after)

### 3. **Choose Reading Mode**
- **RSVP**: Phrases flash in center screen
- **PDF**: Original layout with smart highlighting

### 4. **Start Reading**
- Press **Play** ▶️
- Watch phrases highlight smoothly
- Notice intelligent pauses at punctuation

### 5. **Customize**
- Adjust **WPM** (speed)
- Change **chunk size** (if Natural Reading is off)
- Zoom in/out on PDF
- Reset to defaults anytime

---

## 🧪 How It Works

### Natural Reading (Heuristic)
1. Text split into phrases (2-4 words)
2. Break points at:
   - Punctuation marks
   - Line breaks (Y-coordinate change)
   - Page boundaries
   - Max length (4 words)
3. Variable delays calculated
4. Smooth transitions applied

### AI-Enhanced Mode
1. **POS Tagging**: Identifies parts of speech
2. **Phrase Grouping**: Keeps related words together
   - "the quick brown fox" → noun phrase
   - "jumps over" → verb phrase
3. **Smart Boundaries**: Breaks at conjunctions, punctuation
4. **Context Aware**: Understands linguistic structure

---

## 🎯 Benefits

✅ **Faster Reading**: 2-3x speed improvement  
✅ **Better Comprehension**: Natural phrase grouping  
✅ **Reduced Eye Strain**: Minimal eye movement  
✅ **Privacy First**: Everything runs locally  
✅ **No Subscriptions**: Free and open source  
✅ **Works Offline**: After first AI model download  

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create feature branch: `git checkout -b feature/AmazingFeature`
3. Commit changes: `git commit -m "Add AmazingFeature"`
4. Push branch: `git push origin feature/AmazingFeature`
5. Open Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 🙏 Credits

**AI Model**: [Transformers.js](https://github.com/xenova/transformers.js)  
**PDF Engine**: [PDF.js](https://github.com/mozilla/pdf.js)  
**POS Model**: BERT Base Multilingual Cased  

---

## 👨‍💻 Developer

**Developed by** [Jay Patil](https://github.com/thisisjaypatil8)

---

⭐ **Star this repo** if you find it useful!
