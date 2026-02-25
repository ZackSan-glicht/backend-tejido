const express = require('express');
const router = express.Router();
const { Tablero, Posteo } = require('../models');

// 1. GET: Traer todos los tableros de un usuario (con sus posteos)
router.get('/:usuarioId', async (req, res) => {
  try {
    const tableros = await Tablero.findAll({
      where: { UsuarioId: req.params.usuarioId },
      include: Posteo 
    });
    res.json(tableros);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener los tableros' });
  }
});

// 2. POST: Crear un nuevo tablero
router.post('/', async (req, res) => {
  try {
    const { nombre, usuarioId } = req.body;
    const nuevoTablero = await Tablero.create({ nombre, UsuarioId: usuarioId });
    res.status(201).json({ mensaje: 'Tablero creado', tablero: nuevoTablero });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear el tablero' });
  }
});

// 3. POST: Guardar un posteo adentro de un tablero (La magia de Pinterest)
router.post('/:tableroId/posteo/:posteoId', async (req, res) => {
  try {
    const { tableroId, posteoId } = req.params;
    
    const tablero = await Tablero.findByPk(tableroId);
    const posteo = await Posteo.findByPk(posteoId);
    
    if (!tablero || !posteo) return res.status(404).json({ error: 'Tablero o posteo no encontrado' });

    // Sequelize hace la vinculación automáticamente en la tabla intermedia
    await tablero.addPosteo(posteo); 
    res.json({ mensaje: '¡Tejido guardado en el tablero!' });
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar el posteo' });
  }
});

// 4. DELETE: Quitar un posteo de un tablero (Sin borrar el posteo original)
router.delete('/:tableroId/posteo/:posteoId', async (req, res) => {
  try {
    const { tableroId, posteoId } = req.params;
    const tablero = await Tablero.findByPk(tableroId);
    const posteo = await Posteo.findByPk(posteoId);

    if (!tablero || !posteo) return res.status(404).json({ error: 'No encontrado' });

    await tablero.removePosteo(posteo);
    res.json({ mensaje: 'Tejido quitado del tablero' });
  } catch (error) {
    res.status(500).json({ error: 'Error al quitar el posteo' });
  }
});

// 5. DELETE: Borrar un tablero completo
router.delete('/:id', async (req, res) => {
  try {
    const tablero = await Tablero.findByPk(req.params.id);
    if (!tablero) return res.status(404).json({ error: 'Tablero no encontrado' });
    
    await tablero.destroy();
    res.json({ mensaje: 'Tablero eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el tablero' });
  }
});

module.exports = router;