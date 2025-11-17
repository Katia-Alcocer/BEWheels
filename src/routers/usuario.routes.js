import express from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { upload } from '../config/multer.config.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router = express.Router();


router.post(
  '/register',
  upload.single('foto_perfil'), 
  UsuarioController.registrarUsuario
);

router.get('/', UsuarioController.listarUsuarios);

router.get('/mi-perfil', authenticateToken, UsuarioController.obtenerMiPerfil);
router.put(
  '/mi-perfil',
  authenticateToken,
  upload.single('foto_perfil'),
  UsuarioController.actualizarMiPerfil
);

export default router;



