import { RolRepository } from '../repositories/rol.repository.js';

export const RolService = {
  async getRolesByUserId(id_usuario) {
    return await RolRepository.findRolesByUserId(id_usuario);
  },

  async asignarRolConductor(id_usuario) {
    
    const roles = await RolRepository.findRolesByUserId(id_usuario);
    const yaEsConductor = roles.some(rol => rol.nombre_rol === 'Conductor');
    
    if (!yaEsConductor) {
      
      const rolConductor = await RolRepository.findRolByName('Conductor');
      if (rolConductor) {
        await RolRepository.asignarRolUsuario(id_usuario, rolConductor.id_rol);
      }
    }
  }
};
