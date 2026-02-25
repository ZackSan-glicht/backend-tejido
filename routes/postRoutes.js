const express = require('express');
const router = express.Router();
const { Posteo, Usuario } = require('../models');
const upload = require('../middlewares/upload');
const fs = require('fs'); // NUEVO: Librería para manejar archivos del disco duro
const path = require('path');

// GET: Traer todos los posteos
router.get('/', async (req, res) => {
  try {
    const posteos = await Posteo.findAll({
      include: [{ model: Usuario }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posteos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los posteos' });
  }
});

// GET: Buscar posteos
router.get('/buscar', async (req, res) => {
  try {
    const { q } = req.query;
    const posteos = await Posteo.findAll({
      where: { titulo: { [require('sequelize').Op.iLike]: `%${q}%` } },
      include: [{ model: Usuario }]
    });
    res.json(posteos);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda' });
  }
});

// POST: Crear un nuevo posteo (con imagen y PDF opcional)
router.post('/', upload.fields([{ name: 'imagen', maxCount: 1 }, { name: 'pdf_patron', maxCount: 1 }]), async (req, res) => {
  try {
    const { titulo, descripcion, usuarioId } = req.body;
    const imagen_url = req.files['imagen'] ? req.files['imagen'][0].path : null;
    const pdf_patron_url = req.files['pdf_patron'] ? req.files['pdf_patron'][0].path : null;

    const nuevoPosteo = await Posteo.create({ titulo, descripcion, imagen_url, pdf_patron_url, UsuarioId: usuarioId });
    res.status(201).json(nuevoPosteo);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el posteo' });
  }
});

// DELETE: Borrar un posteo y SUS ARCHIVOS FÍSICOS
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { usuarioId } = req.body;

    const posteo = await Posteo.findByPk(id);
    if (!posteo) return res.status(404).json({ error: 'Posteo no encontrado' });

    const usuarioPeticion = await Usuario.findByPk(usuarioId);
    
    // Candado: Solo el dueño o el admin pueden borrar
    if (posteo.UsuarioId !== usuarioId && usuarioPeticion.rol !== 'admin') {
      return res.status(403).json({ error: 'No tenés permiso para borrar este posteo.' });
    }

    // MAGIA: Borramos la imagen de la carpeta uploads
    if (posteo.imagen_url) {
      const rutaImagen = path.join(__dirname, '..', posteo.imagen_url);
      if (fs.existsSync(rutaImagen)) fs.unlinkSync(rutaImagen);
    }

    // MAGIA: Borramos el PDF de la carpeta uploads
    if (posteo.pdf_patron_url) {
      const rutaPdf = path.join(__dirname, '..', posteo.pdf_patron_url);
      if (fs.existsSync(rutaPdf)) fs.unlinkSync(rutaPdf);
    }

    await posteo.destroy();
    res.json({ mensaje: 'Posteo y archivos eliminados correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al eliminar el posteo' });
  }
});

module.exports = router;