const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const VoiceNote = require('../models/VoiceNote');

const router = express.Router();

let genAI;

if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
  console.log('[SUCCESS] Gemini AI initialized successfully');
} else {
  console.warn('[WARNING] GEMINI_API_KEY not set. Summarization features will not work.');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

router.post('/upload', upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No audio file uploaded' });
    }

    const { title, transcript } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    if (!transcript) {
      return res.status(400).json({ error: 'Transcript is required' });
    }

    const audioFilePath = req.file.path;

    const voiceNote = new VoiceNote({
      title,
      audioFilePath,
      transcript,
      duration: req.body.duration || 0
    });

    await voiceNote.save();

    res.status(201).json({
      message: 'Voice note uploaded successfully',
      voiceNote
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to process voice note' });
  }
});

router.get('/', async (req, res) => {
  try {
    const voiceNotes = await VoiceNote.find().sort({ createdAt: -1 });
    res.json(voiceNotes);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch voice notes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const voiceNote = await VoiceNote.findById(req.params.id);
    if (!voiceNote) {
      return res.status(404).json({ error: 'Voice note not found' });
    }
    res.json(voiceNote);
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch voice note' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, transcript } = req.body;
    const voiceNote = await VoiceNote.findById(req.params.id);

    if (!voiceNote) {
      return res.status(404).json({ error: 'Voice note not found' });
    }

    const wasTranscriptChanged = voiceNote.transcript !== transcript;

    voiceNote.title = title || voiceNote.title;
    voiceNote.transcript = transcript || voiceNote.transcript;

    if (wasTranscriptChanged) {
      voiceNote.isTranscriptEdited = true;
      voiceNote.summary = '';
      voiceNote.hasSummary = false;
    }

    await voiceNote.save();

    res.json({
      message: 'Voice note updated successfully',
      voiceNote
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update voice note' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const voiceNote = await VoiceNote.findById(req.params.id);

    if (!voiceNote) {
      return res.status(404).json({ error: 'Voice note not found' });
    }

    if (fs.existsSync(voiceNote.audioFilePath)) {
      fs.unlinkSync(voiceNote.audioFilePath);
    }

    await VoiceNote.findByIdAndDelete(req.params.id);

    res.json({ message: 'Voice note deleted successfully' });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete voice note' });
  }
});

router.post('/:id/summarize', async (req, res) => {
  try {
    const voiceNote = await VoiceNote.findById(req.params.id);

    if (!voiceNote) {
      return res.status(404).json({ error: 'Voice note not found' });
    }

    if (voiceNote.hasSummary && !voiceNote.isTranscriptEdited) {
      return res.status(400).json({ error: 'Summary already exists for this note' });
    }

    if (!genAI) {
      return res.status(500).json({ error: 'Gemini API not configured. Please set GEMINI_API_KEY environment variable.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Please create a concise summary of this voice note transcript. Keep the summary brief and capture the key points: "${voiceNote.transcript}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    voiceNote.summary = summary;
    voiceNote.hasSummary = true;
    voiceNote.isTranscriptEdited = false;

    await voiceNote.save();

    res.json({
      message: 'Summary generated successfully',
      voiceNote
    });

  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

module.exports = router;