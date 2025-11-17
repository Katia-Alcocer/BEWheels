import { ReservaRepository } from '../repositories/reserva.repository.js';
import { ViajeRepository } from '../repositories/viaje.repository.js';
import { NotificacionService } from './notificacion.service.js';

export const ReservaService = {
  async crearReserva(datosReserva) {
    const { id_viaje, id_pasajero, cupos_reservados, punto_recogida, punto_destino } = datosReserva;

  
    const viaje = await ViajeRepository.obtenerViaje(id_viaje);
    if (!viaje) {
      throw new Error('El viaje no existe');
    }

    if (viaje.estado !== 'Activo') {
      throw new Error('El viaje no está disponible para reservas');
    }

   
    if (viaje.id_conductor === id_pasajero) {
      throw new Error('No puedes reservar en tu propio viaje');
    }

  
    const reservaExistente = await ReservaRepository.verificarReservaExistente(id_viaje, id_pasajero);
    if (reservaExistente) {
      throw new Error('Ya tienes una reserva para este viaje');
    }

   
    const cuposOcupados = await ReservaRepository.contarReservasAceptadas(id_viaje);
    const cuposDisponibles = viaje.cupos_totales - cuposOcupados;
    
    if (cupos_reservados > cuposDisponibles) {
      throw new Error(`Solo hay ${cuposDisponibles} cupos disponibles`);
    }

   
    const nuevaReserva = await ReservaRepository.crearReserva(datosReserva);

    
    await NotificacionService.enviarNotificacion({
      id_usuario: viaje.id_conductor,
      titulo: 'Nueva solicitud de reserva',
      mensaje: `${viaje.nombre_pasajero || 'Un pasajero'} ha solicitado ${cupos_reservados} cupo(s) en tu viaje de ${viaje.origen} a ${viaje.destino}`
    });

    return nuevaReserva;
  },

  async aceptarReserva(id_reserva, id_conductor) {
    const reserva = await ReservaRepository.obtenerReserva(id_reserva);
    if (!reserva) {
      throw new Error('La reserva no existe');
    }

   
    const viaje = await ViajeRepository.obtenerViaje(reserva.id_viaje);
    if (viaje.id_conductor !== id_conductor) {
      throw new Error('No tienes autorización para gestionar esta reserva');
    }

    const cuposOcupados = await ReservaRepository.contarReservasAceptadas(reserva.id_viaje);
    const cuposDisponibles = viaje.cupos_totales - cuposOcupados;
    
    if (reserva.cupos_reservados > cuposDisponibles) {
      throw new Error('Ya no hay suficientes cupos disponibles');
    }

   
    const reservaActualizada = await ReservaRepository.actualizarEstadoReserva(id_reserva, 'Aceptada');

    
    const nuevoCuposOcupados = cuposOcupados + reserva.cupos_reservados;
    const nuevosCuposDisponibles = viaje.cupos_totales - nuevoCuposOcupados;
    await ViajeRepository.actualizarCuposDisponibles(reserva.id_viaje, nuevosCuposDisponibles);

  
    if (nuevosCuposDisponibles === 0) {
      await ViajeRepository.marcarViajeComoLleno(reserva.id_viaje);
    }

   
    await NotificacionService.enviarNotificacion({
      id_usuario: reserva.id_pasajero,
      titulo: 'Reserva aceptada',
      mensaje: `Tu reserva para el viaje de ${viaje.origen} a ${viaje.destino} ha sido aceptada`
    });

    return reservaActualizada;
  },

  async rechazarReserva(id_reserva, id_conductor) {
    const reserva = await ReservaRepository.obtenerReserva(id_reserva);
    if (!reserva) {
      throw new Error('La reserva no existe');
    }

    
    const viaje = await ViajeRepository.obtenerViaje(reserva.id_viaje);
    if (viaje.id_conductor !== id_conductor) {
      throw new Error('No tienes autorización para gestionar esta reserva');
    }

   
    const reservaActualizada = await ReservaRepository.actualizarEstadoReserva(id_reserva, 'Rechazada');

   
    await NotificacionService.enviarNotificacionPersistente({
      id_usuario: reserva.id_pasajero,
      titulo: '❌ Reserva rechazada',
      mensaje: `Lo sentimos, tu solicitud de reserva para el viaje de ${viaje.origen} a ${viaje.destino} ha sido rechazada por el conductor. Puedes buscar otros viajes disponibles.`
    });

    return reservaActualizada;
  },

  async cancelarReserva(id_reserva, id_pasajero) {
    const reserva = await ReservaRepository.obtenerReserva(id_reserva);
    if (!reserva) {
      throw new Error('La reserva no existe');
    }

    
    if (reserva.id_pasajero !== id_pasajero) {
      throw new Error('No tienes autorización para cancelar esta reserva');
    }

    
    if (!['Pendiente', 'Aceptada'].includes(reserva.estado)) {
      throw new Error('No puedes cancelar esta reserva en su estado actual');
    }

   
    const reservaActualizada = await ReservaRepository.cancelarReserva(id_reserva);

    
    if (reserva.estado === 'Aceptada') {
      const viaje = await ViajeRepository.obtenerViaje(reserva.id_viaje);
      const nuevosCuposDisponibles = viaje.cupos_disponibles + reserva.cupos_reservados;
      await ViajeRepository.actualizarCuposDisponibles(reserva.id_viaje, nuevosCuposDisponibles);

      
      if (viaje.estado === 'Lleno') {
        await ViajeRepository.actualizarViaje(reserva.id_viaje, { estado: 'Activo' });
      }

     
      await NotificacionService.enviarNotificacion({
        id_usuario: viaje.id_conductor,
        titulo: 'Reserva cancelada',
        mensaje: `Un pasajero ha cancelado su reserva de ${reserva.cupos_reservados} cupo(s) en tu viaje de ${viaje.origen} a ${viaje.destino}`
      });
    }

    return reservaActualizada;
  },

  async listarReservasPorViaje(id_viaje) {
    return await ReservaRepository.listarReservasPorViaje(id_viaje);
  },

  async listarReservasPorPasajero(id_pasajero) {
    return await ReservaRepository.listarReservasPorPasajero(id_pasajero);
  },

  async listarSolicitudesConductor(id_conductor) {
    return await ReservaRepository.listarSolicitudesConductor(id_conductor);
  },

  async eliminarReserva(id_reserva, id_pasajero) {
    const reserva = await ReservaRepository.obtenerReserva(id_reserva);
    if (!reserva) {
      throw new Error('La reserva no existe');
    }

    
    if (reserva.id_pasajero !== id_pasajero) {
      throw new Error('No tienes autorización para eliminar esta reserva');
    }

    
    if (!['Pendiente', 'Aceptada'].includes(reserva.estado)) {
      throw new Error('No puedes eliminar esta reserva en su estado actual');
    }

   
    const validacionTiempo = await ReservaRepository.verificarTiempoReserva(id_reserva);
    if (!validacionTiempo.puede) {
      throw new Error(validacionTiempo.razon);
    }

    
    const reservaEliminada = await ReservaRepository.eliminarReserva(id_reserva);
    if (!reservaEliminada) {
      throw new Error('No se pudo eliminar la reserva');
    }

    
    if (reserva.estado === 'Aceptada') {
      const viaje = await ViajeRepository.obtenerViaje(reserva.id_viaje);
      const nuevosCuposDisponibles = viaje.cupos_disponibles + reserva.cupos_reservados;
      await ViajeRepository.actualizarCuposDisponibles(reserva.id_viaje, nuevosCuposDisponibles);

      
      if (viaje.estado === 'Lleno') {
        await ViajeRepository.actualizarViaje(reserva.id_viaje, { estado: 'Activo' });
      }
    }

    
    const viaje = await ViajeRepository.obtenerViaje(reserva.id_viaje);
    await NotificacionService.enviarNotificacion({
      id_usuario: viaje.id_conductor,
      titulo: 'Reserva eliminada',
      mensaje: `Un pasajero ha eliminado su reserva de ${reserva.cupos_reservados} cupo(s) en tu viaje de ${viaje.origen} a ${viaje.destino}`
    });

    return reservaEliminada;
  }
};