import { RolRepository } from '../repositories/rol.repository.js';

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
  }
};
