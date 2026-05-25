const express = require('express');
const router = express.Router();
const supabase = require('../db');

router.post('/play', async (req, res) => {
  try {
    const { track_id, user_id } = req.body;
    if (!track_id) return res.status(400).json({ error: 'track_id is required' });
    const { error } = await supabase.from('plays').insert({
      track_id,
      user_id: user_id || null,
      played_at: new Date().toISOString(),
    });
    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/tracks/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const { data, error } = await supabase
      .from('plays')
      .select('track_id, count, tracks:track_id(title, artists!inner(name), cover_url)')
      .order('count', { ascending: false })
      .limit(limit);
    if (error) throw error;
    res.json(data || []);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/tracks/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { count, error } = await supabase
      .from('plays')
      .select('*', { count: 'exact', head: true })
      .eq('track_id', id);
    if (error) throw error;
    const { data: unique } = await supabase
      .from('plays')
      .select('user_id', { count: 'exact', head: true })
      .eq('track_id', id)
      .not('user_id', 'is', null);
    res.json({ track_id: parseInt(id), plays: count || 0, unique_listeners: unique || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    const { count: totalPlays, error } = await supabase
      .from('plays')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', id);
    if (error) throw error;
    const { data: recentTracks } = await supabase
      .from('plays')
      .select('track_id, tracks!inner(title, artists(name))')
      .eq('user_id', id)
      .order('played_at', { ascending: false })
      .limit(5);
    res.json({ user_id: id, total_plays: totalPlays || 0, recent_tracks: recentTracks || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/overview', async (req, res) => {
  try {
    const { count: totalPlays } = await supabase
      .from('plays')
      .select('*', { count: 'exact', head: true });
    const { count: uniqueTracks } = await supabase
      .from('plays')
      .select('track_id', { count: 'exact', head: true });
    const { count: uniqueUsers } = await supabase
      .from('plays')
      .select('user_id', { count: 'exact', head: true })
      .not('user_id', 'is', null);
    const { data: topTrack } = await supabase
      .from('plays')
      .select('track_id, count, tracks!inner(title)')
      .order('count', { ascending: false })
      .limit(1);
    res.json({
      total_plays: totalPlays || 0,
      unique_tracks_played: uniqueTracks || 0,
      unique_listeners: uniqueUsers || 0,
      most_played_track: topTrack?.[0] || null,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
