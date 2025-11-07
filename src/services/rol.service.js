import { RolRepository } from '../repositories/rol.repository.js';
import { ViajeRepository } from '../repositories/viaje.repository.js';
import { VehiculoRepository } from '../repositories/vehiculo.repository.js';

export const RolService = {
  async getRolesByUserId(id_usuario) {
    return await RolRepository.findRolesByUserId(id_usuario);
  },

  async asignarRolConductor(id_usuario) {
    // Primero verificar si ya tiene el rol de conductor
    const roles = await RolRepository.findRolesByUserId(id_usuario);
    const yaEsConductor = roles.some(rol => rol.nombre_rol === 'Conductor');
    
    if (!yaEsConductor) {
      // Obtener el ID del rol de Conductor
      const rolConductor = await RolRepository.findRolByName('Conductor');
      if (rolConductor) {
        await RolRepository.asignarRolUsuario(id_usuario, rolConductor.id_rol);
      }
    }
  },

  async verificarYDesactivarRolConductor(id_usuario) {
    // Verificar si tiene el rol de conductor
    const roles = await RolRepository.findRolesByUserId(id_usuario);
    const esConductor = roles.some(rol => rol.nombre_rol === 'Conductor' && rol.rol_activo);
    
    if (!esConductor) {
      return false; // No es conductor activo, no hay nada que hacer
    }

    // Verificar si tiene viajes activos
    const viajeActivo = await ViajeRepository.buscarViajeActivoPorConductor(id_usuario);
    
    // Verificar si tiene vehículos registrados
    const vehiculos = await VehiculoRepository.buscarPorIdUsuario(id_usuario);
    
    // Si no tiene viajes activos ni vehículos, desactivar el rol de conductor
    if (!viajeActivo && vehiculos.length === 0) {
      const rolConductor = await RolRepository.findRolByName('Conductor');
      if (rolConductor) {
        await RolRepository.desactivarRolUsuario(id_usuario, rolConductor.id_rol);
        console.log(`✅ Rol de conductor desactivado para usuario ${id_usuario} (sin viajes activos ni vehículos)`);
        return true;
      }
    }
    
    return false;
  }
};
