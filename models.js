const { DataTypes } = require('sequelize');
const sequelize = require('./db');

// --- 1. DEFINICIÓN DE TABLAS ---

const Usuario = sequelize.define('Usuario', {
  auth0_id: { type: DataTypes.STRING, unique: true, allowNull: false }, 
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  nombre: { type: DataTypes.STRING },
  // NUEVO: La biografía del perfil
  descripcion: { type: DataTypes.TEXT, allowNull: true },
  foto_perfil: { type: DataTypes.STRING },
  rol: { type: DataTypes.STRING, defaultValue: 'tejedor' }
});

const Posteo = sequelize.define('Posteo', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  imagen_url: { type: DataTypes.STRING },
  pdf_patron_url: { type: DataTypes.STRING },
  estado: { type: DataTypes.STRING, defaultValue: 'en_proceso' }
});

const Tablero = sequelize.define('Tablero', {
  nombre: { type: DataTypes.STRING, allowNull: false }
});

const Comentario = sequelize.define('Comentario', {
  texto: { type: DataTypes.TEXT, allowNull: false }
});

// --- 2. RELACIONES DE LA BASE DE DATOS ---

// Usuarios, Posteos y Tableros
Usuario.hasMany(Posteo);
Posteo.belongsTo(Usuario);

Usuario.hasMany(Tablero);
Tablero.belongsTo(Usuario);

Tablero.belongsToMany(Posteo, { through: 'Tablero_Posteo' });
Posteo.belongsToMany(Tablero, { through: 'Tablero_Posteo' });

// Comentarios
Usuario.hasMany(Comentario);
Comentario.belongsTo(Usuario);
Posteo.hasMany(Comentario);
Comentario.belongsTo(Posteo);

// Respuestas de Comentarios
Comentario.hasMany(Comentario, { as: 'Respuestas', foreignKey: 'respuestaAId' });
Comentario.belongsTo(Comentario, { as: 'Padre', foreignKey: 'respuestaAId' });

// Likes (Me Gusta)
Posteo.belongsToMany(Usuario, { through: 'MeGusta', as: 'Likes' });
Usuario.belongsToMany(Posteo, { through: 'MeGusta', as: 'PosteosGustados' });

// NUEVO: Seguidores (Followers)
Usuario.belongsToMany(Usuario, { as: 'Seguidores', through: 'Seguimientos', foreignKey: 'seguidoId', otherKey: 'seguidorId' });
Usuario.belongsToMany(Usuario, { as: 'Siguiendo', through: 'Seguimientos', foreignKey: 'seguidorId', otherKey: 'seguidoId' });

// --- 3. EXPORTAR ---
module.exports = { Usuario, Posteo, Tablero, Comentario };