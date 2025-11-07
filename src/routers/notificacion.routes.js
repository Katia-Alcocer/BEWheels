import express from 'express';
import { NotificacionController } from '../controllers/notificacion.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Listar notificaciones del usuario
router.get('/', authenticateToken, NotificacionController.listarNotificaciones);

// Contar notificaciones no leídas
router.get('/no-leidas/count', authenticateToken, NotificacionController.contarNoLeidas);

// Marcar notificación específica como leída
router.put('/:id_notificacion/leida', authenticateToken, NotificacionController.marcarComoLeida);

// Marcar todas las notificaciones como leídas
router.put('/todas/leidas', authenticateToken, NotificacionController.marcarTodasComoLeidas);

export default router;