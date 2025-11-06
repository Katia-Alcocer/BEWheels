import { pool } from '../config/db.config.js';

export const UsuarioRepository = {
  async crearUsuario({ nombre, id_universitario, correo, telefono, contrasena_hash, foto_perfil }) {
    const query = `
      INSERT INTO Usuarios (nombre, id_universitario, correo, telefono, contrasena_hash, foto_perfil)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_usuario, nombre, correo, telefono, fecha_registro;
    `;
    const values = [nombre, id_universitario, correo, telefono, contrasena_hash, foto_perfil];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async buscarPorCorreo(correo) {
    const query = 'SELECT * FROM Usuarios WHERE correo = $1';
    const result = await pool.query(query, [correo]);
    return result.rows[0];
  },

  async buscarPorIdUniversitario(id_universitario) {
    const query = 'SELECT * FROM Usuarios WHERE id_universitario = $1';
    const result = await pool.query(query, [id_universitario]);
    return result.rows[0];
  },

  async buscarPorId(id) {
    const query = 'SELECT * FROM Usuarios WHERE id_usuario = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async listarUsuarios() {
    const query = 'SELECT id_usuario, nombre, correo, telefono, fecha_registro FROM Usuarios ORDER BY fecha_registro DESC';
    const result = await pool.query(query);
    return result.rows;
  },

  async actualizarUsuarioPerfil(id_usuario, campos) {
    const set = [];
    const values = [];
    let i = 1;

    const addField = (col, val) => {
      if (typeof val !== 'undefined') {
        set.push(`${col} = $${i}`);
        values.push(val);
        i++;
      }
    };

    addField('nombre', campos.nombre);
    addField('id_universitario', campos.id_universitario);
    addField('telefono', campos.telefono);
    addField('foto_perfil', campos.foto_perfil);
    addField('contrasena_hash', campos.contrasena_hash);

    if (set.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    const query = `
      UPDATE Usuarios
      SET ${set.join(', ')}
      WHERE id_usuario = $${i}
      RETURNING id_usuario, nombre, id_universitario, correo, telefono, foto_perfil;
    `;
    values.push(id_usuario);
    const result = await pool.query(query, values);
    return result.rows[0];
  }
};
