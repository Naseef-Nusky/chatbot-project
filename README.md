🤖 AI Chatbot Project

A full-stack AI-powered chatbot with a React frontend and a Node.js/Express backend.
Supports OpenAI chat, file upload & content analysis, and voice input.

📂 Project Structure
frontend/  — React app (UI for chat, file upload, voice input)
backend/   — Node.js/Express server (API + OpenAI integration)

✨ Features

💬 AI Chat powered by OpenAI (gpt-4o-mini)

📄 File Upload → AI analyzes content and returns a response

🎤 Voice Input via browser speech recognition API

📝 Markdown Rendering for AI responses

📱 Responsive & Modern UI built with Tailwind CSS


🛠️ Tech Stack

Frontend: React, Tailwind CSS, React Markdown, Lucide Icons
Backend: Node.js, Express, Multer, OpenAI API, CORS
Environment: .env for API keys

🚀 Setup Instructions
1️⃣ Backend (Node.js + Express)

Navigate to backend and install dependencies:

cd backend
npm install


Create .env:

PORT=3001
OPENAI_API_KEY=your_openai_api_key_here


Start the server:

npm run dev   # Development
npm start     # Production


Backend runs at: http://localhost:3001

2️⃣ Frontend (React)

Navigate to frontend and install dependencies:

cd frontend
npm install


Start React:

npm run dev   # Vite
# or
npm start     # CRA


Frontend runs at: http://localhost:3000

💻 Usage

Open the app in your browser.

Chat with the AI assistant.

Upload files to get AI-analyzed responses.

Click 🎤 to speak via voice input.

AI responses support Markdown formatting.

💡 Contributions

Improve UI/UX

Add new AI features

Optimize performance