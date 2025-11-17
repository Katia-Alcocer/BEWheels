import express from 'express';
import { NotificacionController } from '../controllers/notificacion.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();


router.get('/', authenticateToken, NotificacionController.listarNotificaciones);


router.get('/no-leidas', authenticateToken, NotificacionController.listarNotificacionesNoLeidas);


router.get('/no-leidas/count', authenticateToken, NotificacionController.contarNoLeidas);


router.put('/:id_notificacion/leida', authenticateToken, NotificacionController.marcarComoLeida);


router.put('/todas/leidas', authenticateToken, NotificacionController.marcarTodasComoLeidas);

export default router;