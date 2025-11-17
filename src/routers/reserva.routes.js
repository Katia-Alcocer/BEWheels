import express from 'express';
import { ReservaController } from '../controllers/reserva.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();


router.post('/', authenticateToken, ReservaController.crearReserva);

router.get('/mis-reservas', authenticateToken, ReservaController.listarMisReservas);

router.get('/solicitudes-conductor', authenticateToken, ReservaController.listarSolicitudesConductor);

router.put('/:id_reserva/aceptar', authenticateToken, ReservaController.aceptarReserva);

router.put('/:id_reserva/rechazar', authenticateToken, ReservaController.rechazarReserva);

router.put('/:id_reserva/cancelar', authenticateToken, ReservaController.cancelarReserva);

router.delete('/:id_reserva', authenticateToken, ReservaController.eliminarReserva);

router.get('/viaje/:id_viaje', authenticateToken, ReservaController.listarReservasDelViaje);

export default router;