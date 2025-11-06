import { UsuarioService } from '../services/usuario.service.js';
import { usuarioSchema, usuarioUpdateSchema } from '../validations/usuario.validation.js';

export const UsuarioController = {

  async registrarUsuario(req, res) {
    if (!req.body) {
  return res.status(400).json({ error: 'No se recibieron datos del usuario.' });
}

console.log('🟢 Body recibido:', req.body);
console.log('🟣 Archivo recibido:', req.file);

    console.log('---- DEBUG MULTER ----');
  console.log('Headers:', req.headers['content-type']);
  console.log('Body keys:', req.body ? Object.keys(req.body) : 'req.body es undefined');
  console.log('File:', req.file);
  // luego sigue con el try { ... }
    try {
      console.log('--- REGISTRO USUARIO ---');
      console.log('req.body inicial:', req.body);
      console.log('req.file:', req.file);

     
      if (!req.body) req.body = {};

     
      if (
        Object.keys(req.body).length === 0 &&
        req.headers['content-type']?.includes('multipart/form-data')
      ) {
        console.warn('⚠️ req.body llegó vacío. Posiblemente no se subió imagen.');
       
        req.body = {
          nombre: req.body?.nombre || req.body.get?.('nombre'),
          id_universitario: req.body?.id_universitario || req.body.get?.('id_universitario'),
          correo: req.body?.correo || req.body.get?.('correo'),
          telefono: req.body?.telefono || req.body.get?.('telefono'),
          contrasena: req.body?.contrasena || req.body.get?.('contrasena')
        };
      }

     
      if (req.file) {
        req.body.foto_perfil = `/uploads/${req.file.filename}`;
      }

  
      const { error, value } = usuarioSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          error:
            error.details[0].message ||
            'Datos inválidos. Por favor revisa los campos e inténtalo de nuevo.'
        });
      }

    
      if (!value.correo) {
        return res.status(400).json({
          error:
            'Faltan datos obligatorios. Por favor revisa que todos los campos estén completos, especialmente el correo institucional.'
        });
      }

   
      console.log('Datos recibidos para registro:', value);
      const nuevoUsuario = await UsuarioService.registrarUsuario(value);

     
      return res.status(201).json({
        message: 'Usuario registrado con éxito',
        usuario: nuevoUsuario
      });
    } catch (err) {
      console.error('❌ Error en registrarUsuario:', err);

     
      let msg = err.message;
      if (msg.includes('correo ya está registrado')) {
        msg = 'El correo ingresado ya está registrado. Por favor usa otro correo institucional.';
      } else if (msg.includes('ID universitario ya está registrado')) {
        msg = 'El ID universitario ingresado ya está registrado. Verifica que sea correcto o usa otro.';
      }

    
      return res.status(400).json({
        error: msg || 'Error al procesar la solicitud.'
      });
    }
  },

  async listarUsuarios(req, res) {
    try {
      const usuarios = await UsuarioService.listarUsuarios();
      return res.json(usuarios);
    } catch (err) {
      console.error('❌ Error al listar usuarios:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  async obtenerMiPerfil(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const usuario = await UsuarioService.buscarPorId(id_usuario);
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const perfil = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        id_universitario: usuario.id_universitario,
        correo: usuario.correo,
        telefono: usuario.telefono,
        foto_perfil: usuario.foto_perfil || null
      };
      return res.json(perfil);
    } catch (err) {
      console.error('❌ Error en obtenerMiPerfil:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  },

  async actualizarMiPerfil(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      // DEBUG: Ver qué llega del frontend
      console.log('🔍 req.body completo:', req.body);
      console.log('🔍 Claves en req.body:', Object.keys(req.body || {}));
      console.log('🔍 Archivo recibido:', req.file);

      // Construir payload permitido (ignorar correo si viene)
      const input = {
        nombre: req.body?.nombre,
        id_universitario: req.body?.id_universitario,
        telefono: req.body?.telefono,
        contrasena: req.body?.contrasena, // Incluir contraseña
      };

      // Si se cargó foto, agregar ruta
      if (req.file) {
        input.foto_perfil = `/uploads/${req.file.filename}`;
      }

      // Validar y filtrar campos permitidos automáticamente
      const { error, value } = usuarioUpdateSchema.validate(input, { 
        abortEarly: true,
        stripUnknown: true // Esto elimina campos no definidos en el esquema
      });
      if (error) {
        return res.status(400).json({ error: error.details[0].message });
      }

      if (Object.keys(value).length === 0) {
        return res.status(400).json({ error: 'No hay campos válidos para actualizar.' });
      }

      const usuarioActualizado = await UsuarioService.actualizarPerfil(id_usuario, value);

      return res.json({ success: true, usuario: usuarioActualizado });
    } catch (err) {
      console.error('❌ Error en actualizarMiPerfil:', err);
      const msg = err.message?.includes('ya está registrado')
        ? err.message
        : (err.message || 'Error al actualizar el perfil');
      return res.status(400).json({ error: msg });
    }
  }
};
