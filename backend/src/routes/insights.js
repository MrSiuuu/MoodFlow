import express from 'express';
import { getSupabaseClient } from '../lib/supabase.js';
import { logger } from '../lib/logger.js';

const router = express.Router();

// GET /api/insights/week
router.get('/week', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.authToken);
    
    // Calculer le début et la fin de la semaine courante
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Dimanche
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Samedi
    endOfWeek.setHours(23, 59, 59, 999);

    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    // Récupérer les humeurs de la semaine
    const { data: moods, error } = await supabase
      .from('mood_entries')
      .select('score')
      .eq('user_id', req.user.id)
      .gte('mood_date', startDate)
      .lte('mood_date', endDate);

    if (error) {
      logger.error('Erreur récupération insights', { error: error.message });
      return res.status(500).json({ error: 'Erreur lors du calcul des insights' });
    }

    if (!moods || moods.length === 0) {
      return res.json({
        avg: 0,
        min: 0,
        max: 0,
        count: 0,
        histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    // Calculer les statistiques
    const scores = moods.map(m => m.score);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);

    // Calculer l'histogramme
    const histogram = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    scores.forEach(score => {
      histogram[score]++;
    });

    res.json({
      avg: Math.round(avg * 100) / 100, // Arrondir à 2 décimales
      min,
      max,
      count: scores.length,
      histogram,
      period: {
        start: startDate,
        end: endDate
      }
    });
  } catch (error) {
    logger.error('Erreur route insights week', { error: error.message });
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// GET /api/insights/month
router.get('/month', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.authToken);
    
    // Calculer le début et la fin du mois courant
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startDate = startOfMonth.toISOString().split('T')[0];
    const endDate = endOfMonth.toISOString().split('T')[0];

    // Récupérer les humeurs du mois
    const { data: moods, error } = await supabase
      .from('mood_entries')
      .select('score, mood_date')
      .eq('user_id', req.user.id)
      .gte('mood_date', startDate)
      .lte('mood_date', endDate)
      .order('mood_date', { ascending: true });

    if (error) {
      logger.error('Erreur récupération insights mois', { error: error.message });
      return res.status(500).json({ error: 'Erreur lors du calcul des insights mensuels' });
    }

    if (!moods || moods.length === 0) {
      return res.json({
        avg: 0,
        min: 0,
        max: 0,
        count: 0,
        histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
        trends: []
      });
    }

    // Calculer les statistiques
    const scores = moods.map(m => m.score);
    const avg = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const min = Math.min(...scores);
    const max = Math.max(...scores);

    // Calculer l'histogramme
    const histogram = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    scores.forEach(score => {
      histogram[score]++;
    });

    // Calculer les tendances par semaine
    const trends = [];
    const weeks = {};
    
    moods.forEach(mood => {
      const date = new Date(mood.mood_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(mood.score);
    });

    Object.keys(weeks).sort().forEach(weekKey => {
      const weekScores = weeks[weekKey];
      const weekAvg = weekScores.reduce((sum, score) => sum + score, 0) / weekScores.length;
      trends.push({
        week: weekKey,
        avg: Math.round(weekAvg * 100) / 100,
        count: weekScores.length
      });
    });

    res.json({
      avg: Math.round(avg * 100) / 100,
      min,
      max,
      count: scores.length,
      histogram,
      trends,
      period: {
        start: startDate,
        end: endDate
      }
    });
  } catch (error) {
    logger.error('Erreur route insights month', { error: error.message });
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
