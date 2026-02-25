const express = require('express');
const router = express.Router();

router.post('/chat', async (req, res) => {
  try {
    const { pregunta } = req.body;
    const preguntaMinuscula = pregunta.toLowerCase();
    
    let respuestaIA = "";

    // Respuestas pre-armadas simulando una IA experta en tejido
    if (preguntaMinuscula.includes('aguja') || preguntaMinuscula.includes('lana')) {
      respuestaIA = "Para lanas gruesas te recomiendo usar agujas número 6mm a 8mm. Si es lana súper gruesa (chunky), andá directo por unas de 10mm o 12mm para que el tejido te quede esponjoso. 🧶";
    } else if (preguntaMinuscula.includes('amigurumi')) {
      respuestaIA = "Para los amigurumis, el secreto es tejer súper apretado para que no se vea el relleno. Usá una aguja medio punto más chica de lo que indica la etiqueta del hilo de algodón. ¡Y no te olvides de contar los puntos! 🧸";
    } else if (preguntaMinuscula.includes('hola') || preguntaMinuscula.includes('buen')) {
      respuestaIA = "¡Hola! ¿Cómo viene ese proyecto? Decime en qué te puedo ayudar hoy.";
    } else if (preguntaMinuscula.includes('gracias')) {
      respuestaIA = "¡De nada! Acordate que la práctica hace al maestro. Cualquier otra duda, avisame. ✨";
    } else {
      // Simulación de que la IA está pensando una respuesta genérica
      respuestaIA = `Es una gran pregunta sobre "${pregunta}". Como asistente de tejido te diría que siempre hagas una muestra de 10x10cm antes de empezar cualquier proyecto grande para medir tu tensión. ¿Necesitás ayuda con algo más específico?`;
    }

    // Le ponemos un mini retraso falso de 1.5 segundos para que parezca que la IA está "escribiendo"
    setTimeout(() => {
      res.json({ respuesta: respuestaIA });
    }, 1500);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error en el servidor de IA' });
  }
});

module.exports = router;