const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Inicializamos la IA con la clave de tu archivo .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST: Mandarle un mensaje a la IA y recibir respuesta
router.post('/', async (req, res) => {
  try {
    const { mensaje } = req.body; // El texto que escribe el usuario (Ej: "Qué lana uso para bufanda?")
    
    // Usamos el modelo generativo de texto
   const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Le damos contexto para que actúe como experto en tejido
    const prompt = `Sos un asistente experto en tejido, crochet y manualidades. Respondé a esta consulta de forma amable y breve: ${mensaje}`;
    
    const result = await model.generateContent(prompt);
    const respuestaIA = result.response.text();

    res.json({ respuesta: respuestaIA });
  } catch (error) {
    console.error('Error con la IA:', error);
    res.status(500).json({ error: 'Error al comunicarse con el asistente de IA' });
  }
});

module.exports = router;