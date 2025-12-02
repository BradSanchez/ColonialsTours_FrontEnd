# Colonials Tours - Frontend

Frontend React integrado con backend Node.js/Express separado.

## Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar backend
Asegúrate de que tu backend esté corriendo en `http://localhost:3001`

### 3. Ejecutar frontend
```bash
npm run dev
```

## Endpoints Conectados

- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/profile` - Perfil de usuario

## Componentes Integrados

- **Login** - Conectado al endpoint de autenticación
- **Register** - Conectado al endpoint de registro
- **AuthContext** - Manejo global de autenticación

El frontend se conecta automáticamente al backend en `http://localhost:3001/api`.