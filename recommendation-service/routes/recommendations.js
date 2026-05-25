const express = require('express');
const router = express.Router();
const supabase = require('../db');
const auth = require('../auth');

router.use(auth);

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const limit = parseInt(req.query.limit) || 6;

    const { data: favorites } = await supabase
      .from('favorites')
      .select('track_id, tracks!inner(genre, artist_id)')
      .eq('user_id', userId);

    if (!favorites || favorites.length === 0) {
      const { data: recentTracks } = await supabase
        .from('tracks')
        .select('id, title, cover_url, artists(name)')
        .order('created_at', { ascending: false })
        .limit(limit);
      return res.json({ recommendations: recentTracks || [], based_on: 'recent' });
    }

    const genreCounts = {};
    const artistCounts = {};
    const favoritedIds = [];

    favorites.forEach(f => {
      favoritedIds.push(f.track_id);
      const genre = f.tracks?.genre;
      const artistId = f.tracks?.artist_id;
      if (genre) genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      if (artistId) artistCounts[artistId] = (artistCounts[artistId] || 0) + 1;
    });

    const topGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topArtist = Object.entries(artistCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

    let query = supabase
      .from('tracks')
      .select('id, title, cover_url, genre, artist_id, artists(name)')
      .not('id', 'in', `(${favoritedIds.join(',')})`)
      .limit(limit);

    if (topGenre) {
      query = query.eq('genre', topGenre);
    } else if (topArtist) {
      query = query.eq('artist_id', topArtist);
    }

    let { data: recommendations } = await query;

    if (!recommendations || recommendations.length < limit) {
      const { data: fallback } = await supabase
        .from('tracks')
        .select('id, title, cover_url, artists(name)')
        .not('id', 'in', `(${favoritedIds.join(',')})`)
        .order('created_at', { ascending: false })
        .limit(limit);
      recommendations = recommendations || [];
      fallback?.forEach(t => {
        if (!recommendations.find(r => r.id === t.id)) {
          recommendations.push(t);
        }
      });
      recommendations = recommendations.slice(0, limit);
    }

    res.json({ recommendations: recommendations || [], based_on: topGenre ? 'genre' : 'artist' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/track/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params;
    const limit = parseInt(req.query.limit) || 5;

    const { data: track } = await supabase
      .from('tracks')
      .select('genre, artist_id')
      .eq('id', trackId)
      .single();

    if (!track) return res.status(404).json({ error: 'Track not found' });

    let query = supabase
      .from('tracks')
      .select('id, title, cover_url, artists(name)')
      .neq('id', trackId)
      .limit(limit);

    if (track.genre) query = query.eq('genre', track.genre);
    else if (track.artist_id) query = query.eq('artist_id', track.artist_id);

    const { data: similar } = await query;
    res.json({ track_id: parseInt(trackId), similar: similar || [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
