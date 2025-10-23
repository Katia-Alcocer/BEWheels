# BEWheels

Backend para el proyecto BEWheels.

## Requisitos
- Node.js 18+ (o la versión que uses en tu entorno)
- PostgreSQL (DB en la nube o local) y la variable de entorno `DATABASE_URL` configurada

# BEWheels

Backend para el proyecto BEWheels.

## Requisitos
- Node.js 18+ (o la versión que uses en tu entorno)
- PostgreSQL (DB en la nube o local) y la variable de entorno `DATABASE_URL` configurada

## Variables de entorno
Crear un archivo `.env` en la raíz del proyecto con, como mínimo, estas variables:

```
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/dbname
```

Si usas un proveedor que requiere SSL (por ejemplo Render), `src/config/db.config.js` ya configura `ssl: { rejectUnauthorized: false }` para facilitar la conexión en desarrollo.

## Ejecutar en desarrollo
- Usando node directamente:

```
node src/server.js
```

- Usando el script con nodemon (si no puedes ejecutar `npm run dev` en PowerShell por la política de ejecución, usa PowerShell como administrador o ejecuta Node directamente):

```
npm run dev
```

## Probar la conexión a la base de datos
He añadido un endpoint de prueba disponible en la app que arranca con `src/server.js`:

- GET /test-db -> ejecuta `SELECT NOW()` y devuelve la hora del servidor de la base de datos.

Ejemplo usando curl (PowerShell):

```
curl http://localhost:5000/test-db
```

## Endpoints principales (API)

- POST /api/usuarios/register
	- Descripción: registra un nuevo usuario.
	- Tipo de contenido: multipart/form-data
	- Campos esperados:
		- nombre (string)
		- id_universitario (string)
		- correo (string)
		- telefono (string)
		- contrasena (string)
		- foto_perfil (file) — campo de tipo file para subir una imagen (opcional)

		- Restricciones para `foto_perfil`:
			- Solo se aceptan imágenes (jpg, png, gif, etc.).
			- Tamaño máximo: 2 MB.

	- Ejemplo curl (subir imagen):

```
curl -X POST http://localhost:5000/api/usuarios/register -F "nombre=Prueba" -F "id_universitario=U12345" -F "correo=prueba@example.com" -F "telefono=3001234567" -F "contrasena=secreta123" -F "foto_perfil=@C:/ruta/a/imagen.jpg"
```

- GET /api/usuarios
	- Descripción: devuelve un array con los usuarios (id_usuario, nombre, correo, telefono, fecha_registro, foto_perfil).

## Páginas de prueba (estáticas)

- `http://localhost:5000/register.html` — formulario para registrar usuario y subir imagen.
- `http://localhost:5000/list.html` — vista simple que lista los usuarios y muestra miniaturas si tienen `foto_perfil`.

## Notas
- Revisa `src/app.js`, `src/server.js` y `src/config/db.config.js` si quieres cambiar el comportamiento de la conexión.
- Considera consolidar el punto de entrada (usar solo `src/server.js`) para evitar rutas duplicadas entre `src/index.js` y `src/server.js`.

Si quieres, puedo añadir instrucciones específicas para desplegar en Render o cómo manejar certificados SSL en producción.


