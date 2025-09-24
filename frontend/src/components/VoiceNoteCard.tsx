import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { VoiceNote } from '../types';
import { voiceNotesApi } from '../services/api';

interface VoiceNoteCardProps {
  note: VoiceNote;
  onUpdate: (updatedNote: VoiceNote) => void;
  onDelete: (deletedId: string) => void;
}

const VoiceNoteCard: React.FC<VoiceNoteCardProps> = ({ note, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editTranscript, setEditTranscript] = useState(note.transcript);
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSave = async () => {
    if (!editTitle.trim() || !editTranscript.trim()) {
      alert('Title and transcript cannot be empty');
      return;
    }

    setIsLoading(true);
    try {
      const response = await voiceNotesApi.update(note._id, {
        title: editTitle.trim(),
        transcript: editTranscript.trim()
      });

      if (response.voiceNote) {
        onUpdate(response.voiceNote);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(note.title);
    setEditTranscript(note.transcript);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this voice note?')) {
      return;
    }

    setIsLoading(true);
    try {
      await voiceNotesApi.delete(note._id);
      onDelete(note._id);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete note');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    try {
      const response = await voiceNotesApi.generateSummary(note._id);
      if (response.voiceNote) {
        onUpdate(response.voiceNote);
      }
    } catch (error) {
      console.error('Summary error:', error);
      alert('Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerateSummary = !note.hasSummary || note.isTranscriptEdited;

  return (
    <div className="voice-note-card">
      <div className="card-header">
        {isEditing ? (
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="edit-title"
            disabled={isLoading}
          />
        ) : (
          <h3>{note.title}</h3>
        )}

        <div className="card-actions">
          {!isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-btn"
                disabled={isLoading}
              >
                <Edit size={16} />
              </button>
              <button
                onClick={handleDelete}
                className="delete-btn"
                disabled={isLoading}
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="card-content">
        <div className="audio-section">
          <audio
            controls
            src={`${process.env.NODE_ENV === 'production'
              ? 'https://voicenotes-backend-jdex.onrender.com'
              : 'http://localhost:5000'}/${note.audioFilePath}`}
            className="audio-player"
          />
          <span className="duration">Duration: {formatDuration(note.duration)}</span>
        </div>

        <div className="transcript-section">
          <h4>Transcript:</h4>
          {isEditing ? (
            <textarea
              value={editTranscript}
              onChange={(e) => setEditTranscript(e.target.value)}
              className="edit-transcript"
              rows={4}
              disabled={isLoading}
            />
          ) : (
            <p className="transcript">{note.transcript}</p>
          )}
        </div>

        {note.summary && (
          <div className="summary-section">
            <h4>Summary:</h4>
            <p className="summary">{note.summary}</p>
          </div>
        )}

        <div className="card-footer">
          {isEditing ? (
            <div className="edit-actions">
              <button
                onClick={handleSave}
                className="save-btn"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={handleCancel}
                className="cancel-btn"
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="note-actions">
              {canGenerateSummary && (
                <button
                  onClick={handleGenerateSummary}
                  className="summary-btn"
                  disabled={isLoading}
                >
                  {isLoading ? 'Generating...' : 'Generate Summary'}
                </button>
              )}

              <span className="date">
                Created: {formatDate(note.createdAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceNoteCard;