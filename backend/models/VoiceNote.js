const mongoose = require('mongoose');

const voiceNoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  audioFilePath: {
    type: String,
    required: true
  },
  transcript: {
    type: String,
    required: true
  },
  summary: {
    type: String,
    default: ''
  },
  hasSummary: {
    type: Boolean,
    default: false
  },
  isTranscriptEdited: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

voiceNoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('VoiceNote', voiceNoteSchema);