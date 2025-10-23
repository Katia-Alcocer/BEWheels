import { UsuarioService } from '../services/usuario.service.js';
import { usuarioSchema } from '../validations/usuario.validation.js';

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
  }
};
