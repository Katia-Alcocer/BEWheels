import { NotificacionService } from '../services/notificacion.service.js';

export const NotificacionController = {
  async listarNotificaciones(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const notificaciones = await NotificacionService.listarNotificaciones(id_usuario);

      return res.json(notificaciones);
    } catch (err) {
      console.error(' Error al listar notificaciones:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  async listarNotificacionesNoLeidas(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const notificaciones = await NotificacionService.listarNotificacionesNoLeidas(id_usuario);

      return res.json(notificaciones);
    } catch (err) {
      console.error(' Error al listar notificaciones no leídas:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  async marcarComoLeida(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const { id_notificacion } = req.params;

      const notificacion = await NotificacionService.marcarComoLeida(parseInt(id_notificacion), id_usuario);

      if (!notificacion) {
        return res.status(404).json({ error: 'Notificación no encontrada' });
      }

      return res.json({
        message: 'Notificación marcada como leída',
        notificacion
      });
    } catch (err) {
      console.error(' Error al marcar notificación como leída:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  async marcarTodasComoLeidas(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const resultado = await NotificacionService.marcarTodasComoLeidas(id_usuario);

      return res.json({
        message: `${resultado.notificaciones_marcadas} notificaciones marcadas como leídas`,
        resultado
      });
    } catch (err) {
      console.error(' Error al marcar todas las notificaciones como leídas:', err);
      return res.status(500).json({ error: err.message });
    }
  },

  async contarNoLeidas(req, res) {
    try {
      const id_usuario = req.user?.id_usuario;
      if (!id_usuario) {
        return res.status(401).json({ error: 'No autorizado: token inválido' });
      }

      const count = await NotificacionService.contarNoLeidas(id_usuario);

      return res.json({ total_no_leidas: count });
    } catch (err) {
      console.error(' Error al contar notificaciones no leídas:', err);
      return res.status(500).json({ error: err.message });
    }
  }
};