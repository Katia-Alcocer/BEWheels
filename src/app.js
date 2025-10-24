import cors from 'cors';
import express from 'express';
import usuarioRoutes from './routers/usuario.routes.js';
import authRoutes from './routers/auth.routes.js';
import vehiculoRoutes from './routers/vehiculo.routes.js';
import viajeRoutes from './routers/viaje.routes.js';
import rolRoutes from './routers/rol.routes.js';
import { pool } from './config/db.config.js';



const app = express();


app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/auth', authRoutes); // Authentication routes - Updated for deployment
app.use('/api/vehiculos', vehiculoRoutes);
app.use('/api/viajes', viajeRoutes);
app.use('/api/roles', rolRoutes);


app.use(express.static('public'));

app.use('/uploads', express.static('uploads'));

// Ruta raíz - Página de bienvenida del API
app.get('/', (req, res) => {
  res.json({
    message: '🚗 Wheels API - Sistema de Carpooling Universitario',
    version: '1.0.0',
    status: '✅ Servidor funcionando correctamente',
    endpoints: {
      auth: '/api/auth',
      usuarios: '/api/usuarios',
      vehiculos: '/api/vehiculos',
      viajes: '/api/viajes',
      roles: '/api/roles'
    },
    documentation: 'https://github.com/Katia-Alcocer/BEWheels',
    timestamp: new Date().toISOString()
  });
});

app.get('/test-db', async (req, res) => {
	try {
		const result = await pool.query('SELECT NOW()');
		res.json(result.rows);
	} catch (err) {
		console.error('Error en /test-db:', err);
		res.status(500).json({ error: 'Error al consultar la base de datos', details: err.message });
	}
});


app.use((err, req, res, next) => {
	console.error('Error capturado por handler global:', err);
	if (err && err.code === 'LIMIT_FILE_SIZE') {
		return res.status(400).json({ error: 'El archivo excede el tamaño máximo permitido (2MB).' });
	}
	if (err && err.message === 'Solo se permiten imágenes') {
		return res.status(400).json({ error: err.message });
	}
	return res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

export default app;
