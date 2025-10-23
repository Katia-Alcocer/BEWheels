import express from 'express';
import { VehiculoController } from '../controllers/vehiculo.controller.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { upload } from '../config/multer.config.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(authenticateToken);

// POST /api/vehiculos/registro
router.post(
  '/registro',
  upload.single('foto'),
  VehiculoController.registrarVehiculo
);

// GET /api/vehiculos
router.get('/', VehiculoController.listarVehiculosUsuario);

// GET /api/vehiculos/:id
router.get('/:id', VehiculoController.obtenerVehiculo);

// PUT /api/vehiculos/:id
router.put(
  '/:id',
  upload.single('foto'),
  VehiculoController.actualizarVehiculo
);

// DELETE /api/vehiculos/:id
router.delete('/:id', VehiculoController.eliminarVehiculo);

export default router;
