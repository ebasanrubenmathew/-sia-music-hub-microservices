const express = require('express');
const cors = require('cors');
require('dotenv').config();

const recommendationRoutes = require('./routes/recommendations');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ service: 'Music Hub Recommendation Service', status: 'running' });
});

app.use('/api/recommendations', recommendationRoutes);

app.listen(PORT, () => {
  console.log(`Recommendation service running on port ${PORT}`);
});
