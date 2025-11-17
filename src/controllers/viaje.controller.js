import { ViajeService } from '../services/viaje.service.js';
import { viajeSchema } from '../validations/viaje.validation.js';

export const ViajeController = {
  async crearViaje(req, res) {
    try {
      const { error, value } = viajeSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: error.details[0].message || 'Datos inválidos'
        });
      }

      const datosViaje = {
        ...value,
        id_conductor: req.user.id_usuario
      };

      const nuevoViaje = await ViajeService.crearViaje(datosViaje);
      
      return res.status(201).json({
        message: 'Viaje creado con éxito',
        viaje: nuevoViaje
      });
    } catch (err) {
      console.error('Error en crearViaje:', err);
      return res.status(500).json({ error: err.message || 'Error interno del servidor' });
    }
  },

  async listarViajesDisponibles(req, res) {
    try {
      const { origen, destino, fecha } = req.query;
      const filtros = { origen, destino, fecha };
      const id_usuario_actual = req.user?.id_usuario;
      
      const viajes = await ViajeService.listarViajesDisponibles(filtros, id_usuario_actual);
      return res.json(viajes);
    } catch (err) {
      console.error('Error en listarViajesDisponibles:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async listarMisViajes(req, res) {
    try {
      const viajes = await ViajeService.listarViajesPorConductor(req.user.id_usuario);
      return res.json(viajes);
    } catch (err) {
      console.error('Error en listarMisViajes:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async obtenerViaje(req, res) {
    try {
      const { id } = req.params;
      const viaje = await ViajeService.obtenerViaje(id);
      if (!viaje) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
      }
      return res.json(viaje);
    } catch (err) {
      console.error('Error en obtenerViaje:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async actualizarViaje(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = viajeSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error: error.details[0].message || 'Datos inválidos'
        });
      }

      const viajeActualizado = await ViajeService.actualizarViaje(id, value);
      if (!viajeActualizado) {
        return res.status(404).json({ error: 'Viaje no encontrado' });
      }

      return res.json({
        message: 'Viaje actualizado con éxito',
        viaje: viajeActualizado
      });
    } catch (err) {
      console.error('Error en actualizarViaje:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async cancelarViaje(req, res) {
    try {
      const { id } = req.params;
      const id_conductor = req.user?.id_usuario;
      
      if (!id_conductor) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const viajeCancelado = await ViajeService.cancelarViaje(parseInt(id), id_conductor);
      
      return res.json({ 
        message: 'Viaje cancelado con éxito',
        viaje: viajeCancelado
      });
    } catch (err) {
      console.error('Error en cancelarViaje:', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async verificarViajeActivo(req, res) {
    try {
      const id_conductor = req.user?.id_usuario;
      if (!id_conductor) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const viajeActivo = await ViajeService.verificarViajeActivo(id_conductor);

      return res.json({
        tieneViajeActivo: !!viajeActivo,
        viajeActivo: viajeActivo || null
      });
    } catch (err) {
      console.error('Error en verificarViajeActivo:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async completarViaje(req, res) {
    try {
      const { id } = req.params;
      const id_conductor = req.user?.id_usuario;
      
      if (!id_conductor) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const viajeCompletado = await ViajeService.completarViaje(parseInt(id), id_conductor);
      
      return res.json({ 
        message: 'Viaje completado con éxito',
        viaje: viajeCompletado
      });
    } catch (err) {
      console.error('Error en completarViaje:', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async actualizarViajesVencidos(req, res) {
    try {
      const viajesActualizados = await ViajeService.actualizarViajesVencidos();
      
      return res.json({ 
        message: `${viajesActualizados.length} viajes actualizados`,
        viajes: viajesActualizados
      });
    } catch (err) {
      console.error('Error en actualizarViajesVencidos:', err);
      return res.status(500).json({ error: err.message });
    }
  }
};
