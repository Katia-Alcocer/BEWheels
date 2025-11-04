import Joi from 'joi';

export const usuarioSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .required()
    .messages({
      'string.empty': 'El nombre es obligatorio.',
      'string.min': 'El nombre debe tener al menos 3 caracteres.',
      'string.max': 'El nombre no debe superar los 100 caracteres.'
    }),
  id_universitario: Joi.string()
    .alphanum()
    .min(5)
    .max(20)
    .required()
    .messages({
      'string.empty': 'El ID universitario es obligatorio.',
      'string.alphanum': 'El ID universitario solo puede contener letras y números.',
      'string.min': 'El ID universitario debe tener al menos 5 caracteres.',
      'string.max': 'El ID universitario no debe superar los 20 caracteres.'
    }),
  correo: Joi.string()
    .email({ tlds: { allow: false } })
    .pattern(/^[^@\s]+@unisabana\.edu\.co$/)
    .required()
    .messages({
      'string.empty': 'El correo es obligatorio.',
      'string.email': 'El correo debe ser un correo electrónico válido.',
      'string.pattern.base': 'El correo debe terminar en @unisabana.edu.co.'
    }),
  telefono: Joi.string()
    .min(7)
    .max(15)
    .required()
    .messages({
      'string.empty': 'El teléfono es obligatorio.',
      'string.min': 'El teléfono debe tener al menos 7 dígitos.',
      'string.max': 'El teléfono no debe superar los 15 dígitos.'
    }),
  contrasena: Joi.string()
    .min(8)
    .required()
    .messages({
      'string.empty': 'La contraseña es obligatoria.',
      'string.min': 'La contraseña debe tener al menos 8 caracteres.'
    }),
  foto_perfil: Joi.string().optional(),
});

export const usuarioUpdateSchema = Joi.object({
  nombre: Joi.string()
    .min(3)
    .max(100)
    .optional()
    .messages({
      'string.min': 'El nombre debe tener al menos 3 caracteres.',
      'string.max': 'El nombre no debe superar los 100 caracteres.'
    }),
  id_universitario: Joi.string()
    .alphanum()
    .min(5)
    .max(20)
    .optional()
    .messages({
      'string.alphanum': 'El ID universitario solo puede contener letras y números.',
      'string.min': 'El ID universitario debe tener al menos 5 caracteres.',
      'string.max': 'El ID universitario no debe superar los 20 caracteres.'
    }),
  telefono: Joi.string()
    .min(7)
    .max(15)
    .optional()
    .messages({
      'string.min': 'El teléfono debe tener al menos 7 dígitos.',
      'string.max': 'El teléfono no debe superar los 15 dígitos.'
    }),
  foto_perfil: Joi.string().optional()
}).unknown(true);
