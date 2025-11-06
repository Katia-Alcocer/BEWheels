import express from 'express';
import { UbicacionController } from '../controllers/ubicacion.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Listar todas las ubicaciones (público)
router.get('/', UbicacionController.listarUbicaciones);

// Crear nueva ubicación (requiere autenticación)
router.post('/', authenticateToken, UbicacionController.crearUbicacion);

// Buscar o crear ubicación (requiere autenticación)
router.post('/buscar-o-crear', authenticateToken, UbicacionController.buscarOCrearUbicacion);

export default router;