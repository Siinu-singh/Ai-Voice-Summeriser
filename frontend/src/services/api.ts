import axios from 'axios';
import { VoiceNote, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const voiceNotesApi = {
  getAll: async (): Promise<VoiceNote[]> => {
    const response = await api.get('/voice-notes');
    return response.data;
  },

  getById: async (id: string): Promise<VoiceNote> => {
    const response = await api.get(`/voice-notes/${id}`);
    return response.data;
  },

  upload: async (formData: FormData): Promise<ApiResponse<VoiceNote>> => {
    const response = await api.post('/voice-notes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  update: async (id: string, data: { title?: string; transcript?: string }): Promise<ApiResponse<VoiceNote>> => {
    const response = await api.put(`/voice-notes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/voice-notes/${id}`);
    return response.data;
  },

  generateSummary: async (id: string): Promise<ApiResponse<VoiceNote>> => {
    const response = await api.post(`/voice-notes/${id}/summarize`);
    return response.data;
  },
};