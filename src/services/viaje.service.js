import { ViajeRepository } from '../repositories/viaje.repository.js';
import { RolService } from './rol.service.js';

export const ViajeService = {
  async crearViaje(datosViaje) {
    // Verificar que el conductor no tenga un viaje activo
    const viajeActivo = await ViajeRepository.buscarViajeActivoPorConductor(datosViaje.id_conductor);
    if (viajeActivo) {
      throw new Error('Ya tienes un viaje activo. Debes completar o cancelar tu viaje actual antes de crear uno nuevo.');
    }

    return await ViajeRepository.crearViaje(datosViaje);
  },

  async listarViajesDisponibles(filtros, id_usuario_actual = null) {
    // Verificar y actualizar viajes vencidos antes de listar
    await ViajeRepository.verificarYActualizarViajesVencidos();
    return await ViajeRepository.listarViajesDisponibles(filtros, id_usuario_actual);
  },

  async listarViajesPorConductor(id_conductor) {
    // Verificar y actualizar viajes vencidos antes de listar
    await ViajeRepository.verificarYActualizarViajesVencidos();
    return await ViajeRepository.listarViajesPorConductor(id_conductor);
  },

  async obtenerViaje(id) {
    return await ViajeRepository.obtenerViaje(id);
  },

  async actualizarViaje(id, datosViaje) {
    return await ViajeRepository.actualizarViaje(id, datosViaje);
  },

  async cancelarViaje(id, id_conductor) {
    // Verificar que el viaje pertenezca al conductor
    const viaje = await ViajeRepository.obtenerViaje(id);
    if (!viaje) {
      throw new Error('El viaje no existe');
    }

    if (viaje.id_conductor !== id_conductor) {
      throw new Error('No tienes autorización para cancelar este viaje');
    }

    // Verificar que se pueda modificar (al menos 1 hora antes)
    const validacion = await ViajeRepository.puedeModificarViaje(id);
    if (!validacion.puede) {
      throw new Error(validacion.razon);
    }

    // Cancelar el viaje
    const viajeCancelado = await ViajeRepository.cancelarViaje(id);
    if (!viajeCancelado) {
      throw new Error('No se pudo cancelar el viaje');
    }

    // Verificar si debe desactivar el rol de conductor
    try {
      await RolService.verificarYDesactivarRolConductor(id_conductor);
    } catch (error) {
      console.error('Error verificando rol de conductor:', error);
      // No fallar la cancelación si hay error en la verificación de rol
    }

    // TODO: Notificar a todos los pasajeros con reservas aceptadas
    // y liberar los cupos automáticamente

    return viajeCancelado;
  },

  async completarViaje(id, id_conductor) {
    // Verificar que el viaje pertenezca al conductor
    const viaje = await ViajeRepository.obtenerViaje(id);
    if (!viaje) {
      throw new Error('El viaje no existe');
    }

    if (viaje.id_conductor !== id_conductor) {
      throw new Error('No tienes autorización para completar este viaje');
    }

    if (!['Activo', 'Lleno'].includes(viaje.estado)) {
      throw new Error('Solo se pueden completar viajes activos o llenos');
    }

    const viajeCompletado = await ViajeRepository.completarViaje(id);

    // Verificar si debe desactivar el rol de conductor
    try {
      await RolService.verificarYDesactivarRolConductor(id_conductor);
    } catch (error) {
      console.error('Error verificando rol de conductor:', error);
      // No fallar la completación si hay error en la verificación de rol
    }

    return viajeCompletado;
  },

  async verificarViajeActivo(id_conductor) {
    // Verificar y actualizar viajes vencidos antes de verificar
    await ViajeRepository.verificarYActualizarViajesVencidos();
    return await ViajeRepository.buscarViajeActivoPorConductor(id_conductor);
  },

  async actualizarViajesVencidos() {
    return await ViajeRepository.verificarYActualizarViajesVencidos();
  }
};
