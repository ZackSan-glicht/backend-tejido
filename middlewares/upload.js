const multer = require('multer');
const path = require('path');

// Configuramos dónde y cómo se guardan los archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Los guarda en la carpeta "uploads"
  },
  filename: function (req, file, cb) {
    // Le ponemos la fecha actual al nombre del archivo para que no se repitan
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro: Solo aceptamos imágenes y PDFs
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Formato no válido. Solo se permiten imágenes y PDFs.'));
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;