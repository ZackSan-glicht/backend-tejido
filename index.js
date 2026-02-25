const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');
const fs = require('fs'); // Mantenemos fs y path arriba del todo

const sequelize = require('./db');
const { Usuario, Posteo, Tablero, Comentario } = require('./models');

// Importamos las rutas
const postRoutes = require('./routes/postRoutes');
const tableroRoutes = require('./routes/tableroRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const chatRoutes = require('./routes/chatRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes'); 
const usuarioRoutes = require('./routes/usuarioRoutes');
const iaRoutes = require('./routes/iaRoutes');

const app = express();

// --- LÓGICA DE CARPETA UPLOADS ---
// Esto asegura que Render tenga donde guardar las fotos apenas inicie
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

app.use(cors());
app.use(express.json());

// Servir la carpeta de fotos para que el celu las pueda ver
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('¡Hola! El backend de la App de Tejido está funcionando perfecto en Render 🧶');
});

// --- RUTAS CENTRALIZADAS ---
app.use('/api/ia', iaRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tableros', tableroRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 3000;

// Sincronizar y arrancar
sequelize.sync({ alter: true }).then(() => {
  console.log('Base de datos conectada en la nube.');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(error => {
  console.error('Error conectando a la base de datos:', error);
});