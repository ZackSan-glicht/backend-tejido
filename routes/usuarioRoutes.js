const express = require('express');
const router = express.Router();
const { Usuario, Posteo } = require('../models');
const upload = require('../middlewares/upload');
const { Op } = require('sequelize');

// 1. POST: Sincronizar Auth0
// 1. POST: Sincronizar Auth0 y asignar Admin
router.post('/sync', async (req, res) => {
  try {
    const { auth0_id, email, nombre, foto_perfil } = req.body;
    
    // Si el correo es el tuyo, te da la corona de admin. Si no, sos un tejedor normal.
    const rolAsignado = email === 'facuvillanuevapapu@gmail.com' ? 'admin' : 'tejedor';

    const [usuario, creado] = await Usuario.findOrCreate({
      where: { auth0_id: auth0_id },
      defaults: { email, nombre: nombre || 'Tejedor/a Nuevo', foto_perfil: foto_perfil || 'https://via.placeholder.com/150', rol: rolAsignado }
    });

    // Si ya te habías creado la cuenta antes de este código, te ascendemos a admin a la fuerza
    if (!creado && email === 'facuvillanuevapapu@gmail.com' && usuario.rol !== 'admin') {
      await usuario.update({ rol: 'admin' });
    }

    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al sincronizar el usuario' });
  }
});
// 2. GET: Buscar usuarios (La lupa)
router.get('/buscar', async (req, res) => {
  try {
    const { q } = req.query;
    const usuarios = await Usuario.findAll({ where: { nombre: { [Op.iLike]: `%${q}%` } } });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar usuarios' });
  }
});

// 3. POST: Seguir / Dejar de seguir a un usuario
router.post('/:id/seguir', async (req, res) => {
  try {
    const seguidoId = req.params.id; // A quién quiero seguir
    const { usuarioId } = req.body;  // Quién soy yo (el que toca el botón)

    const seguido = await Usuario.findByPk(seguidoId);
    const seguidor = await Usuario.findByPk(usuarioId);

    if (!seguido || !seguidor) return res.status(404).json({ error: 'Usuario no encontrado' });

    // ¿Ya lo sigo?
    const yaLoSigue = await seguidor.hasSiguiendo(seguido);

    if (yaLoSigue) {
      await seguidor.removeSiguiendo(seguido);
      res.json({ mensaje: 'Dejaste de seguir a este usuario', siguiendo: false });
    } else {
      await seguidor.addSiguiendo(seguido);
      res.json({ mensaje: 'Ahora sigues a este usuario', siguiendo: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al procesar el seguimiento' });
  }
});

// 4. PUT: Actualizar perfil (Nombre, Foto y DESCRIPCIÓN)
router.put('/:id', upload.single('foto'), async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    
    const usuario = await Usuario.findByPk(id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const foto_perfil = req.file ? req.file.path : usuario.foto_perfil;

    await usuario.update({ 
      nombre: nombre || usuario.nombre, 
      descripcion: descripcion !== undefined ? descripcion : usuario.descripcion,
      foto_perfil 
    });

    res.json({ mensaje: 'Perfil actualizado con éxito', usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el perfil' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, {
      include: [
        // AHORA SÍ: Le pedimos el ID, el nombre y la foto
        { model: Usuario, as: 'Seguidores', attributes: ['id', 'nombre', 'foto_perfil'] },
        { model: Usuario, as: 'Siguiendo', attributes: ['id', 'nombre', 'foto_perfil'] }
      ]
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el usuario' });
  }
});

module.exports = router;