// Configuración CORS para el backend
// Agregar esto a tu servidor Express

const cors = require('cors');

// Configuración básica
app.use(cors({
  origin: 'http://localhost:5173', // Puerto del frontend
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// O configuración más permisiva para desarrollo
app.use(cors({
  origin: true,
  credentials: true
}));