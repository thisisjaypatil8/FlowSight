# **Flowsight — Advanced PDF Speed Reader**

link of the website: [https://flowsight.app](https://flow-sight-kappa.vercel.app/)

Flowsight is a modern, React-based web application built to improve reading speed and comprehension using **RSVP (Rapid Serial Visual Presentation)** and **Guided Reading techniques**.  
It processes PDF files completely **client-side**, providing a distraction-free reading experience designed for speed and cognitive efficiency.

---

## 🌟 Features

### 🚀 Dual Reading Modes
- **RSVP Mode** – Displays words one at a time in a fixed location to eliminate eye movement (saccades).
- **Original / Highlight Mode** – Renders the original PDF layout and guides reading with a moving word-level highlight.

### 📄 PDF Parsing  
Built on **PDF.js**, enabling secure in-browser PDF rendering and text extraction.

### ⚙️ Customizable Controls
- Adjustable **WPM (100–1000+)**
- Configurable **word chunk size (1–5 words)** for RSVP mode
- **Zoom controls** for PDF view

### 🔁 Smart Auto-Scroll  
Automatically scrolls the PDF to keep the active line centered.

### 📱 Responsive Design  
Optimized for desktop, tablets, and mobile devices.

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React (Vite) |
| Styling | Tailwind CSS |
| PDF Engine | PDF.js |
| Icons | Lucide React |
| State Logic | React Hooks |

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- npm (comes with Node.js)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/yourusername/flowsight.git
cd flowsight

# Install dependencies
npm install

# Fix Tailwind version mismatch (if any)
npm install -D tailwindcss@3.4.17

# Run the app
npm run dev
```
## 📂 Project Structure
```text
src/
├── components/         # UI Components
│   ├── ControlBar.jsx  # Play/Pause, Seek, WPM controls
│   ├── PDFDisplay.jsx  # Canvas rendering & Highlighter logic
│   ├── RSVPDisplay.jsx # The center-screen flashing word box
│   └── TopBar.jsx      # Navigation and Mode switching
├── hooks/              # Custom Logic Hooks
│   ├── usePdfLoader.js # Handles PDF.js worker and text extraction
│   └── useReaderEngine.js # Handles the timing and loop logic
└── App.jsx             # Main application entry

```

### 📖 How to Use

1. **Upload a PDF**
   - Click **“Select PDF File”**
   - or **drag and drop** a file into the window

2. **Select Reading Mode**
   - ⚡ **Speed Mode** → RSVP view (single/multiple words flashed)
   - 📄 **Original Mode** → PDF layout with guided word highlighting

3. **Start Reading**
   - Press the **Play** button to begin playback

4. **Customize Settings**
   - Adjust **Words Per Minute (WPM)**
   - Set **chunk size (1–5 words at a time)**
   - Change **zoom level** for PDF view



### 🤝 Contributing

Contributions are welcome!

1. **Fork** the repository
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
3. **Commit you changes**
    ```bash
    git commit -m "Add some Amazing Feature"
4. **Push to the branch**
    ```bash
    git push origin feature/AmazingFeature
5. **Open a Pull Request**

### 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
## developed by [Jay Patil](https://github.com/thisisjaypatil8)
