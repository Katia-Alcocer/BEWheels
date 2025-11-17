import { pool } from '../config/db.config.js';

export const RolRepository = {
  async findRolesByUserId(id_usuario) {
    const query = `
      SELECT r.nombre_rol, ur.rol_activo
      FROM Usuarios_Roles ur
      JOIN Roles r ON ur.id_rol = r.id_rol
      WHERE ur.id_usuario = $1;
    `;
    const { rows } = await pool.query(query, [id_usuario]);
    return rows;
  },

  async findRolByName(nombre_rol) {
    const query = 'SELECT * FROM Roles WHERE nombre_rol = $1';
    const { rows } = await pool.query(query, [nombre_rol]);
    return rows[0];
  },

  async asignarRolUsuario(id_usuario, id_rol) {
    const query = `
      INSERT INTO Usuarios_Roles (id_usuario, id_rol, rol_activo)
      VALUES ($1, $2, true)
      ON CONFLICT (id_usuario, id_rol) 
      DO UPDATE SET rol_activo = true
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_usuario, id_rol]);
    return rows[0];
  },

  async desactivarRolUsuario(id_usuario, id_rol) {
    const query = `
      UPDATE Usuarios_Roles 
      SET rol_activo = false
      WHERE id_usuario = $1 AND id_rol = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [id_usuario, id_rol]);
    return rows[0];
  }
};
