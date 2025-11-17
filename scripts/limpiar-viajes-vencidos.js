import { pool } from '../src/config/db.config.js';

/**
 * Script para marcar como expirados los viajes que ya pasaron su fecha de salida
 */
async function limpiarViajesVencidos() {
  try {
    console.log(' Iniciando limpieza de viajes vencidos...');
    
    const query = `
      UPDATE Viajes 
      SET estado = 'Expirado'
      WHERE estado IN ('Activo', 'Lleno') 
      AND fecha_salida < NOW()
      RETURNING id_viaje, origen, destino, fecha_salida, estado;
    `;
    
    const result = await pool.query(query);
    const viajesActualizados = result.rows;
    
    if (viajesActualizados.length === 0) {
      console.log(' No hay viajes vencidos para actualizar');
    } else {
      console.log(` ${viajesActualizados.length} viajes marcados como expirados:`);
      viajesActualizados.forEach(viaje => {
        console.log(`   - Viaje ${viaje.id_viaje}: ${viaje.origen} → ${viaje.destino}`);
        console.log(`     Fecha de salida: ${viaje.fecha_salida}`);
        console.log(`     Estado actualizado a: ${viaje.estado}`);
        console.log('');
      });
    }
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error(' Error al limpiar viajes vencidos:', error);
    await pool.end();
    process.exit(1);
  }
}

// Ejecutar el script
limpiarViajesVencidos();