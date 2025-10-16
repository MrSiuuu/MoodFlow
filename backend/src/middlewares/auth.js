import { supabase } from '../lib/supabase.js';
import { logger } from '../lib/logger.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification manquant' });
    }

    const token = authHeader.substring(7);
    
    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      logger.warn('Token invalide', { error: error?.message });
      return res.status(401).json({ error: 'Token invalide' });
    }

    // Ajouter l'utilisateur à la requête
    req.user = user;
    req.authToken = token;
    
    next();
  } catch (error) {
    logger.error('Erreur d\'authentification', { error: error.message });
    res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};
