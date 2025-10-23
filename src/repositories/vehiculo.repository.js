import { pool } from '../config/db.config.js';

export const VehiculoRepository = {
  async crearVehiculo({ placa, marca, modelo, capacidad, foto, id_usuario }) {
    const query = `
      INSERT INTO Vehiculos (placa, marca, modelo, capacidad, foto, id_usuario)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_vehiculo, placa, marca, modelo, capacidad, foto, id_usuario, fecha_registro;
    `;
    const values = [placa, marca, modelo, capacidad, foto, id_usuario];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async buscarPorIdUsuario(id_usuario) {
    const query = 'SELECT * FROM Vehiculos WHERE id_usuario = $1 ORDER BY fecha_registro DESC';
    const result = await pool.query(query, [id_usuario]);
    return result.rows;
  },

  async buscarPorId(id) {
    const query = 'SELECT * FROM Vehiculos WHERE id_vehiculo = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  },

  async actualizarVehiculo(id, datosVehiculo) {
    const { placa, marca, modelo, capacidad, foto } = datosVehiculo;
    const query = `
      UPDATE Vehiculos 
      SET placa = $1, marca = $2, modelo = $3, capacidad = $4, foto = $5
      WHERE id_vehiculo = $6
      RETURNING *;
    `;
    const values = [placa, marca, modelo, capacidad, foto, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async eliminarVehiculo(id) {
    const query = 'DELETE FROM Vehiculos WHERE id_vehiculo = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
};
