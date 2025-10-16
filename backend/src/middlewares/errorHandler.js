import { logger } from '../lib/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Erreur serveur', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip
  });

  // Erreur de validation Zod
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Données invalides',
      details: err.errors
    });
  }

  // Erreur Supabase
  if (err.code && err.code.startsWith('PGRST')) {
    return res.status(400).json({
      error: 'Erreur de base de données',
      message: err.message
    });
  }

  // Erreur par défaut
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Erreur interne du serveur' 
    : err.message;

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
