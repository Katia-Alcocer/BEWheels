import express from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { upload } from '../config/multer.config.js';

const router = express.Router();


router.post(
  '/register',
  upload.single('foto_perfil'), 
  UsuarioController.registrarUsuario
);

router.get('/', UsuarioController.listarUsuarios);

export default router;



