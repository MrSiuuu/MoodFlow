import express from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { logger } from '../lib/logger.js';

const router = express.Router();

// Middleware pour vérifier le rôle admin
const requireAdmin = async (req, res, next) => {
  try {
    // Vérifier le rôle de l'utilisateur
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      logger.warn('Profil non trouvé', { userId: req.user.id });
      return res.status(403).json({ error: 'Accès refusé' });
    }

    if (profile.role !== 'admin') {
      logger.warn('Tentative accès admin non autorisé', { userId: req.user.id, role: profile.role });
      return res.status(403).json({ error: 'Droits administrateur requis' });
    }

    next();
  } catch (error) {
    logger.error('Erreur vérification admin', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// GET /api/admin/stats - Statistiques globales
router.get('/stats', requireAdmin, async (req, res) => {
  try {
    // Compter total utilisateurs
    const { count: totalUsers, error: usersError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      logger.error('Erreur comptage users', { error: usersError.message });
      return res.status(500).json({ error: 'Erreur récupération stats' });
    }

    // Compter total humeurs
    const { count: totalMoodEntries, error: moodsError } = await supabaseAdmin
      .from('mood_entries')
      .select('*', { count: 'exact', head: true });

    if (moodsError) {
      logger.error('Erreur comptage moods', { error: moodsError.message });
      return res.status(500).json({ error: 'Erreur récupération stats' });
    }

    // Nouveaux users aujourd'hui
    const today = new Date().toISOString().split('T')[0];
    const { count: newUsersToday } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today);

    // Humeurs aujourd'hui
    const { count: entriesToday } = await supabaseAdmin
      .from('mood_entries')
      .select('*', { count: 'exact', head: true })
      .eq('mood_date', today);

    // Moyenne globale des humeurs
    const { data: avgData } = await supabaseAdmin
      .from('mood_entries')
      .select('score');

    let averageMood = 0;
    if (avgData && avgData.length > 0) {
      const scores = avgData.map(m => m.score);
      averageMood = (scores.reduce((sum, s) => sum + s, 0) / scores.length).toFixed(1);
    }

    // Utilisateurs actifs 7 derniers jours
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString();

    const { data: activeMoodsData } = await supabaseAdmin
      .from('mood_entries')
      .select('user_id')
      .gte('created_at', sevenDaysAgoStr);

    const activeUsers7d = activeMoodsData 
      ? new Set(activeMoodsData.map(m => m.user_id)).size 
      : 0;

    // Réponse
    res.json({
      totalUsers: totalUsers || 0,
      newUsersToday: newUsersToday || 0,
      totalMoodEntries: totalMoodEntries || 0,
      entriesToday: entriesToday || 0,
      averageMood: averageMood,
      activeUsers7d: activeUsers7d
    });

  } catch (error) {
    logger.error('Erreur route admin stats', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/mood-distribution - Distribution des humeurs (anonymisée)
router.get('/mood-distribution', requireAdmin, async (req, res) => {
  try {
    const { data: moods, error } = await supabaseAdmin
      .from('mood_entries')
      .select('score, category');

    if (error) {
      logger.error('Erreur distribution humeurs', { error: error.message });
      return res.status(500).json({ error: 'Erreur récupération distribution' });
    }

    // Calculer distribution
    const distribution = {
      byScore: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      byCategory: {
        tres_triste: 0,
        triste: 0,
        neutre: 0,
        content: 0,
        tres_content: 0
      }
    };

    moods.forEach(mood => {
      distribution.byScore[mood.score] = (distribution.byScore[mood.score] || 0) + 1;
      if (mood.category) {
        distribution.byCategory[mood.category] = (distribution.byCategory[mood.category] || 0) + 1;
      }
    });

    res.json(distribution);
  } catch (error) {
    logger.error('Erreur route mood distribution', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/activity-timeline - Activité sur 30 jours (anonymisée)
router.get('/activity-timeline', requireAdmin, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];

    const { data: moods, error } = await supabaseAdmin
      .from('mood_entries')
      .select('mood_date, created_at')
      .gte('mood_date', startDate)
      .order('mood_date', { ascending: true });

    if (error) {
      logger.error('Erreur timeline', { error: error.message });
      return res.status(500).json({ error: 'Erreur récupération timeline' });
    }

    // Grouper par jour
    const dailyCounts = {};
    moods.forEach(mood => {
      const day = mood.mood_date;
      dailyCounts[day] = (dailyCounts[day] || 0) + 1;
    });

    // Convertir en array
    const timeline = Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      count
    })).sort((a, b) => a.date.localeCompare(b.date));

    res.json(timeline);
  } catch (error) {
    logger.error('Erreur route timeline', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/users-overview - Liste utilisateurs (RGPD: emails hashés)
router.get('/users-overview', requireAdmin, async (req, res) => {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from('profiles')
      .select('id, email, display_name, role, created_at')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      logger.error('Erreur users overview', { error: error.message });
      return res.status(500).json({ error: 'Erreur récupération users' });
    }

    // Pour chaque user, compter ses humeurs
    const usersWithStats = await Promise.all(
      profiles.map(async (profile) => {
        const { count: moodCount } = await supabaseAdmin
          .from('mood_entries')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        // Dernière activité
        const { data: lastMood } = await supabaseAdmin
          .from('mood_entries')
          .select('created_at')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // RGPD: Masquer partiellement l'email (ex: j***@gmail.com)
        const emailParts = profile.email.split('@');
        const maskedEmail = emailParts[0].charAt(0) + '***@' + emailParts[1];

        return {
          id: profile.id,
          email: maskedEmail,  // Email masqué pour RGPD
          display_name: profile.display_name || 'Utilisateur',
          role: profile.role,
          created_at: profile.created_at,
          last_activity: lastMood?.created_at || profile.created_at,
          mood_entries_count: moodCount || 0
        };
      })
    );

    res.json(usersWithStats);
  } catch (error) {
    logger.error('Erreur route users overview', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// GET /api/admin/health-check - Vérifier état système
router.get('/health-check', requireAdmin, async (req, res) => {
  try {
    // Tester connexion Supabase
    const { error: dbError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .limit(1);

    const dbStatus = dbError ? 'error' : 'operational';

    // Tester OpenAI (si clé configurée)
    let aiStatus = 'not_configured';
    if (process.env.OPENAI_API_KEY) {
      aiStatus = 'operational';  // Simplifi pour l'instant
    }

    res.json({
      database: {
        status: dbStatus,
        message: dbError ? dbError.message : 'Connexion OK'
      },
      api: {
        status: 'operational',
        uptime: process.uptime(),
        memory: process.memoryUsage()
      },
      ai: {
        status: aiStatus,
        provider: 'OpenAI'
      }
    });
  } catch (error) {
    logger.error('Erreur health check', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

