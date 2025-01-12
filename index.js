// Importar módulos necesarios
const express = require('express');
const fs = require('fs');
const path = require('path');

// Inicializar la aplicación
const app = express();
const PORT = 3000;
const FILE_PATH = path.join(__dirname, 'repertorio.json');

// Middleware para manejar JSON
app.use(express.json());

// Middleware para servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Leer repertorio desde el archivo
function readRepertorio() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error leyendo el archivo:', error);
    return [];
  }
}

// Escribir repertorio al archivo
function writeRepertorio(data) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error escribiendo en el archivo:', error);
  }
}

// Rutas CRUD

// Obtener todas las canciones
app.get('/canciones', (req, res) => {
  const canciones = readRepertorio();
  res.json(canciones);
});

// Agregar una nueva canción
app.post('/canciones', (req, res) => {
  const canciones = readRepertorio();
  const nuevaCancion = req.body;
  canciones.push(nuevaCancion);
  writeRepertorio(canciones);
  res.status(201).json({ mensaje: 'Canción agregada', cancion: nuevaCancion });
});

// Editar una canción existente
app.put('/canciones/:id', (req, res) => {
  const canciones = readRepertorio();
  const id = Number(req.params.id); // Convertir el ID recibido a número
  const cancionEditada = req.body; // Nuevos datos de la canción
  const index = canciones.findIndex((c) => c.id === id);

  if (index !== -1) {
    // Asegurarse de no modificar el ID
    canciones[index] = { ...canciones[index], ...cancionEditada, id: canciones[index].id };
    writeRepertorio(canciones);
    res.json({ mensaje: 'Canción actualizada', cancion: canciones[index] });
  } else {
    res.status(404).json({ mensaje: 'Canción no encontrada' });
  }
});


// Eliminar una canción
app.delete('/canciones/:id', (req, res) => {
  const canciones = readRepertorio();
  const id = Number(req.params.id); // Convertir el ID a número

  const nuevasCanciones = canciones.filter((c) => c.id !== id);

  if (canciones.length === nuevasCanciones.length) {
    return res.status(404).json({ mensaje: 'Canción no encontrada' });
  }

  writeRepertorio(nuevasCanciones);
  res.json({ mensaje: 'Canción eliminada' });
});

// Levantar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
