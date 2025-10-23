import Joi from 'joi';

export const vehiculoSchema = Joi.object({
  placa: Joi.string()
    .min(6)
    .max(10)
    .required()
    .messages({
      'string.empty': 'La placa es obligatoria.',
      'string.min': 'La placa debe tener al menos 6 caracteres.',
      'string.max': 'La placa no debe superar los 10 caracteres.'
    }),
  marca: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'La marca es obligatoria.',
      'string.min': 'La marca debe tener al menos 2 caracteres.',
      'string.max': 'La marca no debe superar los 50 caracteres.'
    }),
  modelo: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'El modelo es obligatorio.',
      'string.min': 'El modelo debe tener al menos 2 caracteres.',
      'string.max': 'El modelo no debe superar los 50 caracteres.'
    }),
  capacidad: Joi.number()
    .integer()
    .min(1)
    .max(20)
    .required()
    .messages({
      'number.base': 'La capacidad debe ser un número.',
      'number.integer': 'La capacidad debe ser un número entero.',
      'number.min': 'La capacidad debe ser al menos 1.',
      'number.max': 'La capacidad no debe superar 20 pasajeros.'
    }),
  foto: Joi.string().optional()
});
