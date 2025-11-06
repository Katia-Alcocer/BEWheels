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
  },

  async buscarPorCorreo(correo) {
    return await UsuarioRepository.buscarPorCorreo(correo);
  },

  async buscarPorId(id) {
    return await UsuarioRepository.buscarPorId(id);
  },

  async listarUsuarios() {
    return await UsuarioRepository.listarUsuarios();
  },

  async actualizarPerfil(id_usuario, datos) {
    // Obtener usuario actual
    const actual = await UsuarioRepository.buscarPorId(id_usuario);
    if (!actual) throw new Error('Usuario no encontrado');

    // Verificar unicidad de id_universitario si cambia
    if (datos.id_universitario && datos.id_universitario !== actual.id_universitario) {
      const otro = await UsuarioRepository.buscarPorIdUniversitario(datos.id_universitario);
      if (otro && otro.id_usuario !== id_usuario) {
        throw new Error('El ID universitario ya está registrado.');
      }
    }

    const permitidos = {
      nombre: datos.nombre,
      id_universitario: datos.id_universitario,
      telefono: datos.telefono,
      foto_perfil: datos.foto_perfil
    };

    // Si se proporciona contraseña, hashearla
    if (datos.contrasena) {
      permitidos.contrasena_hash = await hashPassword(datos.contrasena);
    }

    const actualizado = await UsuarioRepository.actualizarUsuarioPerfil(id_usuario, permitidos);
    return actualizado;
  }
};
