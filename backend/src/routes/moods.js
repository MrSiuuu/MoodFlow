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
  weather: z.object({
    emoji: z.string().optional(),
    condition: z.string().optional(),
    label: z.string().optional(),
    temperature: z.number().optional(),
    humidity: z.number().optional()
  }).optional(),
  // Champs bonus
  tags: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  sleep_hours: z.number().min(0).max(24).optional(),
  energy_level: z.number().int().min(1).max(5).optional(),
  stress_level: z.number().int().min(1).max(5).optional(),
  location: z.object({
    name: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional()
  }).optional()
});

const moodUpdateSchema = z.object({
  score: z.number().int().min(1).max(5).optional(),
  label: z.string().optional(),
  note: z.string().max(2000).optional(),
  weather: z.object({
    emoji: z.string().optional(),
    condition: z.string().optional(),
    label: z.string().optional(),
    temperature: z.number().optional(),
    humidity: z.number().optional()
  }).optional(),
  // Champs bonus
  tags: z.array(z.string()).optional(),
  activities: z.array(z.string()).optional(),
  sleep_hours: z.number().min(0).max(24).optional(),
  energy_level: z.number().int().min(1).max(5).optional(),
  stress_level: z.number().int().min(1).max(5).optional(),
  location: z.object({
    name: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional()
  }).optional()
});

// Fonction pour calculer automatiquement la catégorie selon le score
const getCategoryFromScore = (score) => {
  const categoryMap = {
    1: 'tres_triste',
    2: 'triste',
    3: 'neutre',
    4: 'content',
    5: 'tres_content'
  };
  return categoryMap[score] || 'neutre';
};

// GET /api/moods?from=YYYY-MM-DD&to=YYYY-MM-DD
router.get('/', async (req, res) => {
  try {
    const { from, to } = req.query;
    
    if (!from || !to) {
      return res.status(400).json({ error: 'Paramètres from et to requis' });
    }

    // Valider les dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
    
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ error: 'Format de date invalide' });
    }

    const supabase = getSupabaseClient(req.authToken);

    const { data: moods, error } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', req.user.id)
      .gte('mood_date', from)
      .lte('mood_date', to)
      .order('mood_date', { ascending: true });

    if (error) {
      logger.error('Erreur récupération humeurs', { error: error.message, userId: req.user.id });
      return res.status(500).json({ error: 'Erreur lors de la récupération des humeurs' });
    }

    res.json(moods || []);
  } catch (error) {
    logger.error('Erreur route GET /moods', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// POST /api/moods
router.post('/', async (req, res) => {
  try {
    const validatedData = moodEntrySchema.parse(req.body);
    const supabase = getSupabaseClient(req.authToken);

    // Vérifier s'il existe déjà une humeur pour cette date
    const { data: existingMood, error: checkError } = await supabase
      .from('mood_entries')
      .select('id')
      .eq('user_id', req.user.id)
      .eq('mood_date', validatedData.mood_date)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      logger.error('Erreur vérification doublon', { error: checkError.message });
      return res.status(500).json({ error: 'Erreur lors de la vérification' });
    }

    if (existingMood) {
      return res.status(409).json({ 
        error: 'Une humeur existe déjà pour cette date',
        existing_id: existingMood.id
      });
    }

    // Calculer automatiquement la catégorie selon le score
    const category = getCategoryFromScore(validatedData.score);
    
    // Préparer les données à insérer
    const insertData = {
      user_id: req.user.id,
      mood_date: validatedData.mood_date,
      score: validatedData.score,
      category: category, // Calculé automatiquement
      label: validatedData.label || null,
      note: validatedData.note || null,
      weather: validatedData.weather || {},
      tags: validatedData.tags || [],
      activities: validatedData.activities || [],
      sleep_hours: validatedData.sleep_hours || null,
      energy_level: validatedData.energy_level || null,
      stress_level: validatedData.stress_level || null,
      location: validatedData.location || {}
    };

    // Insérer la nouvelle humeur
    const { data: newMood, error: insertError } = await supabase
      .from('mood_entries')
      .insert([insertData])
      .select()
      .single();

    if (insertError) {
      logger.error('Erreur insertion humeur', { error: insertError.message });
      return res.status(500).json({ error: 'Erreur lors de la création de l\'humeur' });
    }

    logger.info('Humeur créée', { 
      userId: req.user.id, 
      moodId: newMood.id, 
      date: validatedData.mood_date 
    });

    res.status(201).json(newMood);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: error.errors 
      });
    }
    
    logger.error('Erreur route POST /moods', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// PATCH /api/moods/:id
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = moodUpdateSchema.parse(req.body);
    const supabase = getSupabaseClient(req.authToken);

    // Vérifier que l'humeur appartient à l'utilisateur
    const { data: existingMood, error: checkError } = await supabase
      .from('mood_entries')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Humeur non trouvée' });
      }
      logger.error('Erreur vérification humeur', { error: checkError.message });
      return res.status(500).json({ error: 'Erreur lors de la vérification' });
    }

    // Préparer les données de mise à jour
    const updateData = {
      ...validatedData
    };
    
    // Si le score change, recalculer la catégorie
    if (validatedData.score !== undefined) {
      updateData.category = getCategoryFromScore(validatedData.score);
    }

    // Mettre à jour l'humeur
    const { data: updatedMood, error: updateError } = await supabase
      .from('mood_entries')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (updateError) {
      logger.error('Erreur mise à jour humeur', { error: updateError.message });
      return res.status(500).json({ error: 'Erreur lors de la mise à jour' });
    }

    logger.info('Humeur mise à jour', { 
      userId: req.user.id, 
      moodId: id 
    });

    res.json(updatedMood);
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ 
        error: 'Données invalides', 
        details: error.errors 
      });
    }
    
    logger.error('Erreur route PATCH /moods/:id', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// DELETE /api/moods/:id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const supabase = getSupabaseClient(req.authToken);

    // Vérifier que l'humeur appartient à l'utilisateur et la supprimer
    const { error: deleteError } = await supabase
      .from('mood_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (deleteError) {
      logger.error('Erreur suppression humeur', { error: deleteError.message });
      return res.status(500).json({ error: 'Erreur lors de la suppression' });
    }

    logger.info('Humeur supprimée', { 
      userId: req.user.id, 
      moodId: id 
    });

    res.status(204).send();
  } catch (error) {
    logger.error('Erreur route DELETE /moods/:id', { error: error.message });
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;