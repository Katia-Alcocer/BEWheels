import express from 'express';
import { ViajeController } from '../controllers/viaje.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// POST /api/viajes
router.post('/', ViajeController.crearViaje);

// GET /api/viajes/disponibles
router.get('/disponibles', ViajeController.listarViajesDisponibles);

// GET /api/viajes/mis-viajes
router.get('/mis-viajes', ViajeController.listarMisViajes);

// GET /api/viajes/viaje-activo
router.get('/viaje-activo', ViajeController.verificarViajeActivo);

// GET /api/viajes/:id
router.get('/:id', ViajeController.obtenerViaje);

// PUT /api/viajes/:id
router.put('/:id', ViajeController.actualizarViaje);

// PUT /api/viajes/:id/completar
router.put('/:id/completar', ViajeController.completarViaje);

// DELETE /api/viajes/:id
router.delete('/:id', ViajeController.cancelarViaje);

export default router;
