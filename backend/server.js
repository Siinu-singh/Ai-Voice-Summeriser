const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const voiceNotesRoutes = require('./routes/voiceNotes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'Voice Notes API Server is running!' });
});

app.use('/api/voice-notes', voiceNotesRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});