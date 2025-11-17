import { NotificacionRepository } from '../repositories/notificacion.repository.js';

export const NotificacionService = {
  async enviarNotificacion(datosNotificacion) {
    try {
      return await NotificacionRepository.crearNotificacion(datosNotificacion);
    } catch (error) {
      console.error('Error enviando notificación:', error);
      
      return null;
    }
  },

  async enviarNotificacionPersistente(datosNotificacion) {
    try {
      return await NotificacionRepository.crearNotificacion({
        ...datosNotificacion,
        es_persistente: true
      });
    } catch (error) {
      console.error('Error enviando notificación persistente:', error);
      return null;
    }
  },

  async listarNotificaciones(id_usuario) {
    return await NotificacionRepository.listarNotificacionesPorUsuario(id_usuario);
  },

  async listarNotificacionesNoLeidas(id_usuario) {
    return await NotificacionRepository.listarNotificacionesNoLeidas(id_usuario);
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