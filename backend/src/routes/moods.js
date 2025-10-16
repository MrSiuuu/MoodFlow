import express from 'express';
import { z } from 'zod';
import { getSupabaseClient } from '../lib/supabase.js';
import { logger } from '../lib/logger.js';

const router = express.Router();

// Schémas de validation
const moodEntrySchema = z.object({
  mood_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide (YYYY-MM-DD)'),
  score: z.number().int().min(1).max(5),
  label: z.string().optional(),
  note: z.string().max(2000).optional(),
  weather: z.object({}).optional()
});

const moodUpdateSchema = z.object({
  score: z.number().int().min(1).max(5).optional(),
  label: z.string().optional(),
  note: z.string().max(2000).optional(),
  weather: z.object({}).optional()
});

// GET /api/moods?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    const supabase = getSupabaseClient(req.authToken);

    let query = supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', req.user.id)
      .order('mood_date', { ascending: true });

    if (from) {
      query = query.gte('mood_date', from);
    }
    if (to) {
      query = query.lte('mood_date', to);
    }

    const { data, error } = await query;

    if (error) {
      logger.error('Erreur récupération humeurs', { error: error.message });
      return res.status(500).json({ error: 'Erreur lors de la récupération des humeurs' });
    }

    res.json(data || []);
  } catch (error) {
    logger.error('Erreur route GET moods', { error: error.message });
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// POST /api/moods
router.post('/', async (req, res) => {
  try {
    const validatedData = moodEntrySchema.parse(req.body);
    const supabase = getSupabaseClient(req.authToken);

    const { data, error } = await supabase
      .from('mood_entries')
      .insert({
        user_id: req.user.id,
        ...validatedData
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Contrainte unique violée
        return res.status(409).json({ error: 'Une humeur existe déjà pour cette date' });
      }
      logger.error('Erreur création humeur', { error: error.message });
      return res.status(500).json({ error: 'Erreur lors de la création de l\'humeur' });
    }

    res.status(201).json(data);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Données invalides', details: error.errors });
    }
    logger.error('Erreur route POST moods', { error: error.message });
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// PATCH /api/moods/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = moodUpdateSchema.parse(req.body);
    const supabase = getSupabaseClient(req.authToken);

    const { data, error } = await supabase
      .from('mood_entries')
      .update(validatedData)
      .eq('id', id)
      .eq('user_id', req.user.id) // Sécurité : s'assurer que l'utilisateur possède cette entrée
      .select()
      .single();

    if (error) {
      logger.error('Erreur mise à jour humeur', { error: error.message });
      return res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'humeur' });
    }

    if (!data) {
      return res.status(404).json({ error: 'Humeur non trouvée' });
    }

    res.json(data);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Données invalides', details: error.errors });
    }
    logger.error('Erreur route PATCH moods', { error: error.message });
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

// DELETE /api/moods/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient(req.authToken);

    const { error } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id); // Sécurité : s'assurer que l'utilisateur possède cette entrée

    if (error) {
      logger.error('Erreur suppression humeur', { error: error.message });
      return res.status(500).json({ error: 'Erreur lors de la suppression de l\'humeur' });
    }

    res.status(204).send();
  } catch (error) {
    logger.error('Erreur route DELETE moods', { error: error.message });
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

export default router;
