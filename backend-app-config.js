// Agregar al app.js principal del backend

const express = require('express');
const path = require('path');
const uploadRoutes = require('./routes/upload');

const app = express();

// Middleware existente...
app.use(express.json());
app.use(cors());

// Servir archivos estáticos (imágenes subidas)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas existentes...
app.use('/api/auth', authRoutes);
app.use('/api/tours', toursRoutes);

// Nueva ruta para subir imágenes
app.use('/api/upload', uploadRoutes);

// Instalar dependencia necesaria:
// npm install multer