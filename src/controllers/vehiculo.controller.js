import { VehiculoService } from '../services/vehiculo.service.js';
import { vehiculoSchema } from '../validations/vehiculo.validation.js';

export const VehiculoController = {
  async registrarVehiculo(req, res) {
    try {
      const { error, value } = vehiculoSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: error.details[0].message || 'Datos inválidos'
        });
      }

      // Agregar el ID del usuario autenticado
      const datosVehiculo = {
        ...value,
        id_usuario: req.user.id_usuario
      };

      // Si hay archivo de foto, agregar la ruta
      if (req.file) {
        datosVehiculo.foto = `/uploads/${req.file.filename}`;
      }

      const nuevoVehiculo = await VehiculoService.registrarVehiculo(datosVehiculo);
      
      return res.status(201).json({
        message: 'Vehículo registrado con éxito',
        vehiculo: nuevoVehiculo
      });
    } catch (err) {
      console.error('Error en registrarVehiculo:', err);
      return res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  },

  async listarVehiculosUsuario(req, res) {
    try {
      const vehiculos = await VehiculoService.listarVehiculosPorUsuario(req.user.id_usuario);
      return res.json(vehiculos);
    } catch (err) {
      console.error('Error en listarVehiculosUsuario:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async obtenerVehiculo(req, res) {
    try {
      const { id } = req.params;
      const vehiculo = await VehiculoService.obtenerVehiculo(id);
      if (!vehiculo) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }
      return res.json(vehiculo);
    } catch (err) {
      console.error('Error en obtenerVehiculo:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async actualizarVehiculo(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = vehiculoSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: error.details[0].message || 'Datos inválidos'
        });
      }

      // Si hay archivo de foto, agregar la ruta
      if (req.file) {
        value.foto = `/uploads/${req.file.filename}`;
      }

      const vehiculoActualizado = await VehiculoService.actualizarVehiculo(id, value);
      if (!vehiculoActualizado) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }

      return res.json({
        message: 'Vehículo actualizado con éxito',
        vehiculo: vehiculoActualizado
      });
    } catch (err) {
      console.error('Error en actualizarVehiculo:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async eliminarVehiculo(req, res) {
    try {
      const { id } = req.params;
      const eliminado = await VehiculoService.eliminarVehiculo(id);
      if (!eliminado) {
        return res.status(404).json({ error: 'Vehículo no encontrado' });
      }

      return res.json({ message: 'Vehículo eliminado con éxito' });
    } catch (err) {
      console.error('Error en eliminarVehiculo:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};
