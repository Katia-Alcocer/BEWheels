import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/login', AuthController.login);
router.get('/verificar-token', authenticateToken, AuthController.verificarToken);
router.post('/logout', AuthController.logout);

export default router;
