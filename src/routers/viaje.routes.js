import express from 'express';
import { ViajeController } from '../controllers/viaje.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// POST /api/viajes
router.post('/', ViajeController.crearViaje);

// GET /api/viajes - Lista viajes disponibles (sin /disponibles)
router.get('/', ViajeController.listarViajesDisponibles);

// GET /api/viajes/mis-viajes
router.get('/mis-viajes', ViajeController.listarMisViajes);

// GET /api/viajes/verificar-activo
router.get('/verificar-activo', ViajeController.verificarViajeActivo);

// GET /api/viajes/:id
router.get('/:id', ViajeController.obtenerViaje);

// PUT /api/viajes/:id
router.put('/:id', ViajeController.actualizarViaje);

// PUT /api/viajes/:id/completar
router.put('/:id/completar', ViajeController.completarViaje);

// PUT /api/viajes/actualizar-vencidos
router.put('/actualizar-vencidos', ViajeController.actualizarViajesVencidos);

// DELETE /api/viajes/:id
router.delete('/:id', ViajeController.cancelarViaje);

export default router;
