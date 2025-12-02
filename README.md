# Colonials Tours - Frontend

Frontend React integrado con backend Node.js/Express separado.

## Configuración Rápida

### Opción 1: Script Automático (Windows)
```bash
quick-setup.bat
```

### Opción 2: Manual

#### 1. Instalar dependencias
```bash
npm install
```

#### 2. Verificar archivo .env
Asegúrate de que existe `.env` con:
```
VITE_API_URL=http://localhost:3001/api
VITE_CLOUDINARY_CLOUD_NAME=drxaxh9cr
```

#### 3. Iniciar backend PRIMERO
El backend debe estar corriendo en `http://localhost:3001`

#### 4. Ejecutar frontend
```bash
npm run dev
```

## Endpoints Conectados

- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/register` - Registro de usuario
- `GET /api/auth/profile` - Perfil de usuario

## Componentes Disponibles

- **Login** - Conectado al endpoint de autenticación
- **Register** - Conectado al endpoint de registro
- **AuthContext** - Manejo global de autenticación
- **Dropdown** - Componente dropdown reutilizable
- **DropdownExample** - Ejemplo de uso del dropdown

## Solución de Problemas

### Error de conexión
- Verifica que el backend esté corriendo en puerto 3001
- Revisa la consola del navegador para errores
- Asegúrate de que el archivo .env existe

### Dropdown no funciona
- Importa: `import Dropdown from './Components/Dropdown'`
- Usa el formato: `options=[{value: 'id', label: 'Texto'}]`

El frontend se conecta automáticamente al backend en `http://localhost:3001/api`.