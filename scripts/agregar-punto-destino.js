import { pool } from '../src/config/db.config.js';

async function agregarPuntoDestino() {
  try {
    console.log('🔄 Agregando columna punto_destino a la tabla Reservas...');
    
    // Verificar si la columna ya existe
    const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'reservas' AND column_name = 'punto_destino'
    `);
    
    if (checkColumn.rows.length > 0) {
      console.log('ℹ️  La columna punto_destino ya existe en la tabla Reservas');
      return;
    }
    
    // Agregar la columna
    await pool.query('ALTER TABLE Reservas ADD COLUMN punto_destino VARCHAR(100)');
    
    console.log('✅ Columna punto_destino agregada exitosamente a la tabla Reservas');
    
    // Verificar que se agregó correctamente
    const verify = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'reservas' AND column_name = 'punto_destino'
    `);
    
    console.log('📋 Información de la nueva columna:', verify.rows[0]);
    
  } catch (err) {
    console.error('❌ Error al agregar columna punto_destino:', err);
  } finally {
    await pool.end();
  }
}

agregarPuntoDestino();