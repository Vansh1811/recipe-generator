async function generateRecipe() {
  const ingredients = document.getElementById('ingredients').value;
  const resultDiv = document.getElementById('result');

  if (!ingredients.trim()) {
    resultDiv.innerText = "Please enter some ingredients.";
    return;
  }

  resultDiv.innerText = "Generating recipe... 🍽️";

  try {
    const response = await fetch("http://127.0.0.1:5000/openai-proxy/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        prompt: `You are a creative chef. Using the following ingredients: ${ingredients}, write a complete recipe.
        Include:
        1. A creative title,
        2. Servings,
        3. Prep and cook time,
        4. Full ingredient list,
        5. At least 5 step-by-step cooking instructions.

        Make it fun, detailed, and easy to follow.`
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error: ${response.status}\n${errorText}`);
    }

    const data = await response.json();
    resultDiv.innerText = data.message || "No recipe generated.";
  } catch (error) {
    console.error("❌ Error:", error);
    resultDiv.innerText = "❌ Failed to fetch recipe. Is the backend running?";
  }
}
