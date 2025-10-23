import express from 'express';
import { RolController } from '../controllers/rol.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/usuario/:id', authenticateToken, RolController.getRolesByUserId);

export default router;
