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
};
