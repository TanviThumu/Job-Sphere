require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function testGemini() {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: "Say hello to JobSphere in one short sentence.",
      store: false,
    });

    console.log("Gemini Response:");
    console.log(interaction.output_text);

  } catch (error) {
    console.error("Gemini Error:");
    console.error(error.message);
  }
}

testGemini();