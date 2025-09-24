# Voice Notes with AI Summarization

A full-stack MERN application that allows users to record voice notes, automatically transcribe them using the Web Speech API, and generate AI-powered summaries using Google's Gemini 1.5 Flash model.

## Features

- **Voice Recording**: Record voice notes directly in the browser
- **Automatic Transcription**: Uses Web Speech API for real-time speech-to-text conversion
- **AI Summarization**: Generate concise summaries using Google Gemini 1.5 Flash
- **CRUD Operations**: Create, read, update, and delete voice notes
- **Smart Summary Management**: Summary regeneration when transcripts are edited
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Audio Playback**: Listen to recorded notes anytime

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Custom Hooks** for voice recording
- **Axios** for API communication
- **CSS3** with modern styling and animations

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Google Gemini AI** (for summarization)
- **Multer** for file uploads
- **CORS** for cross-origin requests

## Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas)
- Google Gemini API key

## Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd voiceAi
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

Edit the `.env` file with your configurations:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voicenotes
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Setup

Make sure MongoDB is running on your system:

**For local MongoDB:**
```bash
# Start MongoDB service
brew services start mongodb/brew/mongodb-community
# or
sudo systemctl start mongod
```

**For MongoDB Atlas:**
- Update the `MONGODB_URI` in your `.env` file with your Atlas connection string

### 5. Google Gemini API Setup

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env` file as `GEMINI_API_KEY`

## Running the Application

### Start the Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

### Start the Frontend Application
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

## API Endpoints

### Voice Notes
- `GET /api/voice-notes` - Get all voice notes
- `GET /api/voice-notes/:id` - Get a specific voice note
- `POST /api/voice-notes/upload` - Upload and transcribe a voice note
- `PUT /api/voice-notes/:id` - Update a voice note
- `DELETE /api/voice-notes/:id` - Delete a voice note
- `POST /api/voice-notes/:id/summarize` - Generate AI summary

## Usage

1. **Record a Voice Note**:
   - Enter a title for your note
   - Click "Start Recording" and speak
   - The transcript will appear automatically as you speak (if Web Speech API is supported)
   - Click "Stop Recording" when done
   - Review and edit the transcript if needed
   - Click "Save Voice Note" to save

2. **View Your Notes**:
   - All notes appear in a grid layout
   - Each card shows title, audio player, transcript, and summary (if generated)

3. **Edit Notes**:
   - Click the edit button on any note
   - Modify the title or transcript
   - Save changes

4. **Generate Summaries**:
   - Click "Generate Summary" on any note
   - The AI will create a concise summary
   - Button becomes disabled until transcript is edited again

5. **Delete Notes**:
   - Click the delete button on any note
   - Confirm deletion in the popup

## Key Features Implementation

### Smart Summary Logic
- Summary button is enabled only when no summary exists or transcript has been edited
- When transcript is edited, existing summary is cleared and button re-enables
- Summary generation uses GPT-3.5 for concise, relevant summaries

### Error Handling
- Microphone access permission handling
- Network error management
- File upload validation
- User-friendly error messages

### Responsive Design
- Mobile-first approach
- Flexible grid layout
- Touch-friendly buttons
- Optimized for different screen sizes

## Deployment

### Frontend (Vercel/Netlify)
1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `build` folder to your hosting platform

### Backend (Heroku/Railway/DigitalOcean)
1. Set environment variables on your hosting platform
2. Deploy the backend code
3. Update the API base URL in frontend (`src/services/api.ts`)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Acknowledgments

- OpenAI for Whisper and GPT APIs
- React team for the amazing framework
- MongoDB for the database solution
- All contributors and testers

---

Built with love for the MERN + GenAI assignment