import { ViajeRepository } from '../repositories/viaje.repository.js';

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
    return await ViajeRepository.listarViajesDisponibles(filtros, id_usuario_actual);
  },

  async listarViajesPorConductor(id_conductor) {
    return await ViajeRepository.listarViajesPorConductor(id_conductor);
  },

  async obtenerViaje(id) {
    return await ViajeRepository.obtenerViaje(id);
  },

  async actualizarViaje(id, datosViaje) {
    return await ViajeRepository.actualizarViaje(id, datosViaje);
  },

  async cancelarViaje(id) {
    return await ViajeRepository.cancelarViaje(id);
  },

  async completarViaje(id) {
    return await ViajeRepository.completarViaje(id);
  },

  async verificarViajeActivo(id_conductor) {
    return await ViajeRepository.buscarViajeActivoPorConductor(id_conductor);
  }
};
