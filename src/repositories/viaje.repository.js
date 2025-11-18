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

  async listarViajesDisponibles(filtros, id_usuario_actual = null) {
    let query = `
      SELECT v.*, u.nombre as nombre_conductor, ve.marca, ve.modelo, ve.placa, ve.foto
      FROM Viajes v
      JOIN Usuarios u ON v.id_conductor = u.id_usuario
      JOIN Vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
      WHERE v.estado = 'Activo' AND v.cupos_disponibles > 0
      AND v.fecha_salida >= NOW()
    `;
    const values = [];
    let paramCount = 1;

    // TEMPORALMENTE COMENTADO: Excluir viajes del propio usuario
    // if (id_usuario_actual) {
    //   query += ` AND v.id_conductor != $${paramCount}`;
    //   values.push(id_usuario_actual);
    //   paramCount++;
    // }

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
      SELECT v.*, ve.marca, ve.modelo, ve.placa, ve.foto
      FROM Viajes v
      JOIN Vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
      WHERE v.id_conductor = $1
      AND v.fecha_salida >= NOW()
      ORDER BY v.fecha_salida DESC
    `;
    const result = await pool.query(query, [id_conductor]);
    return result.rows;
  },

  async obtenerViaje(id) {
    const query = `
      SELECT v.*, u.nombre as nombre_conductor, u.telefono, ve.marca, ve.modelo, ve.placa, ve.foto
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
      WHERE id_viaje = $1 AND estado IN ('Activo', 'Lleno')
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async puedeModificarViaje(id_viaje) {
    const query = `
      SELECT *, 
        EXTRACT(EPOCH FROM (fecha_salida - NOW())) / 60 as minutos_restantes
      FROM Viajes 
      WHERE id_viaje = $1
    `;
    const result = await pool.query(query, [id_viaje]);
    const viaje = result.rows[0];
    
    if (!viaje) return { puede: false, razon: 'Viaje no encontrado' };
    
    if (!['Activo', 'Lleno'].includes(viaje.estado)) {
      return { puede: false, razon: 'El viaje no está disponible para modificaciones' };
    }
    
    if (viaje.minutos_restantes <= 15) {
      return { puede: false, razon: 'Solo se puede cancelar el viaje si faltan más de 15 minutos para la salida' };
    }
    
    return { puede: true, viaje };
  },

  async completarViaje(id) {
    const query = `
      UPDATE Viajes 
      SET estado = 'Completado'
      WHERE id_viaje = $1 AND estado IN ('Activo', 'Lleno')
      RETURNING *;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async buscarViajeActivoPorConductor(id_conductor) {
    // Primero actualizar viajes vencidos
    await this.verificarYActualizarViajesVencidos();
    
    const query = `
      SELECT * FROM Viajes 
      WHERE id_conductor = $1 
      AND estado IN ('Activo', 'Lleno')
      AND fecha_salida >= NOW()
      ORDER BY fecha_creacion DESC
      LIMIT 1
    `;
    const result = await pool.query(query, [id_conductor]);
    return result.rows[0];
  },

  async actualizarCuposDisponibles(id_viaje, nuevos_cupos) {
    const query = `
      UPDATE Viajes 
      SET cupos_disponibles = $2
      WHERE id_viaje = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [id_viaje, nuevos_cupos]);
    return result.rows[0];
  },

  async marcarViajeComoLleno(id_viaje) {
    const query = `
      UPDATE Viajes 
      SET estado = 'Lleno'
      WHERE id_viaje = $1 AND estado = 'Activo'
      RETURNING *;
    `;
    const result = await pool.query(query, [id_viaje]);
    return result.rows[0];
  },

  async actualizarViajesVencidos() {
    // Primero cancelar automáticamente viajes que están a menos de 15 minutos
    const queryCancelar = `
      UPDATE Viajes 
      SET estado = 'Cancelado'
      WHERE estado IN ('Activo', 'Lleno') 
      AND fecha_salida > NOW()
      AND EXTRACT(EPOCH FROM (fecha_salida - NOW())) / 60 <= 15
      RETURNING id_viaje, origen, destino, fecha_salida, estado;
    `;
    const resultCancelar = await pool.query(queryCancelar);
    
    // Luego marcar como expirados los viajes que ya pasaron
    const queryExpirados = `
      UPDATE Viajes 
      SET estado = 'Expirado'
      WHERE estado IN ('Activo', 'Lleno') 
      AND fecha_salida < NOW()
      RETURNING id_viaje, origen, destino, fecha_salida, estado;
    `;
    const resultExpirados = await pool.query(queryExpirados);
    
    // Combinar resultados
    return [...resultCancelar.rows, ...resultExpirados.rows];
  },

  async verificarYActualizarViajesVencidos() {
    // Actualizamos los viajes vencidos y cancelamos los que están a menos de 15 minutos
    const viajesActualizados = await this.actualizarViajesVencidos();
    
    if (viajesActualizados.length > 0) {
      const cancelados = viajesActualizados.filter(v => v.estado === 'Cancelado');
      const expirados = viajesActualizados.filter(v => v.estado === 'Expirado');
      
      if (cancelados.length > 0) {
        console.log(`✅ ${cancelados.length} viajes cancelados automáticamente (menos de 15 minutos)`);
        cancelados.forEach(viaje => {
          console.log(`   - Viaje ${viaje.id_viaje}: ${viaje.origen} → ${viaje.destino} (${viaje.fecha_salida})`);
        });
      }
      
      if (expirados.length > 0) {
        console.log(`✅ ${expirados.length} viajes marcados como expirados automáticamente`);
        expirados.forEach(viaje => {
          console.log(`   - Viaje ${viaje.id_viaje}: ${viaje.origen} → ${viaje.destino} (${viaje.fecha_salida})`);
        });
      }
    }
    
    return viajesActualizados;
  }
};
