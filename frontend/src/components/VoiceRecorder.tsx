import React, { useState } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';
import { useVoiceRecorder } from '../hooks/useVoiceRecorder';
import { voiceNotesApi } from '../services/api';

interface VoiceRecorderProps {
  onRecordingComplete: () => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onRecordingComplete }) => {
  const [title, setTitle] = useState('');
  const [editableTranscript, setEditableTranscript] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const {
    isRecording,
    audioBlob,
    transcript,
    duration,
    startRecording,
    stopRecording,
    resetRecording,
  } = useVoiceRecorder();

  // Update editable transcript when the hook transcript changes
  React.useEffect(() => {
    setEditableTranscript(transcript);
  }, [transcript]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpload = async () => {
    if (!audioBlob || !title.trim() || !editableTranscript.trim()) {
      alert('Please provide a title, record audio, and ensure transcript is available');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.wav');
      formData.append('title', title);
      formData.append('transcript', editableTranscript);
      formData.append('duration', duration.toString());

      await voiceNotesApi.upload(formData);

      // Reset form
      setTitle('');
      setEditableTranscript('');
      resetRecording();
      onRecordingComplete();

    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload voice note. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="voice-recorder">
      <h2>Record Voice Note</h2>

      <div className="input-group">
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title"
          disabled={isUploading}
        />
      </div>

      <div className="recording-controls">
        {!isRecording && !audioBlob && (
          <button onClick={startRecording} className="record-btn">
            <Mic size={20} /> Start Recording
          </button>
        )}

        {isRecording && (
          <div className="recording-status">
            <button onClick={stopRecording} className="stop-btn">
              <Square size={20} /> Stop Recording
            </button>
            <span className="duration">Duration: {formatDuration(duration)}</span>
          </div>
        )}

        {audioBlob && !isRecording && (
          <div className="recording-complete">
            <div className="audio-info">
              <span>Recording complete - Duration: {formatDuration(duration)}</span>
              <audio controls src={URL.createObjectURL(audioBlob)} />
            </div>

            <div className="transcript-section">
              <label htmlFor="transcript">Transcript:</label>
              <textarea
                id="transcript"
                value={editableTranscript}
                onChange={(e) => setEditableTranscript(e.target.value)}
                placeholder="Transcript will appear here automatically, or you can type manually..."
                rows={4}
                className="transcript-input"
              />
            </div>

            <div className="action-buttons">
              <button
                onClick={handleUpload}
                disabled={isUploading || !title.trim() || !editableTranscript.trim()}
                className="upload-btn"
              >
                {isUploading ? 'Uploading...' : 'Save Voice Note'}
              </button>

              <button onClick={resetRecording} className="reset-btn">
                <Trash2 size={20} /> Discard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceRecorder;