import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;

// Configure OpenAI client
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Middleware
app.use(cors());
app.use(express.json());

// File uploads
const upload = multer({ dest: 'uploads/' });

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, model = 'gpt-4o-mini' } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const botResponse =
      response.choices?.[0]?.message?.content?.trim() ||
      '⚠️ No response generated.';

    res.json({ response: botResponse });
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ error: err.message });
  }
});

// File upload + GPT analysis
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const content = fs.readFileSync(req.file.path, 'utf-8');

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: `Analyze this file content:\n\n${content}` },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    fs.unlinkSync(req.file.path); // delete file

    const botResponse =
      response.choices?.[0]?.message?.content?.trim() ||
      '⚠️ No response generated.';

    res.json({ fileName: req.file.originalname, response: botResponse });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
