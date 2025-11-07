import express from 'express';
import { ReservaController } from '../controllers/reserva.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Crear nueva reserva
router.post('/', authenticateToken, ReservaController.crearReserva);

// Listar mis reservas (pasajero)
router.get('/mis-reservas', authenticateToken, ReservaController.listarMisReservas);

// Listar solicitudes para conductor
router.get('/solicitudes-conductor', authenticateToken, ReservaController.listarSolicitudesConductor);

// Aceptar reserva (conductor)
router.put('/:id_reserva/aceptar', authenticateToken, ReservaController.aceptarReserva);

// Rechazar reserva (conductor)
router.put('/:id_reserva/rechazar', authenticateToken, ReservaController.rechazarReserva);

// Cancelar reserva (pasajero)
router.put('/:id_reserva/cancelar', authenticateToken, ReservaController.cancelarReserva);

// Listar reservas de un viaje específico (conductor)
router.get('/viaje/:id_viaje', authenticateToken, ReservaController.listarReservasDelViaje);

export default router;