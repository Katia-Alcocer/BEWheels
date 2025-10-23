import { RolService } from '../services/rol.service.js';

export const RolController = {
  async getRolesByUserId(req, res) {
    try {
      const { id_usuario } = req.params;
      const roles = await RolService.getRolesByUserId(id_usuario);
      return res.json({ roles });
    } catch (error) {
      console.error('Error en getRolesByUserId:', error);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};
