import { pool } from '../config/db.config.js';

export const NotificacionRepository = {
  async crearNotificacion({ id_usuario, titulo, mensaje, es_persistente = false }) {
    const query = `
      INSERT INTO Notificaciones (id_usuario, titulo, mensaje, leida)
      VALUES ($1, $2, $3, false)
      RETURNING id_notificacion, id_usuario, titulo, mensaje, leida, fecha_envio;
    `;
    const values = [id_usuario, titulo, mensaje];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async listarNotificacionesPorUsuario(id_usuario) {
    const query = `
      SELECT * FROM Notificaciones 
      WHERE id_usuario = $1 
      ORDER BY fecha_envio DESC
    `;
    const result = await pool.query(query, [id_usuario]);
    return result.rows;
  },

  async listarNotificacionesNoLeidas(id_usuario) {
    const query = `
      SELECT * FROM Notificaciones 
      WHERE id_usuario = $1 AND leida = false
      ORDER BY fecha_envio DESC
    `;
    const result = await pool.query(query, [id_usuario]);
    return result.rows;
  },

  async marcarComoLeida(id_notificacion, id_usuario) {
    const query = `
      UPDATE Notificaciones 
      SET leida = true
      WHERE id_notificacion = $1 AND id_usuario = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [id_notificacion, id_usuario]);
    return result.rows[0];
  },

  async marcarTodasComoLeidas(id_usuario) {
    const query = `
      UPDATE Notificaciones 
      SET leida = true
      WHERE id_usuario = $1 AND leida = false
      RETURNING COUNT(*) as notificaciones_marcadas;
    `;
    const result = await pool.query(query, [id_usuario]);
    return result.rows[0];
  },

  async contarNoLeidas(id_usuario) {
    const query = `
      SELECT COUNT(*) as total_no_leidas
      FROM Notificaciones 
      WHERE id_usuario = $1 AND leida = false
    `;
    const result = await pool.query(query, [id_usuario]);
    return parseInt(result.rows[0].total_no_leidas);
  }
};