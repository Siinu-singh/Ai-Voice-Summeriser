import React, { useState, useEffect } from 'react';
import { VoiceNote } from '../types';
import { voiceNotesApi } from '../services/api';
import VoiceNoteCard from './VoiceNoteCard';

interface VoiceNotesListProps {
  refreshTrigger: number;
}

const VoiceNotesList: React.FC<VoiceNotesListProps> = ({ refreshTrigger }) => {
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVoiceNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const notes = await voiceNotesApi.getAll();
      setVoiceNotes(notes);
    } catch (error) {
      console.error('Fetch error:', error);
      setError('Failed to load voice notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoiceNotes();
  }, [refreshTrigger]);

  const handleNoteUpdate = (updatedNote: VoiceNote) => {
    setVoiceNotes(notes =>
      notes.map(note =>
        note._id === updatedNote._id ? updatedNote : note
      )
    );
  };

  const handleNoteDelete = (deletedId: string) => {
    setVoiceNotes(notes => notes.filter(note => note._id !== deletedId));
  };

  if (loading) {
    return <div className="loading">Loading voice notes...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (voiceNotes.length === 0) {
    return <div className="empty-state">No voice notes yet. Record your first note!</div>;
  }

  return (
    <div className="voice-notes-list">
      <h2>Your Voice Notes ({voiceNotes.length})</h2>
      <div className="notes-grid">
        {voiceNotes.map(note => (
          <VoiceNoteCard
            key={note._id}
            note={note}
            onUpdate={handleNoteUpdate}
            onDelete={handleNoteDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default VoiceNotesList;