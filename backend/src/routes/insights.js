import express from 'express';
import { getSupabaseClient } from '../lib/supabase.js';
import { logger } from '../lib/logger.js';

const router = express.Router();

// GET /api/insights/week
router.get('/week', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.authToken);

    // Calculer la semaine en cours (lundi au dimanche)
    const now = new Date();
    const dayOfWeek = now.getDay();
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek + 1);
    monday.setHours(0, 0, 0, 0);
    
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const startDate = monday.toISOString().split('T')[0];
    const endDate = sunday.toISOString().split('T')[0];

    // Récupérer les humeurs de la semaine
    const { data: moods, error: moodsError } = await supabase
      .from('mood_entries')
      .select('score, mood_date')
      .eq('user_id', req.user.id)
      .gte('mood_date', startDate)
      .lte('mood_date', endDate)
      .order('mood_date', { ascending: true });

    if (moodsError) {
      logger.error('Erreur récupération humeurs pour insights', { 
        error: moodsError.message, 
        userId: req.user.id 
      });
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    // Calculer les statistiques
    let insights = {
      avg: 0,
      min: 0,
      max: 0,
      count: 0,
      histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      week_start: startDate,
      week_end: endDate,
      moods: moods || []
    };

    if (moods && moods.length > 0) {
      const scores = moods.map(m => m.score);
      
      // Calculs de base
      insights.avg = Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100;
      insights.min = Math.min(...scores);
      insights.max = Math.max(...scores);
      insights.count = scores.length;

      // Histogramme
      scores.forEach(score => {
        insights.histogram[score] = (insights.histogram[score] || 0) + 1;
      });

      // Tendance (comparaison avec la semaine précédente)
      const previousMonday = new Date(monday);
      previousMonday.setDate(monday.getDate() - 7);
      const previousSunday = new Date(sunday);
      previousSunday.setDate(sunday.getDate() - 7);

      const prevStartDate = previousMonday.toISOString().split('T')[0];
      const prevEndDate = previousSunday.toISOString().split('T')[0];

      const { data: prevMoods, error: prevError } = await supabase
        .from('mood_entries')
        .select('score')
        .eq('user_id', req.user.id)
        .gte('mood_date', prevStartDate)
        .lte('mood_date', prevEndDate);

      if (!prevError && prevMoods && prevMoods.length > 0) {
        const prevScores = prevMoods.map(m => m.score);
        const prevAvg = prevScores.reduce((sum, score) => sum + score, 0) / prevScores.length;
        
        insights.trend = insights.avg > prevAvg ? 'up' : insights.avg < prevAvg ? 'down' : 'stable';
        insights.trend_difference = Math.round((insights.avg - prevAvg) * 100) / 100;
      } else {
        insights.trend = 'new';
        insights.trend_difference = 0;
      }
    } else {
      insights.trend = 'new';
      insights.trend_difference = 0;
    }

    logger.info('Insights hebdomadaires générés', { 
      userId: req.user.id, 
      count: insights.count,
      avg: insights.avg 
    });

    res.json(insights);
  } catch (error) {
    logger.error('Erreur route GET /insights/week', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/insights/month
router.get('/month', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.authToken);

    // Calculer le mois en cours
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];

    // Récupérer les humeurs du mois
    const { data: moods, error: moodsError } = await supabase
      .from('mood_entries')
      .select('score, mood_date')
      .eq('user_id', req.user.id)
      .gte('mood_date', startDate)
      .lte('mood_date', endDate)
      .order('mood_date', { ascending: true });

    if (moodsError) {
      logger.error('Erreur récupération humeurs mensuelles', { 
        error: moodsError.message, 
        userId: req.user.id 
      });
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    // Calculer les statistiques mensuelles
    let insights = {
      avg: 0,
      min: 0,
      max: 0,
      count: 0,
      histogram: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      month_start: startDate,
      month_end: endDate,
      moods: moods || [],
      weekly_breakdown: []
    };

    if (moods && moods.length > 0) {
      const scores = moods.map(m => m.score);
      
      // Statistiques générales
      insights.avg = Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100;
      insights.min = Math.min(...scores);
      insights.max = Math.max(...scores);
      insights.count = scores.length;

      // Histogramme
      scores.forEach(score => {
        insights.histogram[score] = (insights.histogram[score] || 0) + 1;
      });

      // Répartition par semaine
      const weeklyData = {};
      moods.forEach(mood => {
        const date = new Date(mood.mood_date);
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay() + 1);
        const weekKey = weekStart.toISOString().split('T')[0];
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = [];
        }
        weeklyData[weekKey].push(mood.score);
      });

      insights.weekly_breakdown = Object.entries(weeklyData).map(([week, scores]) => ({
        week_start: week,
        avg: Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100,
        count: scores.length
      })).sort((a, b) => a.week_start.localeCompare(b.week_start));
    }

    logger.info('Insights mensuels générés', { 
      userId: req.user.id, 
      count: insights.count,
      avg: insights.avg 
    });

    res.json(insights);
  } catch (error) {
    logger.error('Erreur route GET /insights/month', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;