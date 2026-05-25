const express = require('express');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/users');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ service: 'Music Hub User Management Service', status: 'running' });
});

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
