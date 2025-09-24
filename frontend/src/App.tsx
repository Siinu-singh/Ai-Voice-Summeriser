import React, { useState } from 'react';
import { Mic, Heart } from 'lucide-react';
import VoiceRecorder from './components/VoiceRecorder';
import VoiceNotesList from './components/VoiceNotesList';
import './App.css';

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRecordingComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1><Mic className="inline-icon" /> Voice Notes with AI Summarization</h1>
        <p>Record voice notes, get automatic transcriptions, and generate AI summaries</p>
      </header>

      <main className="App-main">
        <VoiceRecorder onRecordingComplete={handleRecordingComplete} />
        <VoiceNotesList refreshTrigger={refreshTrigger} />
      </main>

      <footer className="App-footer">
        <p>Made by Suraj <Heart className="inline-icon" /></p>
      </footer>
    </div>
  );
}

export default App;
