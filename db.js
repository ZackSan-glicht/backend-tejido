const { Sequelize } = require('sequelize');

// Reemplazá el texto entre comillas por el link exacto que copiaste de Neon
const CLOUD_DB_URL = 'postgresql://neondb_owner:npg_Ts4aPyWlx6Jr@ep-gentle-leaf-ai7jiuc3-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const sequelize = new Sequelize(CLOUD_DB_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Esto es clave para que las conexiones en la nube funcionen
    }
  },
  logging: false, // Para que la consola no se llene de mensajes
});

module.exports = sequelize;