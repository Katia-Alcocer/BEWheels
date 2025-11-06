import cors from 'cors';
import express from 'express';
import usuarioRoutes from './routers/usuario.routes.js';
import authRoutes from './routers/auth.routes.js';
import vehiculoRoutes from './routers/vehiculo.routes.js';
import viajeRoutes from './routers/viaje.routes.js';
import rolRoutes from './routers/rol.routes.js';
import ubicacionRoutes from './routers/ubicacion.routes.js';
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
app.use('/api/ubicaciones', ubicacionRoutes);


app.use(express.static('public'));

app.use('/uploads', express.static('uploads'));

// Ruta raíz - Página de bienvenida del API
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Wheels API</title>
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
            }
            .container {
                background: rgba(255, 255, 255, 0.1);
                backdrop-filter: blur(10px);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.2);
                max-width: 600px;
                width: 90%;
            }
            .logo { font-size: 3rem; margin-bottom: 20px; }
            h1 { font-size: 2.5rem; margin-bottom: 10px; }
            .subtitle { font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
            .status {
                background: rgba(76, 175, 80, 0.2);
                border: 1px solid #4CAF50;
                border-radius: 10px;
                padding: 15px;
                margin: 20px 0;
                font-size: 1.1rem;
            }
            .features {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: left;
            }
            .feature {
                display: flex;
                align-items: center;
                padding: 12px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                font-size: 1.1rem;
            }
            .feature:last-child { border-bottom: none; }
            .feature span:first-child {
                font-size: 1.5rem;
                margin-right: 15px;
                width: 30px;
            }
            .footer {
                margin-top: 30px;
                opacity: 0.8;
                font-size: 0.9rem;
            }
            .timestamp {
                font-size: 0.8rem;
                opacity: 0.7;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">🚗</div>
            <h1>Wheels API</h1>
            <p class="subtitle">Sistema de Carpooling Universitario</p>
            
            <div class="status">
                ✅ Servidor funcionando correctamente
            </div>
            
            <div class="features">
                <h3 style="margin-bottom: 15px; text-align: center;">🚀 Características del Sistema</h3>
                <div class="feature">
                    <span>👥</span>
                    <span>Registro y autenticación de usuarios</span>
                </div>
                <div class="feature">
                    <span>🚗</span>
                    <span>Gestión de vehículos</span>
                </div>
                <div class="feature">
                    <span>🗺️</span>
                    <span>Creación y búsqueda de viajes</span>
                </div>
                <div class="feature">
                    <span>👤</span>
                    <span>Sistema de roles (Pasajero/Conductor)</span>
                </div>
                <div class="feature">
                    <span>📱</span>
                    <span>Interfaz web responsive</span>
                </div>
            </div>
            
            <div class="footer">
                <p><strong>Versión:</strong> 1.0.0</p>
                <p><strong>Documentación:</strong> <a href="https://github.com/Katia-Alcocer/BEWheels" style="color: #FFC107;">GitHub Repository</a></p>
                <div class="timestamp">
                    Última actualización: ${new Date().toLocaleString('es-CO')}
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
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

// Endpoint temporal para insertar ubicaciones iniciales
app.get('/init-ubicaciones', async (req, res) => {
	try {
		// Primero verificar si la tabla existe y crearla si no existe
		await pool.query(`
			CREATE TABLE IF NOT EXISTS Ubicaciones_Comunes (
				id_ubicacion SERIAL PRIMARY KEY,
				nombre VARCHAR(100) UNIQUE NOT NULL,
				activo BOOLEAN DEFAULT TRUE
			)
		`);

		const ubicaciones = [
			'Universidad de La Sabana',
			'Centro Comercial Unicentro',
			'Centro Comercial Santafé',
			'Terminal de Transportes',
			'Aeropuerto El Dorado',
			'Plaza de Bolívar',
			'Zona Rosa',
			'Centro Histórico',
			'Estación Transmilenio Portal Norte',
			'Estación Transmilenio Portal Sur',
			'Centro Comercial Andino',
			'Centro Comercial Hacienda Santa Bárbara',
			'Parque 93',
			'Universidad Nacional',
			'Universidad Javeriana',
			'Universidad de los Andes',
			'Hospital San Ignacio',
			'Clínica Colombia',
			'Biblioteca Luis Ángel Arango',
			'Museo del Oro',
			'Candelaria',
			'Chapinero',
			'Usaquén',
			'La Calera',
			'Chía',
			'Cajicá',
			'Zipaquirá',
			'Sopó',
			'Tocancipá',
			'Gachancipá',
			'Nemocón'
		];

		const insertPromises = ubicaciones.map(async (nombre) => {
			try {
				await pool.query(
					'INSERT INTO Ubicaciones_Comunes (nombre) VALUES ($1) ON CONFLICT (nombre) DO NOTHING',
					[nombre]
				);
			} catch (err) {
				console.error(`Error insertando ${nombre}:`, err);
			}
		});

		await Promise.all(insertPromises);

		const result = await pool.query('SELECT COUNT(*) as total FROM Ubicaciones_Comunes WHERE activo = true');
		res.json({ 
			message: 'Ubicaciones iniciales insertadas correctamente',
			total_ubicaciones: result.rows[0].total
		});
	} catch (err) {
		console.error('Error en /init-ubicaciones:', err);
		res.status(500).json({ error: 'Error al insertar ubicaciones', details: err.message });
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
