# 🛡️ AI Fake News Detector

An advanced fake news detection application powered by Google Gemini AI with support for multiple input formats and a stunning modern UI.

## ✨ Features

- **🤖 AI-Powered Analysis**: Uses Google Gemini Flash 2.0 for intelligent fact-checking
- **📝 Multi-Input Support**:
  - Text headlines and articles
  - URLs (news article links)
  - Images (screenshots, memes, infographics)
  - Videos (news clips, social media videos)
- **🎨 Advanced UI**:
  - Glassmorphism design
  - Smooth animations with Framer Motion
  - Responsive layout
  - Real-time credibility scoring
- **📊 Comprehensive Analysis**:
  - Credibility score (0-100%)
  - Verdict classification (Real/Fake/Uncertain)
  - Detailed AI analysis
  - Key points extraction
  - Source verification

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ashu13579/fake-news-detector-ai.git
cd fake-news-detector-ai
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
GEMINI_API_KEY=your_actual_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **AI**: Google Gemini AI
- **Icons**: Lucide React

## 📖 How It Works

1. **Input Selection**: Choose your input type (text, URL, image, or video)
2. **Content Submission**: Enter or upload your content
3. **AI Analysis**: Gemini AI analyzes the content for:
   - Source credibility
   - Factual accuracy
   - Emotional manipulation
   - Logical consistency
   - Signs of fabrication
4. **Results Display**: View comprehensive analysis with:
   - Credibility score
   - Verdict (Real/Fake/Uncertain)
   - Detailed explanation
   - Key findings
   - Verified sources

## 🎯 Use Cases

- Verify news headlines before sharing
- Check social media posts for misinformation
- Analyze images for manipulation
- Verify video content authenticity
- Educational tool for media literacy

## 🔒 Privacy

- No data is stored permanently
- All analysis happens in real-time
- Files are processed temporarily and not saved

## 📝 License

MIT License - feel free to use this project for learning and development!

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## 🙏 Acknowledgments

- Google Gemini AI for powerful language models
- Next.js team for the amazing framework
- Framer Motion for smooth animations

---

Built with ❤️ using AI and modern web technologies