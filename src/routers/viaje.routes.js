import express from 'express';
import { ViajeController } from '../controllers/viaje.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(authenticateToken);


router.post('/', ViajeController.crearViaje);


router.get('/', ViajeController.listarViajesDisponibles);


router.get('/mis-viajes', ViajeController.listarMisViajes);


router.get('/verificar-activo', ViajeController.verificarViajeActivo);


router.get('/:id', ViajeController.obtenerViaje);


router.put('/:id', ViajeController.actualizarViaje);


router.put('/:id/completar', ViajeController.completarViaje);


router.put('/actualizar-vencidos', ViajeController.actualizarViajesVencidos);


router.delete('/:id', ViajeController.cancelarViaje);

export default router;
