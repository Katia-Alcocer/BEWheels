import Joi from 'joi';

export const viajeSchema = Joi.object({
  origen: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'El origen es obligatorio.',
      'string.min': 'El origen debe tener al menos 2 caracteres.',
      'string.max': 'El origen no debe superar los 100 caracteres.'
    }),
  destino: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.empty': 'El destino es obligatorio.',
      'string.min': 'El destino debe tener al menos 2 caracteres.',
      'string.max': 'El destino no debe superar los 100 caracteres.'
    }),
  fecha_salida: Joi.date()
    .greater('now')
    .required()
    .messages({
      'date.base': 'La fecha de salida debe ser una fecha válida.',
      'date.greater': 'La fecha de salida debe ser futura.'
    }),
  cupos_totales: Joi.number()
    .integer()
    .min(1)
    .max(6)
    .required()
    .messages({
      'number.base': 'Los cupos deben ser un número.',
      'number.integer': 'Los cupos deben ser un número entero.',
      'number.min': 'Los cupos deben ser al menos 1.',
      'number.max': 'Los cupos no deben superar 6 pasajeros.'
    }),
  tarifa: Joi.number()
    .min(1000)
    .required()
    .messages({
      'number.base': 'La tarifa debe ser un número.',
      'number.min': 'La tarifa mínima es $1,000.'
    }),
  id_vehiculo: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El vehículo es obligatorio.',
      'number.integer': 'El ID del vehículo debe ser un número entero.'
    })
});
