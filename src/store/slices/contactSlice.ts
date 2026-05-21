// store/slices/contactSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { contactService } from '@/services/contactService';
import type { ContactFormData, ContactSubmission } from '@/types/contact.types';

interface ContactState {
    submissions: ContactSubmission[];
    currentSubmission: ContactSubmission | null;
    loading: boolean;
    error: string | null;
    submitSuccess: boolean;
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

const initialState: ContactState = {
    submissions: [],
    currentSubmission: null,
    loading: false,
    error: null,
    submitSuccess: false,
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
    },
};

// Async Thunks
export const submitContactForm = createAsyncThunk(
    'contact/submit',
    async (formData: ContactFormData, { rejectWithValue }) => {
        try {
            const response = await contactService.submitContactForm(formData);
            console.log("contact:", response)
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to submit contact form');
        }
    }
);

export const fetchSubmissions = createAsyncThunk(
    'contact/fetchAll',
    async (params: { status?: string; page?: number; limit?: number } = {}, { rejectWithValue }) => {
        try {
            const response = await contactService.getSubmissions(params);
            return response;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch submissions');
        }
    }
);

export const fetchSubmissionById = createAsyncThunk(
    'contact/fetchOne',
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await contactService.getSubmissionById(id);
            return response.submission;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to fetch submission');
        }
    }
);

export const updateSubmissionStatus = createAsyncThunk(
    'contact/updateStatus',
    async ({ id, status }: { id: string; status: string }, { rejectWithValue }) => {
        try {
            const response = await contactService.updateSubmissionStatus(id, status);
            return response.submission;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to update status');
        }
    }
);

export const deleteSubmission = createAsyncThunk(
    'contact/delete',
    async (id: string, { rejectWithValue, dispatch }) => {
        try {
            await contactService.deleteSubmission(id);
            await dispatch(fetchSubmissions());
            return id;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.error?.message || 'Failed to delete submission');
        }
    }
);

const contactSlice = createSlice({
    name: 'contact',
    initialState,
    reducers: {
        clearContactError: (state) => {
            state.error = null;
        },
        clearSubmitSuccess: (state) => {
            state.submitSuccess = false;
        },
        clearCurrentSubmission: (state) => {
            state.currentSubmission = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Submit Contact Form
            .addCase(submitContactForm.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.submitSuccess = false;
            })
            .addCase(submitContactForm.fulfilled, (state) => {
                state.loading = false;
                state.submitSuccess = true;
            })
            .addCase(submitContactForm.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.submitSuccess = false;
            })

            // Fetch Submissions
            .addCase(fetchSubmissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.submissions = action.payload.submissions;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchSubmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Fetch Single Submission
            .addCase(fetchSubmissionById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubmissionById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentSubmission = action.payload;
            })
            .addCase(fetchSubmissionById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Update Submission Status
            .addCase(updateSubmissionStatus.fulfilled, (state, action) => {
                const index = state.submissions.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.submissions[index] = action.payload;
                }
                if (state.currentSubmission?.id === action.payload.id) {
                    state.currentSubmission = action.payload;
                }
            });
    },
});

export const { clearContactError, clearSubmitSuccess, clearCurrentSubmission } = contactSlice.actions;
export default contactSlice.reducer;