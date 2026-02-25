const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { Usuario, Posteo, Tablero, Comentario } = require('../models');

// GET: Generar y descargar el Reporte Global (Solo Admin)
router.get('/global/:adminId', async (req, res) => {
  try {
    // 1. Verificamos que el que pide el reporte sea el Admin
    const admin = await Usuario.findByPk(req.params.adminId);
    if (!admin || admin.rol !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
    }

    // 2. Juntamos las métricas de la base de datos
    const totalUsuarios = await Usuario.count();
    const totalPosteos = await Posteo.count();
    const totalTableros = await Tablero.count();
    const totalComentarios = await Comentario.count();

    // 3. Preparamos el archivo PDF para enviarlo como descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Reporte_Global_Tejidos.pdf');

    // 4. Empezamos a dibujar el PDF
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res); // Conectamos el documento a la respuesta del servidor

    // Título
    doc.fontSize(24).fillColor('#FF6B6B').text('Reporte Global de la Comunidad', { align: 'center' });
    doc.moveDown();
    
    // Fecha y separador
    doc.fontSize(12).fillColor('#666666').text(`Generado el: ${new Date().toLocaleDateString('es-AR')}`, { align: 'center' });
    doc.moveDown();
    doc.moveTo(50, 120).lineTo(550, 120).stroke('#DDDDDD');
    doc.moveDown(2);

    // Estadísticas
    doc.fontSize(18).fillColor('#333333').text('Métricas Principales:');
    doc.moveDown();

    doc.fontSize(14).fillColor('#000000');
    doc.text(`Usuarios registrados: ${totalUsuarios}`);
    doc.moveDown(0.5);
    doc.text(`Tejidos publicados: ${totalPosteos}`);
    doc.moveDown(0.5);
    doc.text(`Tableros creados: ${totalTableros}`);
    doc.moveDown(0.5);
    doc.text(`Comentarios realizados: ${totalComentarios}`);
    doc.moveDown(2);

    // Mensaje final
    doc.fontSize(12).fillColor('#888888').text('Este reporte es generado automáticamente por el sistema para uso exclusivo del Administrador.', { align: 'center' });

    // Terminamos y cerramos el PDF
    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al generar el reporte PDF' });
  }
});

module.exports = router;