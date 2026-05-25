const express = require('express');
const cors = require('cors');
require('dotenv').config();

const analyticsRoutes = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ service: 'Music Hub Analytics Service', status: 'running' });
});

app.use('/api/analytics', analyticsRoutes);

app.listen(PORT, () => {
  console.log(`Analytics service running on port ${PORT}`);
});
