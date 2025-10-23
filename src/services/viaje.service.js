import { ViajeRepository } from '../repositories/viaje.repository.js';

export const ViajeService = {
  async crearViaje(datosViaje) {
    return await ViajeRepository.crearViaje(datosViaje);
  },

  async listarViajesDisponibles(filtros) {
    return await ViajeRepository.listarViajesDisponibles(filtros);
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
  }
};
