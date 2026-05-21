// types/contact.types.ts
export interface ContactFormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface ContactSubmission {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: 'unread' | 'read' | 'replied' | 'archived';
    createdAt: string;
    updatedAt: string;
}

export interface ContactSubmissionResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
        subject: string;
        createdAt: string;
    };
}

export interface ContactSubmissionsResponse {
    submissions: ContactSubmission[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}