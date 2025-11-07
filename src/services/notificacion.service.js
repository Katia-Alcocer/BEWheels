import { NotificacionRepository } from '../repositories/notificacion.repository.js';

export const NotificacionService = {
  async enviarNotificacion(datosNotificacion) {
    try {
      return await NotificacionRepository.crearNotificacion(datosNotificacion);
    } catch (error) {
      console.error('Error enviando notificación:', error);
      // No fallar el proceso principal si falla la notificación
      return null;
    }
  },

  async listarNotificaciones(id_usuario) {
    return await NotificacionRepository.listarNotificacionesPorUsuario(id_usuario);
  },

  async marcarComoLeida(id_notificacion, id_usuario) {
    return await NotificacionRepository.marcarComoLeida(id_notificacion, id_usuario);
  },

  async marcarTodasComoLeidas(id_usuario) {
    return await NotificacionRepository.marcarTodasComoLeidas(id_usuario);
  },

  async contarNoLeidas(id_usuario) {
    return await NotificacionRepository.contarNoLeidas(id_usuario);
  }
};