import { ReservaService } from '../services/reserva.service.js';

export const ReservaController = {
  async crearReserva(req, res) {
    try {
      const id_pasajero = req.user?.id_usuario;
      if (!id_pasajero) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const { id_viaje, cupos_reservados, punto_recogida, punto_destino } = req.body;

      if (!id_viaje || !cupos_reservados || !punto_recogida) {
        return res.status(400).json({ error: 'Datos incompletos: id_viaje, cupos_reservados y punto_recogida son obligatorios' });
      }

      const nuevaReserva = await ReservaService.crearReserva({
        id_viaje: parseInt(id_viaje),
        id_pasajero,
        cupos_reservados: parseInt(cupos_reservados),
        punto_recogida,
        punto_destino: punto_destino || null
      });

      return res.status(201).json({
        message: 'Reserva creada con éxito',
        reserva: nuevaReserva
      });
    } catch (err) {
      console.error('❌ Error al crear reserva:', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async aceptarReserva(req, res) {
    try {
      const id_conductor = req.user?.id_usuario;
      if (!id_conductor) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const { id_reserva } = req.params;

      const reservaActualizada = await ReservaService.aceptarReserva(parseInt(id_reserva), id_conductor);

      return res.json({
        message: 'Reserva aceptada con éxito',
        reserva: reservaActualizada
      });
    } catch (err) {
      console.error('❌ Error al aceptar reserva:', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async rechazarReserva(req, res) {
    try {
      const id_conductor = req.user?.id_usuario;
      if (!id_conductor) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const { id_reserva } = req.params;

      const reservaActualizada = await ReservaService.rechazarReserva(parseInt(id_reserva), id_conductor);

      return res.json({
        message: 'Reserva rechazada',
        reserva: reservaActualizada
      });
    } catch (err) {
      console.error('❌ Error al rechazar reserva:', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async cancelarReserva(req, res) {
    try {
      const id_pasajero = req.user?.id_usuario;
      if (!id_pasajero) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const { id_reserva } = req.params;

      const reservaActualizada = await ReservaService.cancelarReserva(parseInt(id_reserva), id_pasajero);

      return res.json({
        message: 'Reserva cancelada con éxito',
        reserva: reservaActualizada
      });
    } catch (err) {
      console.error('❌ Error al cancelar reserva:', err);
      return res.status(400).json({ error: err.message });
    }
  },

  async listarMisReservas(req, res) {
    try {
      const id_pasajero = req.user?.id_usuario;
      if (!id_pasajero) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const reservas = await ReservaService.listarReservasPorPasajero(id_pasajero);

      return res.json(reservas);
    } catch (err) {
      console.error('❌ Error al listar reservas:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  async listarReservasDelViaje(req, res) {
    try {
      const id_conductor = req.user?.id_usuario;
      if (!id_conductor) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const { id_viaje } = req.params;

      // Verificar que el viaje pertenezca al conductor
      // Esta verificación se podría hacer en el servicio también
      const reservas = await ReservaService.listarReservasPorViaje(parseInt(id_viaje));

      return res.json(reservas);
    } catch (err) {
      console.error('❌ Error al listar reservas del viaje:', err);
      return res.status(500).json({ error: err.message });
    }
  }
};