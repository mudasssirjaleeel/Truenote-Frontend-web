// services/beanService.ts
import api from './api';
import type {
    Bean,
    CreateBeanPayload,
    UpdateBeanPayload,
    BeanFilters,
    BeansApiResponse,
    BeanApiResponse
} from '../types/beans.types';

export const beanApi = {
    // Public endpoints
    getAll: (params?: BeanFilters) =>
        api.get<BeansApiResponse>('/beans', { params }),

    getOne: (id: string) =>
        api.get<BeanApiResponse>(`/beans/${id}`),

    // Admin endpoints
    create: async (data: CreateBeanPayload) => {
        // If there are files, use FormData
        if (data.images && data.images.length > 0) {
            const formData = new FormData();

            // Add all text fields
            formData.append('name', data.name);
            formData.append('origin', data.origin);
            formData.append('weight', data.weight.toString());
            formData.append('price', data.price.toString());

            if (data.description) formData.append('description', data.description);
            if (data.isDark !== undefined) formData.append('isDark', String(data.isDark));

            // Handle grindOptions (array to JSON string)
            if (data.grindOptions && data.grindOptions.length > 0) {
                formData.append('grindOptions', JSON.stringify(data.grindOptions));
            }

            // Handle purchasePlans (array to JSON string)
            if (data.purchasePlans && data.purchasePlans.length > 0) {
                formData.append('purchasePlans', JSON.stringify(data.purchasePlans));
            }

            // Append images
            data.images.forEach((image) => {
                formData.append('images', image);
            });

            return api.post<BeanApiResponse>('/beans', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
        // If no files, send as JSON (with imageUrl if provided)
        else {
            const payload: any = {
                name: data.name,
                origin: data.origin,
                weight: data.weight,
                price: data.price,
            };

            if (data.description) payload.description = data.description;
            if (data.isDark !== undefined) payload.isDark = data.isDark;
            if (data.imageUrl) payload.imageUrl = data.imageUrl;
            if (data.grindOptions) payload.grindOptions = data.grindOptions;
            if (data.purchasePlans) payload.purchasePlans = data.purchasePlans;

            return api.post<BeanApiResponse>('/beans', payload);
        }
    },

    update: async ({ id, ...data }: UpdateBeanPayload) => {
        // If there are files, use FormData
        if (data.images && data.images.length > 0) {
            const formData = new FormData();

            // Add all text fields that are provided
            if (data.name !== undefined) formData.append('name', data.name);
            if (data.origin !== undefined) formData.append('origin', data.origin);
            if (data.weight !== undefined) formData.append('weight', data.weight.toString());
            if (data.price !== undefined) formData.append('price', data.price.toString());
            if (data.description !== undefined) formData.append('description', data.description);
            if (data.isDark !== undefined) formData.append('isDark', String(data.isDark));
            if (data.isAvailable !== undefined) formData.append('isAvailable', String(data.isAvailable));

            if (data.grindOptions && data.grindOptions.length > 0) {
                formData.append('grindOptions', JSON.stringify(data.grindOptions));
            }

            if (data.purchasePlans && data.purchasePlans.length > 0) {
                formData.append('purchasePlans', JSON.stringify(data.purchasePlans));
            }

            // Append new images
            data.images.forEach((image) => {
                formData.append('images', image);
            });

            return api.put<BeanApiResponse>(`/beans/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        }
        // If no files, send as JSON
        else {
            const payload: any = {};
            if (data.name !== undefined) payload.name = data.name;
            if (data.origin !== undefined) payload.origin = data.origin;
            if (data.weight !== undefined) payload.weight = data.weight;
            if (data.price !== undefined) payload.price = data.price;
            if (data.description !== undefined) payload.description = data.description;
            if (data.isDark !== undefined) payload.isDark = data.isDark;
            if (data.isAvailable !== undefined) payload.isAvailable = data.isAvailable;
            if (data.imageUrl) payload.imageUrl = data.imageUrl;
            if (data.grindOptions) payload.grindOptions = data.grindOptions;
            if (data.purchasePlans) payload.purchasePlans = data.purchasePlans;

            return api.put<BeanApiResponse>(`/beans/${id}`, payload);
        }
    },

    delete: (id: string) =>
        api.delete<{ success: boolean }>(`/beans/${id}`),

    
};