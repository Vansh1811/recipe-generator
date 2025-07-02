import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  const prompt = req.body.prompt;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "HTTP-Referer": "http://localhost:5000", // required by OpenRouter
        "X-Title": "Recipe Generator AI"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000,
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      res.json({ message: data.choices[0].message.content });
    } else {
      res.status(500).json({ error: "Invalid response from OpenRouter", raw: data });
    }
  } catch (error) {
    console.error("OpenRouter Error:", error);
    res.status(500).json({ error: "Failed to get response from OpenRouter" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
