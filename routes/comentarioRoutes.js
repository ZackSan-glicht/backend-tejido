const express = require('express');
const router = express.Router();
const { Comentario, Usuario } = require('../models');

// GET: Traer todos los comentarios de un posteo específico (con sus respuestas anidadas)
router.get('/post/:postId', async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      where: { 
        PosteoId: req.params.postId,
        respuestaAId: null // Solo traemos los comentarios principales (los que no son respuestas)
      },
      include: [
        { model: Usuario, attributes: ['nombre', 'foto_perfil'] }, // Quién comentó
        { 
          model: Comentario, 
          as: 'Respuestas', // Traemos las respuestas a este comentario
          include: [{ model: Usuario, attributes: ['nombre', 'foto_perfil'] }] 
        }
      ],
      order: [['createdAt', 'DESC']] // Los más nuevos primero
    });
    res.json(comentarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar los comentarios' });
  }
});

// POST: Crear un nuevo comentario o responder a uno existente
router.post('/', async (req, res) => {
  try {
    const { texto, usuarioId, posteoId, respuestaAId } = req.body;
    
    // Si mandan "respuestaAId", Sequelize automáticamente lo vincula como una respuesta a ese comentario
    const nuevoComentario = await Comentario.create({
      texto,
      UsuarioId: usuarioId,
      PosteoId: posteoId,
      respuestaAId: respuestaAId || null 
    });

    res.status(201).json({ mensaje: 'Comentario publicado', comentario: nuevoComentario });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al publicar el comentario' });
  }
});

module.exports = router;