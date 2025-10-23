import { UsuarioService } from '../services/usuario.service.js';
import { comparePassword } from '../utils/hash.util.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config.js';

export const AuthController = {
  async login(req, res) {
    const { correo, contrasena } = req.body;
    try {
      const usuario = await UsuarioService.buscarPorCorreo(correo);
      if (!usuario || !(await comparePassword(contrasena, usuario.contrasena_hash))) {
        return res.status(400).json({ error: 'Credenciales inválidas' });
      }

      const token = jwt.sign(
        { 
          id_usuario: usuario.id_usuario,
          correo: usuario.correo,
          nombre: usuario.nombre
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({ 
        message: 'Login exitoso', 
        token, 
        usuario: { 
          id_usuario: usuario.id_usuario, 
          nombre: usuario.nombre, 
          correo: usuario.correo, 
          telefono: usuario.telefono, 
          foto_perfil: usuario.foto_perfil 
        } 
      });
    } catch (err) {
      console.error('Error en login:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async verificarToken(req, res) {
    try {
      const usuario = await UsuarioService.buscarPorId(req.user.id_usuario);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      return res.json({ 
        valido: true, 
        usuario: { 
          id_usuario: usuario.id_usuario, 
          nombre: usuario.nombre, 
          correo: usuario.correo, 
          telefono: usuario.telefono, 
          foto_perfil: usuario.foto_perfil 
        } 
      });
    } catch (err) {
      console.error('Error en verificarToken:', err);
      return res.status(401).json({ error: 'No autorizado: Token inválido o expirado' });
    }
  },

  async logout(req, res) {
    return res.json({ message: 'Sesión cerrada exitosamente (token invalidado en cliente)' });
  }
};
