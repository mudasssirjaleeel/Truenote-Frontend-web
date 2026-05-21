// services/addressService.ts
import api from './api';
import type {
    Address,
    CreateAddressPayload,
    UpdateAddressPayload,
    AddressesResponse,
    AddressResponse,
    DeleteAddressResponse
} from '@/types/address.types';

class AddressService {
    private readonly basePath = '/user/addresses';

    /**
     * Get all addresses for current user
     */
    async getAddresses(): Promise<Address[]> {
        const response = await api.get<AddressesResponse>(this.basePath);
        return response.data.addresses;
    }

    /**
     * Add new address
     */
    async addAddress(payload: CreateAddressPayload): Promise<Address> {
        const response = await api.post<AddressResponse>(this.basePath, payload);
        return response.data.address;
    }

    /**
     * Update address
     */
    async updateAddress(id: string, payload: UpdateAddressPayload): Promise<Address> {
        const response = await api.patch<AddressResponse>(`${this.basePath}/${id}`, payload);
        return response.data.address;
    }

    /**
     * Delete address
     */
    async deleteAddress(id: string): Promise<void> {
        const response = await api.delete<DeleteAddressResponse>(`${this.basePath}/${id}`);
        if (!response.data.success) {
            throw new Error('Failed to delete address');
        }
    }

    /**
     * Format address for display
     */
    formatAddress(street: string, city: string, postalCode: string): string {
        return `${street}, ${city}${postalCode ? `, ${postalCode}` : ''}`;
    }
}

export const addressService = new AddressService();