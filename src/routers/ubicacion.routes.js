import express from 'express';
import { UbicacionController } from '../controllers/ubicacion.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', UbicacionController.listarUbicaciones);

router.post('/', authenticateToken, UbicacionController.crearUbicacion);

router.post('/buscar-o-crear', authenticateToken, UbicacionController.buscarOCrearUbicacion);

export default router;