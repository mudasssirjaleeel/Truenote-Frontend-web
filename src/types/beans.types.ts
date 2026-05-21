// types/bean.types.ts

export interface GrindOption {
    id: string;
    beanId: string;
    grind: string;
}

export interface PurchasePlan {
    id: string;
    beanId: string;
    plan: string;
    discount: number | null;
    description: string | null;
}

export interface Bean {
    id: string;
    name: string;
    origin: string;
    weight: number;
    price: number;
    description: string | null;
    isDark: boolean;
    isAvailable: boolean;
    imageUrl: string | null;
    imageUrls: string[];
    grindOptions: GrindOption[];
    purchasePlans: PurchasePlan[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateBeanPayload {
    name: string;
    origin: string;
    weight: number;
    price: number;
    description?: string;
    isDark?: boolean;
    grindOptions?: string[];
    purchasePlans?: Array<{
        plan: string;
        discount?: number;
        description?: string;
    }>;
    imageUrl?: string;
    images?: File[]; // For file upload
}

export interface UpdateBeanPayload extends Partial<CreateBeanPayload> {
    id: string;
    isAvailable?: boolean;
}

export interface BeansApiResponse {
    data: Bean[];
    page: number;
    limit: number;
    total: number;
}

export interface BeanApiResponse {
    data: Bean;
}

export interface BeanFilters {
    search?: string;
    page?: number;
    limit?: number;
}