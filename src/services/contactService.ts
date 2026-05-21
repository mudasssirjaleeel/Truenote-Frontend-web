// services/contactService.ts
import api from './api';
import type { 
    ContactFormData, 
    ContactSubmissionResponse,
    ContactSubmissionsResponse,
    ContactSubmission 
} from '@/types/contact.types';

export const contactService = {
    // Submit contact form (public)
    submitContactForm: async (data: ContactFormData): Promise<ContactSubmissionResponse> => {
        const response = await api.post('/contact/submit', data);
        return response.data;
    },

    // Get all submissions (admin only)
    getSubmissions: async (params?: { status?: string; page?: number; limit?: number }): Promise<ContactSubmissionsResponse> => {
        const response = await api.get('/contact/submissions', { params });
        return response.data;
    },

    // Get single submission (admin only)
    getSubmissionById: async (id: string): Promise<{ submission: ContactSubmission }> => {
        const response = await api.get(`/contact/submissions/${id}`);
        return response.data;
    },

    // Update submission status (admin only)
    updateSubmissionStatus: async (id: string, status: string): Promise<{ success: boolean; message: string; submission: ContactSubmission }> => {
        const response = await api.patch(`/contact/submissions/${id}/status`, { status });
        return response.data;
    },

    // Delete submission (admin only)
    deleteSubmission: async (id: string): Promise<{ success: boolean; message: string }> => {
        const response = await api.delete(`/contact/submissions/${id}`);
        return response.data;
    },
};