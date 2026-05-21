import api from './api';
import type { LoginPayload, RegisterPayload } from '@/types/auth.types';

export const authApi = {
    register: (data: RegisterPayload) =>
        api.post('/auth/register', data),

    login: (data: LoginPayload) =>
        api.post('/auth/login', data),

    getMe: () =>
        api.get('/auth/me'),

    updateProfile: (data: FormData) =>
        api.put('/auth/update-profile', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    changePassword: (data: { currentPassword: string; newPassword: string }) =>
        api.put('/auth/change-password', data),
};
