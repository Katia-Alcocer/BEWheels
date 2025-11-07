import { pool } from '../config/db.config.js';

export const ReservaRepository = {
  async crearReserva({ id_viaje, id_pasajero, cupos_reservados, punto_recogida, punto_destino }) {
    const query = `
      INSERT INTO Reservas (id_viaje, id_pasajero, cupos_reservados, punto_recogida, punto_destino, estado)
      VALUES ($1, $2, $3, $4, $5, 'Pendiente')
      RETURNING id_reserva, id_viaje, id_pasajero, cupos_reservados, punto_recogida, punto_destino, estado, fecha_reserva;
    `;
    const values = [id_viaje, id_pasajero, cupos_reservados, punto_recogida, punto_destino];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async listarReservasPorViaje(id_viaje) {
    const query = `
      SELECT r.*, u.nombre as nombre_pasajero, u.telefono as telefono_pasajero
      FROM Reservas r
      JOIN Usuarios u ON r.id_pasajero = u.id_usuario
      WHERE r.id_viaje = $1
      ORDER BY r.fecha_reserva ASC
    `;
    const result = await pool.query(query, [id_viaje]);
    return result.rows;
  },

  async listarReservasPorPasajero(id_pasajero) {
    const query = `
      SELECT r.*, v.origen, v.destino, v.fecha_salida, v.estado as estado_viaje,
             u.nombre as nombre_conductor, u.telefono as telefono_conductor,
             ve.marca, ve.modelo, ve.placa
      FROM Reservas r
      JOIN Viajes v ON r.id_viaje = v.id_viaje
      JOIN Usuarios u ON v.id_conductor = u.id_usuario
      JOIN Vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
      WHERE r.id_pasajero = $1
      ORDER BY v.fecha_salida DESC
    `;
    const result = await pool.query(query, [id_pasajero]);
    return result.rows;
  },

  async obtenerReserva(id_reserva) {
    const query = `
      SELECT r.*, v.origen, v.destino, v.fecha_salida,
             u.nombre as nombre_pasajero, u.telefono as telefono_pasajero
      FROM Reservas r
      JOIN Viajes v ON r.id_viaje = v.id_viaje
      JOIN Usuarios u ON r.id_pasajero = u.id_usuario
      WHERE r.id_reserva = $1
    `;
    const result = await pool.query(query, [id_reserva]);
    return result.rows[0];
  },

  async actualizarEstadoReserva(id_reserva, nuevo_estado) {
    const query = `
      UPDATE Reservas 
      SET estado = $2
      WHERE id_reserva = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id_reserva, nuevo_estado]);
    return result.rows[0];
  },

  async cancelarReserva(id_reserva) {
    const query = `
      UPDATE Reservas 
      SET estado = 'Cancelada'
      WHERE id_reserva = $1 AND estado IN ('Pendiente', 'Aceptada')
      RETURNING *;
    `;
    const result = await pool.query(query, [id_reserva]);
    return result.rows[0];
  },

  async verificarReservaExistente(id_viaje, id_pasajero) {
    const query = `
      SELECT * FROM Reservas 
      WHERE id_viaje = $1 AND id_pasajero = $2 AND estado IN ('Pendiente', 'Aceptada')
      LIMIT 1
    `;
    const result = await pool.query(query, [id_viaje, id_pasajero]);
    return result.rows[0];
  },

  async contarReservasAceptadas(id_viaje) {
    const query = `
      SELECT COALESCE(SUM(cupos_reservados), 0) as total_cupos_reservados
      FROM Reservas 
      WHERE id_viaje = $1 AND estado = 'Aceptada'
    `;
    const result = await pool.query(query, [id_viaje]);
    return parseInt(result.rows[0].total_cupos_reservados);
  },

  async listarSolicitudesConductor(id_conductor) {
    const query = `
      SELECT 
        r.*,
        v.origen,
        v.destino,
        v.fecha_salida,
        v.tarifa,
        v.cupos_totales,
        v.cupos_disponibles,
        u.nombre as nombre_pasajero,
        u.telefono as telefono_pasajero
      FROM Reservas r
      JOIN Viajes v ON r.id_viaje = v.id_viaje
      JOIN Usuarios u ON r.id_pasajero = u.id_usuario
      WHERE v.id_conductor = $1 
      AND r.estado IN ('Pendiente', 'Aceptada')
      ORDER BY 
        CASE r.estado 
          WHEN 'Pendiente' THEN 1 
          WHEN 'Aceptada' THEN 2 
        END,
        r.fecha_reserva DESC
    `;
    const result = await pool.query(query, [id_conductor]);
    return result.rows;
  }
};