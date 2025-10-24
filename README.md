# BEWheels - Backend API

Backend para el proyecto BEWheels, una plataforma de carpooling universitario.

##  Backend Desplegado

**URL de Producción:** `https://bewheels.onrender.com`

Usa este dominio en tu frontend para consumir la API en producción.

---

##  Tabla de Contenidos

- [Requisitos](#requisitos)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [Contrato de Integración - API](#contrato-de-integración---api)
  - [Autenticación](#autenticación)
  - [Endpoints de Usuarios](#endpoints-de-usuarios)
  - [Endpoints de Autenticación](#endpoints-de-autenticación)
  - [Endpoints de Vehículos](#endpoints-de-vehículos)
  - [Endpoints de Viajes](#endpoints-de-viajes)
  - [Endpoints de Roles](#endpoints-de-roles)
- [Manejo de Imágenes](#manejo-de-imágenes)
- [Códigos de Estado HTTP](#códigos-de-estado-http)
- [Ejemplos de Integración](#ejemplos-de-integración)

---

##  Requisitos

- **Node.js** 18+ 
- **PostgreSQL** (Base de datos en la nube o local)
- **npm** o **yarn**

---

##  Configuración

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=tu_clave_secreta_jwt_aqui
```

**Notas:**
- Si usas un proveedor con SSL (como Render), la configuración SSL ya está incluida.
- El `JWT_SECRET` debe ser una cadena aleatoria y segura.

---

##  Ejecución

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor
node src/server.js

# O con nodemon (auto-reload)
npm run dev
```

El servidor estará disponible en `http://localhost:5000`

### Test de Conexión a Base de Datos

```bash
curl http://localhost:5000/test-db
```

---

##  Contrato de Integración - API

### Base URLs

- **Desarrollo:** `http://localhost:5000`
- **Producción:** `https://bewheels.onrender.com`

---

##  Autenticación

La mayoría de endpoints requieren autenticación mediante **JWT (JSON Web Token)**.

### Flujo de Autenticación

1. El usuario se registra usando `POST /api/usuarios/register`
2. El usuario inicia sesión usando `POST /api/auth/login` y recibe un token
3. El token debe enviarse en el header `Authorization` como `Bearer <token>` en todas las peticiones protegidas

**Header requerido para endpoints protegidos:**

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

##  Endpoints de Usuarios

### `POST /api/usuarios/register`

Registra un nuevo usuario en la plataforma.

**Autenticación:** No requerida

**Content-Type:** `multipart/form-data`

**Body (FormData):**

| Campo | Tipo | Requerido | Descripción | Validación |
|-------|------|-----------|-------------|------------|
| `nombre` | string | ✅ | Nombre completo | Min 3, Max 100 caracteres |
| `id_universitario` | string | ✅ | ID universitario | Alfanumérico, min 5, max 20 |
| `correo` | string | ✅ | Email institucional | Debe terminar en `@unisabana.edu.co` |
| `telefono` | string | ✅ | Número de teléfono | Min 7, Max 15 dígitos |
| `contrasena` | string | ✅ | Contraseña | Min 8 caracteres |
| `foto_perfil` | file | ❌ | Foto de perfil | Imagen (JPG/PNG/GIF), Max 2MB |

**Ejemplo JavaScript (Fetch):**

```javascript
const formData = new FormData();
formData.append('nombre', 'Juan Pérez');
formData.append('id_universitario', 'U202012345');
formData.append('correo', 'juan.perez@unisabana.edu.co');
formData.append('telefono', '3001234567');
formData.append('contrasena', 'miPassword123');
// Si hay foto:
formData.append('foto_perfil', fileInput.files[0]);

const response = await fetch('https://bewheels.onrender.com/api/usuarios/register', {
  method: 'POST',
  body: formData
});

const data = await response.json();
```

**Respuesta Exitosa (201):**

```json
{
  "message": "Usuario registrado con éxito",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@unisabana.edu.co",
    "telefono": "3001234567",
    "fecha_registro": "2025-10-23T15:30:00.000Z"
  }
}
```

**Errores Comunes:**

- `400` - Datos inválidos o correo/ID ya registrado
- `500` - Error interno del servidor

---

### `GET /api/usuarios`

Lista todos los usuarios registrados.

**Autenticación:** No requerida

**Respuesta (200):**

```json
[
  {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@unisabana.edu.co",
    "telefono": "3001234567",
    "fecha_registro": "2025-10-23T15:30:00.000Z"
  }
]
```

---

##  Endpoints de Autenticación

### `POST /api/auth/login`

Inicia sesión y obtiene un token JWT.

**Autenticación:** No requerida

**Content-Type:** `application/json`

**Body:**

```json
{
  "correo": "juan.perez@unisabana.edu.co",
  "contrasena": "miPassword123"
}
```

**Ejemplo JavaScript:**

```javascript
const response = await fetch('https://bewheels.onrender.com/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    correo: 'juan.perez@unisabana.edu.co',
    contrasena: 'miPassword123'
  })
});

const data = await response.json();
// Guardar el token en localStorage o sessionStorage
localStorage.setItem('token', data.token);
```

**Respuesta Exitosa (200):**

```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@unisabana.edu.co",
    "telefono": "3001234567",
    "foto_perfil": "/uploads/foto_perfil-123456.jpg"
  }
}
```

**Errores:**

- `400` - Credenciales inválidas

---

### `GET /api/auth/verificar-token`

Verifica si el token es válido y devuelve información del usuario.

**Autenticación:**  Requerida

**Headers:**

```
Authorization: Bearer <token>
```

**Respuesta (200):**

```json
{
  "valido": true,
  "usuario": {
    "id_usuario": 1,
    "nombre": "Juan Pérez",
    "correo": "juan.perez@unisabana.edu.co",
    "telefono": "3001234567",
    "foto_perfil": "/uploads/foto_perfil-123456.jpg"
  }
}
```

**Errores:**

- `401` - Token inválido o expirado

---

### `POST /api/auth/logout`

Cierra la sesión (el token debe ser eliminado en el cliente).

**Autenticación:** No requerida

**Respuesta (200):**

```json
{
  "message": "Sesión cerrada exitosamente (token invalidado en cliente)"
}
```

---

##  Endpoints de Vehículos

**Nota:** Todos los endpoints de vehículos requieren autenticación.

### `POST /api/vehiculos/registro`

Registra un nuevo vehículo para el usuario autenticado.

**Autenticación:**  Requerida

**Content-Type:** `multipart/form-data`

**Body (FormData):**

| Campo | Tipo | Requerido | Descripción | Validación |
|-------|------|-----------|-------------|------------|
| `placa` | string | ✅ | Placa del vehículo | Min 6, Max 10 caracteres |
| `marca` | string | ✅ | Marca del vehículo | Min 2, Max 50 caracteres |
| `modelo` | string | ✅ | Modelo del vehículo | Min 2, Max 50 caracteres |
| `capacidad` | number | ✅ | Capacidad de pasajeros | Min 1, Max 20 |
| `foto` | file | ❌ | Foto del vehículo | Imagen (JPG/PNG/GIF), Max 2MB |

**Ejemplo:**

```javascript
const formData = new FormData();
formData.append('placa', 'ABC123');
formData.append('marca', 'Toyota');
formData.append('modelo', 'Corolla');
formData.append('capacidad', '4');
formData.append('foto', fileInput.files[0]);

const response = await fetch('https://bewheels.onrender.com/api/vehiculos/registro', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
});
```

**Respuesta (201):**

```json
{
  "message": "Vehículo registrado con éxito",
  "vehiculo": {
    "id_vehiculo": 1,
    "placa": "ABC123",
    "marca": "Toyota",
    "modelo": "Corolla",
    "capacidad": 4,
    "foto": "/uploads/vehiculo-123456.jpg"
  }
}
```

---

### `GET /api/vehiculos`

Lista todos los vehículos del usuario autenticado.

**Autenticación:**  Requerida

**Respuesta (200):**

```json
[
  {
    "id_vehiculo": 1,
    "placa": "ABC123",
    "marca": "Toyota",
    "modelo": "Corolla",
    "capacidad": 4,
    "foto": "/uploads/vehiculo-123456.jpg"
  }
]
```

---

### `GET /api/vehiculos/:id`

Obtiene información de un vehículo específico.

**Autenticación:**  Requerida

**Parámetros URL:**
- `id` - ID del vehículo

**Respuesta (200):**

```json
{
  "id_vehiculo": 1,
  "placa": "ABC123",
  "marca": "Toyota",
  "modelo": "Corolla",
  "capacidad": 4,
  "foto": "/uploads/vehiculo-123456.jpg"
}
```

---

### `PUT /api/vehiculos/:id`

Actualiza información de un vehículo.

**Autenticación:**  Requerida

**Content-Type:** `multipart/form-data`

**Body:** Mismos campos que en registro (todos opcionales)

**Respuesta (200):**

```json
{
  "message": "Vehículo actualizado con éxito",
  "vehiculo": { /* ... */ }
}
```

---

### `DELETE /api/vehiculos/:id`

Elimina un vehículo.

**Autenticación:**  Requerida

**Respuesta (200):**

```json
{
  "message": "Vehículo eliminado con éxito"
}
```

---

##  Endpoints de Viajes

**Nota:** Todos los endpoints de viajes requieren autenticación.

### `POST /api/viajes`

Crea un nuevo viaje.

**Autenticación:**  Requerida

**Content-Type:** `application/json`

**Body:**

| Campo | Tipo | Requerido | Descripción | Validación |
|-------|------|-----------|-------------|------------|
| `origen` | string | ✅ | Punto de origen | Min 2, Max 100 caracteres |
| `destino` | string | ✅ | Punto de destino | Min 2, Max 100 caracteres |
| `fecha_salida` | string | ✅ | Fecha y hora de salida | ISO 8601, debe ser futura |
| `cupos_totales` | number | ✅ | Cupos disponibles | Min 1, Max 6 |
| `tarifa` | number | ✅ | Tarifa por pasajero | Min 1000 (pesos) |
| `id_vehiculo` | number | ✅ | ID del vehículo a usar | Debe existir |

**Ejemplo:**

```javascript
const response = await fetch('https://bewheels.onrender.com/api/viajes', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    origen: 'Universidad de La Sabana',
    destino: 'Centro Chía',
    fecha_salida: '2025-10-24T08:00:00Z',
    cupos_totales: 3,
    tarifa: 5000,
    id_vehiculo: 1
  })
});
```

**Respuesta (201):**

```json
{
  "message": "Viaje creado con éxito",
  "viaje": {
    "id_viaje": 1,
    "origen": "Universidad de La Sabana",
    "destino": "Centro Chía",
    "fecha_salida": "2025-10-24T08:00:00.000Z",
    "cupos_totales": 3,
    "cupos_disponibles": 3,
    "tarifa": 5000,
    "estado": "disponible",
    "id_conductor": 1,
    "id_vehiculo": 1
  }
}
```

---

### `GET /api/viajes/disponibles`

Lista viajes disponibles con filtros opcionales.

**Autenticación:**  Requerida

**Query Parameters (opcionales):**
- `origen` - Filtrar por origen
- `destino` - Filtrar por destino
- `fecha` - Filtrar por fecha (YYYY-MM-DD)

**Ejemplo:**

```javascript
const response = await fetch(
  'https://bewheels.onrender.com/api/viajes/disponibles?origen=Universidad&destino=Centro',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
```

**Respuesta (200):**

```json
[
  {
    "id_viaje": 1,
    "origen": "Universidad de La Sabana",
    "destino": "Centro Chía",
    "fecha_salida": "2025-10-24T08:00:00.000Z",
    "cupos_disponibles": 3,
    "tarifa": 5000,
    "conductor": {
      "nombre": "Juan Pérez",
      "telefono": "3001234567"
    },
    "vehiculo": {
      "placa": "ABC123",
      "marca": "Toyota",
      "modelo": "Corolla"
    }
  }
]
```

---

### `GET /api/viajes/mis-viajes`

Lista los viajes creados por el usuario autenticado (como conductor).

**Autenticación:**  Requerida

**Respuesta (200):**

```json
[
  {
    "id_viaje": 1,
    "origen": "Universidad de La Sabana",
    "destino": "Centro Chía",
    "fecha_salida": "2025-10-24T08:00:00.000Z",
    "cupos_totales": 3,
    "cupos_disponibles": 2,
    "tarifa": 5000,
    "estado": "disponible"
  }
]
```

---

### `GET /api/viajes/:id`

Obtiene detalles de un viaje específico.

**Autenticación:**  Requerida

**Respuesta (200):**

```json
{
  "id_viaje": 1,
  "origen": "Universidad de La Sabana",
  "destino": "Centro Chía",
  "fecha_salida": "2025-10-24T08:00:00.000Z",
  "cupos_totales": 3,
  "cupos_disponibles": 2,
  "tarifa": 5000,
  "estado": "disponible",
  "conductor": { /* ... */ },
  "vehiculo": { /* ... */ }
}
```

---

### `PUT /api/viajes/:id`

Actualiza un viaje (solo el conductor puede actualizar).

**Autenticación:**  Requerida

**Body:** Mismos campos que en creación (todos opcionales)

**Respuesta (200):**

```json
{
  "message": "Viaje actualizado con éxito",
  "viaje": { /* ... */ }
}
```

---

### `DELETE /api/viajes/:id`

Cancela un viaje.

**Autenticación:**  Requerida

**Respuesta (200):**

```json
{
  "message": "Viaje cancelado con éxito"
}
```

---

## 👥 Endpoints de Roles

### `GET /api/roles/usuario/:id`

Obtiene los roles de un usuario específico.

**Autenticación:**  Requerida

**Respuesta (200):**

```json
[
  {
    "id_rol": 1,
    "nombre_rol": "conductor"
  },
  {
    "id_rol": 2,
    "nombre_rol": "pasajero"
  }
]
```

---

##  Manejo de Imágenes

### Subida de Imágenes

- Las imágenes se suben usando `multipart/form-data`
- Formatos aceptados: JPG, PNG, GIF
- Tamaño máximo: 2MB
- Campo de formulario: `foto_perfil` (usuarios) o `foto` (vehículos)

### Visualización de Imágenes

Las imágenes se sirven desde el endpoint `/uploads/`:

**Desarrollo:**
```javascript
const imageUrl = `http://localhost:5000${usuario.foto_perfil}`;
// Ejemplo: http://localhost:5000/uploads/foto_perfil-123456.jpg
```

**Producción:**
```javascript
const imageUrl = `https://bewheels.onrender.com${usuario.foto_perfil}`;
// Ejemplo: https://bewheels.onrender.com/uploads/foto_perfil-123456.jpg
```

**Componente React:**

```jsx
function Avatar({ usuario }) {
  const baseURL = process.env.REACT_APP_API_URL || 'https://bewheels.onrender.com';
  const imageUrl = usuario.foto_perfil 
    ? `${baseURL}${usuario.foto_perfil}` 
    : '/default-avatar.png';
  
  return <img src={imageUrl} alt={usuario.nombre} />;
}
```

---

##  Códigos de Estado HTTP

| Código | Significado | Cuándo se usa |
|--------|-------------|---------------|
| `200` | OK | Operación exitosa (GET, PUT, DELETE) |
| `201` | Created | Recurso creado exitosamente (POST) |
| `400` | Bad Request | Datos inválidos o faltantes |
| `401` | Unauthorized | Token inválido, expirado o ausente |
| `404` | Not Found | Recurso no encontrado |
| `500` | Internal Server Error | Error en el servidor |

---

##  Ejemplos de Integración

### React + Axios

```javascript
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://bewheels.onrender.com'
});

// Interceptor para agregar token automáticamente
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Registro de usuario
export const registrarUsuario = async (formData) => {
  const response = await API.post('/api/usuarios/register', formData);
  return response.data;
};

// Login
export const login = async (correo, contrasena) => {
  const response = await API.post('/api/auth/login', { correo, contrasena });
  localStorage.setItem('token', response.data.token);
  return response.data;
};

// Crear viaje
export const crearViaje = async (datosViaje) => {
  const response = await API.post('/api/viajes', datosViaje);
  return response.data;
};

// Listar viajes disponibles
export const obtenerViajesDisponibles = async (filtros = {}) => {
  const params = new URLSearchParams(filtros);
  const response = await API.get(`/api/viajes/disponibles?${params}`);
  return response.data;
};
```

### React + Fetch

```javascript
const API_URL = 'https://bewheels.onrender.com';

// Función helper para fetch con autenticación
async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...options.headers
  };
  
  if (token && !options.body instanceof FormData) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  if (token && options.body instanceof FormData) {
    headers['Authorization'] = `Bearer ${token}`;
  } else if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en la petición');
  }
  
  return response.json();
}

// Uso
const usuario = await fetchAPI('/api/usuarios/register', {
  method: 'POST',
  body: formData // FormData
});

const viajes = await fetchAPI('/api/viajes/disponibles');
```

### Variables de Entorno Frontend

Crea un archivo `.env` en tu proyecto frontend:

```env
# Desarrollo
REACT_APP_API_URL=http://localhost:5000

# Producción
# REACT_APP_API_URL=https://bewheels.onrender.com
```

Uso en el código:

```javascript
const API_URL = process.env.REACT_APP_API_URL || 'https://bewheels.onrender.com';
```

---

##  Consideraciones de Seguridad

1. **Tokens JWT:** Expiran en 24 horas. Implementa refresh de tokens o re-login.
2. **CORS:** El backend está configurado para aceptar peticiones de cualquier origen en desarrollo. Configura dominios específicos en producción.
3. **Contraseñas:** Se hashean automáticamente con bcrypt antes de guardarse.
4. **Validación:** Todos los datos se validan en el backend usando Joi.

---

##  Notas Adicionales

- **Base de datos:** PostgreSQL con SSL habilitado para producción
- **Imágenes:** Se almacenan en el servidor, solo la ruta se guarda en BD
- **Tiempo de respuesta:** El servidor en Render puede tardar ~30 segundos en despertar si está inactivo
- **Logs:** Todos los errores se registran en consola del servidor

---

##  Solución de Problemas

### Error: "Token inválido o expirado"
- Verifica que el token se envíe correctamente en el header
- El token expira en 24h, solicita un nuevo login

### Error: "CORS policy"
- Asegúrate de usar las URLs correctas (http en local, https en producción)
- El backend ya tiene CORS habilitado

### Error: "El archivo excede el tamaño máximo"
- Las imágenes deben ser menores a 2MB
- Comprime las imágenes antes de subirlas

### Imágenes no se muestran
- Verifica que la URL incluya el dominio completo del backend
- Ejemplo correcto: `https://bewheels.onrender.com/uploads/foto.jpg`

---




