# Text Enhancer

AI-powered meaning-preserving text enhancer with:
- Backend: Node.js + Express using Gemini API (gemini-2.5-flash, gemini-embedding-001)
- Frontend: React + Vite (shadcn/ui)

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- A valid GEMINI_API_KEY

### Setup
1. Copy `.env.example` to `.env` and set your key:
   ```
   GEMINI_API_KEY="your_key_here"
   ```
2. Install frontend dependencies:
   ```
   cd meaning-mint
   npm install
   ```

### Run
1. Start backend (port 3000):
   ```
   cd ..
   node server.js
   ```
   - Health: `GET http://localhost:3000/`
   - Enhance: `POST http://localhost:3000/enhance` with body `{ "text": "..." }`

2. Start frontend (port 8080):
   ```
   cd meaning-mint
   npm run dev
   ```
   Open `http://localhost:8080/`

## Notes
- `.env` is ignored by git; do not commit secrets.
- CORS is enabled on the backend for local dev.
- The frontend calls `http://localhost:3000/enhance` directly.

## GitHub
Recommended repo name: `text-enhancer` (hyphens instead of spaces).
To push:
```
git init
git add .
git commit -m "Initial commit: Text Enhancer"
git branch -M main
git remote add origin https://github.com/<your-username>/text-enhancer.git
git push -u origin main
```
