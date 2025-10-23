import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.config.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'No autorizado: Token no proporcionado' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'No autorizado: Token inválido o expirado' });
    req.user = user;
    next();
  });
};
