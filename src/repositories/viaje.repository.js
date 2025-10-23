import { pool } from '../config/db.config.js';

export const ViajeRepository = {
  async crearViaje({ origen, destino, fecha_salida, cupos_totales, tarifa, id_vehiculo, id_conductor }) {
    const query = `
      INSERT INTO Viajes (origen, destino, fecha_salida, cupos_totales, cupos_disponibles, tarifa, id_vehiculo, id_conductor, estado)
      VALUES ($1, $2, $3, $4, $4, $5, $6, $7, 'Activo')
      RETURNING id_viaje, origen, destino, fecha_salida, cupos_totales, cupos_disponibles, tarifa, id_vehiculo, id_conductor, estado, fecha_creacion;
    `;
    const values = [origen, destino, fecha_salida, cupos_totales, tarifa, id_vehiculo, id_conductor];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async listarViajesDisponibles(filtros) {
    let query = `
      SELECT v.*, u.nombre as nombre_conductor, ve.marca, ve.modelo, ve.placa
      FROM Viajes v
      JOIN Usuarios u ON v.id_conductor = u.id_usuario
      JOIN Vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
      WHERE v.estado = 'Activo' AND v.cupos_disponibles > 0
    `;
    const values = [];
    let paramCount = 1;

    if (filtros.origen) {
      query += ` AND v.origen ILIKE $${paramCount}`;
      values.push(`%${filtros.origen}%`);
      paramCount++;
    }

    if (filtros.destino) {
      query += ` AND v.destino ILIKE $${paramCount}`;
      values.push(`%${filtros.destino}%`);
      paramCount++;
    }

    if (filtros.fecha) {
      query += ` AND DATE(v.fecha_salida) = $${paramCount}`;
      values.push(filtros.fecha);
      paramCount++;
    }

    query += ` ORDER BY v.fecha_salida ASC`;

    const result = await pool.query(query, values);
    return result.rows;
  },

  async listarViajesPorConductor(id_conductor) {
    const query = `
      SELECT v.*, ve.marca, ve.modelo, ve.placa
      FROM Viajes v
      JOIN Vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
      WHERE v.id_conductor = $1
      ORDER BY v.fecha_salida DESC
    `;
    const result = await pool.query(query, [id_conductor]);
    return result.rows;
  },

  async obtenerViaje(id) {
    const query = `
      SELECT v.*, u.nombre as nombre_conductor, u.telefono, ve.marca, ve.modelo, ve.placa
      FROM Viajes v
      JOIN Usuarios u ON v.id_conductor = u.id_usuario
      JOIN Vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
      WHERE v.id_viaje = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async actualizarViaje(id, datosViaje) {
    const { origen, destino, fecha_salida, cupos_totales, tarifa, id_vehiculo } = datosViaje;
    const query = `
      UPDATE Viajes 
      SET origen = $1, destino = $2, fecha_salida = $3, cupos_totales = $4, tarifa = $5, id_vehiculo = $6
      WHERE id_viaje = $7 AND estado = 'Activo'
      RETURNING *;
    `;
    const values = [origen, destino, fecha_salida, cupos_totales, tarifa, id_vehiculo, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async cancelarViaje(id) {
    const query = `
      UPDATE Viajes 
      SET estado = 'Cancelado'
      WHERE id_viaje = $1 AND estado = 'Activo'
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};
