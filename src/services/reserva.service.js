import { ReservaRepository } from '../repositories/reserva.repository.js';
import { ViajeRepository } from '../repositories/viaje.repository.js';
import { NotificacionService } from './notificacion.service.js';

export const ReservaService = {
  async crearReserva(datosReserva) {
    const { id_viaje, id_pasajero, cupos_reservados, punto_recogida, punto_destino } = datosReserva;

    // Verificar que el viaje existe y está disponible
    const viaje = await ViajeRepository.obtenerViaje(id_viaje);
    if (!viaje) {
      throw new Error('El viaje no existe');
    }

    if (viaje.estado !== 'Activo') {
      throw new Error('El viaje no está disponible para reservas');
    }

    // Verificar que el pasajero no sea el conductor
    if (viaje.id_conductor === id_pasajero) {
      throw new Error('No puedes reservar en tu propio viaje');
    }

    // Verificar que no tenga una reserva existente
    const reservaExistente = await ReservaRepository.verificarReservaExistente(id_viaje, id_pasajero);
    if (reservaExistente) {
      throw new Error('Ya tienes una reserva para este viaje');
    }

    // Verificar cupos disponibles
    const cuposOcupados = await ReservaRepository.contarReservasAceptadas(id_viaje);
    const cuposDisponibles = viaje.cupos_totales - cuposOcupados;
    
    if (cupos_reservados > cuposDisponibles) {
      throw new Error(`Solo hay ${cuposDisponibles} cupos disponibles`);
    }

    // Crear la reserva
    const nuevaReserva = await ReservaRepository.crearReserva(datosReserva);

    // Enviar notificación al conductor
    await NotificacionService.enviarNotificacion({
      id_usuario: viaje.id_conductor,
      titulo: 'Nueva solicitud de reserva',
      mensaje: `${viaje.nombre_pasajero || 'Un pasajero'} ha solicitado ${cupos_reservados} cupo(s) en tu viaje de ${viaje.origen} a ${viaje.destino}`,
      tipo: 'reserva_nueva'
    });

    return nuevaReserva;
  },

  async aceptarReserva(id_reserva, id_conductor) {
    const reserva = await ReservaRepository.obtenerReserva(id_reserva);
    if (!reserva) {
      throw new Error('La reserva no existe');
    }

    // Verificar que sea el conductor del viaje
    const viaje = await ViajeRepository.obtenerViaje(reserva.id_viaje);
    if (viaje.id_conductor !== id_conductor) {
      throw new Error('No tienes autorización para gestionar esta reserva');
    }

    // Verificar disponibilidad nuevamente
    const cuposOcupados = await ReservaRepository.contarReservasAceptadas(reserva.id_viaje);
    const cuposDisponibles = viaje.cupos_totales - cuposOcupados;
    
    if (reserva.cupos_reservados > cuposDisponibles) {
      throw new Error('Ya no hay suficientes cupos disponibles');
    }

    // Aceptar la reserva
    const reservaActualizada = await ReservaRepository.actualizarEstadoReserva(id_reserva, 'Aceptada');

    // Actualizar cupos disponibles del viaje
    const nuevoCuposOcupados = cuposOcupados + reserva.cupos_reservados;
    const nuevosCuposDisponibles = viaje.cupos_totales - nuevoCuposOcupados;
    await ViajeRepository.actualizarCuposDisponibles(reserva.id_viaje, nuevosCuposDisponibles);

    // Si el viaje está lleno, marcarlo como tal
    if (nuevosCuposDisponibles === 0) {
      await ViajeRepository.marcarViajeComoLleno(reserva.id_viaje);
    }

    // Notificar al pasajero
    await NotificacionService.enviarNotificacion({
      id_usuario: reserva.id_pasajero,
      titulo: 'Reserva aceptada',
      mensaje: `Tu reserva para el viaje de ${viaje.origen} a ${viaje.destino} ha sido aceptada`,
      tipo: 'reserva_aceptada'
    });

    return reservaActualizada;
  },

  async rechazarReserva(id_reserva, id_conductor) {
    const reserva = await ReservaRepository.obtenerReserva(id_reserva);
    if (!reserva) {
      throw new Error('La reserva no existe');
    }

    // Verificar que sea el conductor del viaje
    const viaje = await ViajeRepository.obtenerViaje(reserva.id_viaje);
    if (viaje.id_conductor !== id_conductor) {
      throw new Error('No tienes autorización para gestionar esta reserva');
    }

    // Rechazar la reserva
    const reservaActualizada = await ReservaRepository.actualizarEstadoReserva(id_reserva, 'Rechazada');

    // Notificar al pasajero
    await NotificacionService.enviarNotificacion({
      id_usuario: reserva.id_pasajero,
      titulo: 'Reserva rechazada',
      mensaje: `Tu reserva para el viaje de ${viaje.origen} a ${viaje.destino} ha sido rechazada`,
      tipo: 'reserva_rechazada'
    });

    return reservaActualizada;
  },

  async cancelarReserva(id_reserva, id_pasajero) {
    const reserva = await ReservaRepository.obtenerReserva(id_reserva);
    if (!reserva) {
      throw new Error('La reserva no existe');
    }

    // Verificar que sea el pasajero de la reserva
    if (reserva.id_pasajero !== id_pasajero) {
      throw new Error('No tienes autorización para cancelar esta reserva');
    }

    // Solo se puede cancelar si está pendiente o aceptada
    if (!['Pendiente', 'Aceptada'].includes(reserva.estado)) {
      throw new Error('No puedes cancelar esta reserva en su estado actual');
    }

    // Cancelar la reserva
    const reservaActualizada = await ReservaRepository.cancelarReserva(id_reserva);

    // Si estaba aceptada, liberar los cupos
    if (reserva.estado === 'Aceptada') {
      const viaje = await ViajeRepository.obtenerViaje(reserva.id_viaje);
      const nuevosCuposDisponibles = viaje.cupos_disponibles + reserva.cupos_reservados;
      await ViajeRepository.actualizarCuposDisponibles(reserva.id_viaje, nuevosCuposDisponibles);

      // Si el viaje estaba lleno, reactivarlo
      if (viaje.estado === 'Lleno') {
        await ViajeRepository.actualizarViaje(reserva.id_viaje, { estado: 'Activo' });
      }

      // Notificar al conductor
      await NotificacionService.enviarNotificacion({
        id_usuario: viaje.id_conductor,
        titulo: 'Reserva cancelada',
        mensaje: `Un pasajero ha cancelado su reserva de ${reserva.cupos_reservados} cupo(s) en tu viaje de ${viaje.origen} a ${viaje.destino}`,
        tipo: 'reserva_cancelada'
      });
    }

    return reservaActualizada;
  },

  async listarReservasPorViaje(id_viaje) {
    return await ReservaRepository.listarReservasPorViaje(id_viaje);
  },

  async listarReservasPorPasajero(id_pasajero) {
    return await ReservaRepository.listarReservasPorPasajero(id_pasajero);
  }
};