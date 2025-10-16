import express from 'express';
import { z } from 'zod';
import OpenAI from 'openai';
import { getSupabaseClient } from '../lib/supabase.js';
import { logger } from '../lib/logger.js';

const router = express.Router();

// Initialiser OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schémas de validation
const aiQuerySchema = z.object({
  message: z.string().min(1).max(1000),
  session_id: z.string().uuid().optional()
});

// POST /api/ai/query
router.post('/query', async (req, res) => {
  try {
    const validatedData = aiQuerySchema.parse(req.body);
    const supabase = getSupabaseClient(req.authToken);

    // Récupérer les 7 derniers jours de données de l'utilisateur
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const startDate = sevenDaysAgo.toISOString().split('T')[0];

    const { data: moods, error: moodsError } = await supabase
      .from('mood_entries')
      .select('score, label, note, mood_date')
      .eq('user_id', req.user.id)
      .gte('mood_date', startDate)
      .order('mood_date', { ascending: true });

    if (moodsError) {
      logger.error('Erreur récupération données IA', { error: moodsError.message });
      return res.status(500).json({ error: 'Erreur lors de la récupération des données' });
    }

    // Calculer les statistiques
    let stats = {};
    if (moods && moods.length > 0) {
      const scores = moods.map(m => m.score);
      stats = {
        avg: Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100) / 100,
        min: Math.min(...scores),
        max: Math.max(...scores),
        count: scores.length,
        recent_moods: moods.slice(-3) // 3 dernières humeurs
      };
    }

    // Construire le contexte pour l'IA
    const context = `
Contexte utilisateur MoodFlow (7 derniers jours):
- Nombre d'entrées: ${stats.count || 0}
- Moyenne: ${stats.avg || 'N/A'}
- Min/Max: ${stats.min || 'N/A'}/${stats.max || 'N/A'}
- Dernières humeurs: ${stats.recent_moods ? stats.recent_moods.map(m => `${m.mood_date}: ${m.score}/5 ${m.label ? `(${m.label})` : ''}`).join(', ') : 'Aucune'}

Instructions:
- Tu es un assistant bienveillant pour le suivi de l'humeur
- Réponds uniquement basé sur les données de cet utilisateur
- Sois encourageant et constructif
- Propose des conseils personnalisés
- Ne mentionne jamais d'autres utilisateurs
- Réponds en français
`;

    // Créer ou récupérer la session
    let sessionId = validatedData.session_id;
    if (!sessionId) {
      const { data: newSession, error: sessionError } = await supabase
        .from('ai_sessions')
        .insert({
          user_id: req.user.id,
          title: validatedData.message.substring(0, 50) + '...'
        })
        .select()
        .single();

      if (sessionError) {
        logger.error('Erreur création session IA', { error: sessionError.message });
        return res.status(500).json({ error: 'Erreur lors de la création de la session' });
      }
      sessionId = newSession.id;
    }

    // Appeler l'API OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: context
        },
        {
          role: "user",
          content: validatedData.message
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const reply = completion.choices[0].message.content;

    // Sauvegarder les messages
    const { error: messageError } = await supabase
      .from('ai_messages')
      .insert([
        {
          session_id: sessionId,
          user_id: req.user.id,
          role: 'user',
          content: validatedData.message
        },
        {
          session_id: sessionId,
          user_id: req.user.id,
          role: 'assistant',
          content: reply
        }
      ]);

    if (messageError) {
      logger.error('Erreur sauvegarde messages IA', { error: messageError.message });
      // Ne pas faire échouer la requête pour ça
    }

    res.json({
      reply,
      session_id: sessionId
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Données invalides', details: error.errors });
    }
    
    if (error.code === 'insufficient_quota') {
      return res.status(503).json({ error: 'Service IA temporairement indisponible' });
    }

    logger.error('Erreur route IA', { error: error.message });
    res.status(500).json({ error: 'Erreur lors du traitement de la requête IA' });
  }
});

// GET /api/ai/sessions
router.get('/sessions', async (req, res) => {
  try {
    const supabase = getSupabaseClient(req.authToken);

    const { data: sessions, error } = await supabase
      .from('ai_sessions')
      .select('id, title, created_at')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Erreur récupération sessions IA', { error: error.message });
      return res.status(500).json({ error: 'Erreur lors de la récupération des sessions' });
    }

    res.json(sessions || []);
  } catch (error) {
    logger.error('Erreur route sessions IA', { error: error.message });
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// GET /api/ai/sessions/:id/messages
router.get('/sessions/:id/messages', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient(req.authToken);

    const { data: messages, error } = await supabase
      .from('ai_messages')
      .select('role, content, created_at')
      .eq('session_id', id)
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: true });

    if (error) {
      logger.error('Erreur récupération messages IA', { error: error.message });
      return res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
    }

    res.json(messages || []);
  } catch (error) {
    logger.error('Erreur route messages IA', { error: error.message });
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
