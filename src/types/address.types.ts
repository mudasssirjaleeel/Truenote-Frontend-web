// types/address.types.ts

export interface Address {
    id: string;
    label: string;
    street: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAddressPayload {
    label: string;
    street: string;
    city: string;
    postalCode: string;
    isDefault?: boolean;
}

export interface UpdateAddressPayload {
    label?: string;
    street?: string;
    city?: string;
    postalCode?: string;
    isDefault?: boolean;
}

export interface AddressesResponse {
    addresses: Address[];
}

export interface AddressResponse {
    address: Address;
}

export interface DeleteAddressResponse {
    success: boolean;
}