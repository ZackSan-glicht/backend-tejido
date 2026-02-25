const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const sequelize = require('./db');
const { Usuario, Posteo, Tablero, Comentario } = require('./models');
const checkJwt = require('./middlewares/auth');

const postRoutes = require('./routes/postRoutes');
const tableroRoutes = require('./routes/tableroRoutes');
const reporteRoutes = require('./routes/reporteRoutes');
const chatRoutes = require('./routes/chatRoutes');
const comentarioRoutes = require('./routes/comentarioRoutes'); 
const usuarioRoutes = require('./routes/usuarioRoutes');       

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.send('¡Hola! El backend de la App de Tejido está funcionando perfecto 🧶');
});

// --- RUTAS CENTRALIZADAS ---
app.use('/api/ia', require('./routes/iaRoutes'));
app.use('/api/posts', postRoutes);
app.use('/api/tableros', tableroRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/chat', chatRoutes); // Acá llama correctamente a tu IA configurada
app.use('/api/comentarios', comentarioRoutes);
app.use('/api/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  console.log('Base de datos conectada y sincronizada.');
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(error => {
  console.error('Error conectando a la base de datos:', error);
});