import { UsuarioRepository } from '../repositories/usuario.repository.js';
import { hashPassword } from '../utils/hash.util.js';

export const UsuarioService = {
  async registrarUsuario(datos) {
   
    const existeCorreo = await UsuarioRepository.buscarPorCorreo(datos.correo);
    if (existeCorreo) throw new Error('El correo ya está registrado.');

    const existeId = await UsuarioRepository.buscarPorIdUniversitario(datos.id_universitario);
    if (existeId) throw new Error('El ID universitario ya está registrado.');

  
    const contrasena_hash = await hashPassword(datos.contrasena);

  
    const usuario = await UsuarioRepository.crearUsuario({
      ...datos,
      contrasena_hash,
    });

    return usuario;
  }
,
  async listarUsuarios() {
    return await UsuarioRepository.listarUsuarios();
  }
};
