import { VehiculoRepository } from '../repositories/vehiculo.repository.js';
import { RolService } from './rol.service.js';

export const VehiculoService = {
  async registrarVehiculo(datosVehiculo) {
    const vehiculo = await VehiculoRepository.crearVehiculo(datosVehiculo);
    
    // Asignar rol de Conductor automáticamente
    try {
      await RolService.asignarRolConductor(vehiculo.id_usuario);
    } catch (error) {
      console.error('Error asignando rol de conductor:', error);
      // No fallar el registro si no se puede asignar el rol
    }
    
    return vehiculo;
  },

  async listarVehiculosPorUsuario(id_usuario) {
    return await VehiculoRepository.buscarPorIdUsuario(id_usuario);
  },

  async obtenerVehiculo(id) {
    return await VehiculoRepository.buscarPorId(id);
  },

  async actualizarVehiculo(id, datosVehiculo) {
    return await VehiculoRepository.actualizarVehiculo(id, datosVehiculo);
  },

  async eliminarVehiculo(id) {
    return await VehiculoRepository.eliminarVehiculo(id);
  }
};
