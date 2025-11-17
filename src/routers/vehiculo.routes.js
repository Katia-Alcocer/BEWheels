import express from 'express';
import { VehiculoController } from '../controllers/vehiculo.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { upload } from '../config/multer.config.js';

const router = express.Router();

router.use(authenticateToken);

router.post(
  '/registro',
  upload.single('foto'),
  VehiculoController.registrarVehiculo
);

router.get('/', VehiculoController.listarVehiculosUsuario);

router.get('/:id', VehiculoController.obtenerVehiculo);

router.put(
  '/:id',
  upload.single('foto'),
  VehiculoController.actualizarVehiculo
);

router.delete('/:id', VehiculoController.eliminarVehiculo);

export default router;
