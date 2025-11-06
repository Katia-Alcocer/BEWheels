import { pool } from '../config/db.config.js';

export const UbicacionRepository = {
  async listarUbicaciones() {
    const query = 'SELECT * FROM Ubicaciones_Comunes WHERE activo = true ORDER BY nombre';
    const result = await pool.query(query);
    return result.rows;
  },

  async buscarPorNombre(nombre) {
    const query = 'SELECT * FROM Ubicaciones_Comunes WHERE LOWER(nombre) = LOWER($1)';
    const result = await pool.query(query, [nombre]);
    return result.rows[0];
  },

  async crearUbicacion(nombre) {
    const query = `
      INSERT INTO Ubicaciones_Comunes (nombre)
      VALUES ($1)
      RETURNING id_ubicacion, nombre, activo;
    `;
    const result = await pool.query(query, [nombre]);
    return result.rows[0];
  },

  async desactivarUbicacion(id_ubicacion) {
    const query = `
      UPDATE Ubicaciones_Comunes
      SET activo = false
      WHERE id_ubicacion = $1
      RETURNING id_ubicacion, nombre, activo;
    `;
    const result = await pool.query(query, [id_ubicacion]);
    return result.rows[0];
  }
};