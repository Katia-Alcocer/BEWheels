import { UbicacionService } from '../services/ubicacion.service.js';

export const UbicacionController = {
  async listarUbicaciones(req, res) {
    try {
      const ubicaciones = await UbicacionService.listarUbicaciones();
      return res.json(ubicaciones);
    } catch (err) {
      console.error(' Error al listar ubicaciones:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  async crearUbicacion(req, res) {
    try {
      const { nombre } = req.body;
      
      if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la ubicación es obligatorio' });
      }

      const nuevaUbicacion = await UbicacionService.crearUbicacion(nombre);
      return res.status(201).json({
        message: 'Ubicación creada con éxito',
        ubicacion: nuevaUbicacion
      });
    } catch (err) {
      console.error(' Error al crear ubicación:', err);
      const statusCode = err.message.includes('ya existe') ? 409 : 400;
      return res.status(statusCode).json({ error: err.message });
    }
  },

  async buscarOCrearUbicacion(req, res) {
    try {
      const { nombre } = req.body;
      
      if (!nombre) {
        return res.status(400).json({ error: 'El nombre de la ubicación es obligatorio' });
      }

      const ubicacion = await UbicacionService.buscarOCrearUbicacion(nombre);
      return res.json({
        message: 'Ubicación obtenida/creada con éxito',
        ubicacion: ubicacion
      });
    } catch (err) {
      console.error(' Error al buscar/crear ubicación:', err);
      return res.status(400).json({ error: err.message });
    }
  }
};