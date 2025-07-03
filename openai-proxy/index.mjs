import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from inside openai-proxy
dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
app.use(cors());
app.use(express.json());

app.post("/openai-proxy/api/chat", async (req, res) => {
  const prompt = req.body.prompt;
  console.log("🔥 /openai-proxy/api/chat hit");
  console.log("🔑 API Key length:", process.env.OPENROUTER_API_KEY?.length);
  console.log("🔑 Authorization:", `Bearer ${process.env.OPENROUTER_API_KEY?.slice(0, 20)}...`);

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(500).json({ error: "API key missing" });
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ Correct format
         "HTTP-Referer": "http://127.0.0.1:5500", 
        "X-Title": "Recipe Generator AI"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: "OpenRouter API error",
        details: data
      });
    }

    return res.json({ message: data.choices?.[0]?.message?.content || "No content returned." });
  } catch (error) {
    console.error("💥 Server Error:", error);
    return res.status(500).json({ error: "Internal server error", detail: error.message });
  }
});

app.listen(5000, () => {
  console.log("✅ Server running on http://localhost:5000");
});
