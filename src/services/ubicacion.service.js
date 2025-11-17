import { UbicacionRepository } from '../repositories/ubicacion.repository.js';

export const UbicacionService = {
  async listarUbicaciones() {
    return await UbicacionRepository.listarUbicaciones();
  },

  async crearUbicacion(nombre) {
    
    const existente = await UbicacionRepository.buscarPorNombre(nombre);
    if (existente) {
      throw new Error('La ubicación ya existe');
    }

  
    if (!nombre || nombre.trim().length < 3) {
      throw new Error('El nombre de la ubicación debe tener al menos 3 caracteres');
    }

    if (nombre.trim().length > 100) {
      throw new Error('El nombre de la ubicación no puede superar los 100 caracteres');
    }

    return await UbicacionRepository.crearUbicacion(nombre.trim());
  },

  async buscarOCrearUbicacion(nombre) {
 
    const existente = await UbicacionRepository.buscarPorNombre(nombre);
    if (existente) {
      return existente;
    }

   
    return await this.crearUbicacion(nombre);
  }
};