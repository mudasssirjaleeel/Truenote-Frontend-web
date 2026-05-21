import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../../services/authService";
import type {
  User,
  LoginPayload,
  RegisterPayload,
} from "../../types/auth.types";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

// ─────────────────────────────────────────
//  ASYNC THUNKS
//  Each thunk = one API call
//  pending   → loading = true
//  fulfilled → data saved to state
//  rejected  → error message saved to state
// ─────────────────────────────────────────

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data: RegisterPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.register(data);
      return res.data; // { message, user, token }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Registration failed",
      );
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authApi.login(data);
      console.log("Login API response:", res.data);

      // Transform the response to handle both 'token' and 'accessToken'
      return {
        user: res.data.user,
        token: res.data.accessToken || res.data.token, // Use accessToken if available
        refreshToken: res.data.refreshToken,
      };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const res = await authApi.getMe();
      return res.data; // { user }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch user",
      );
    }
  },
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (
    data: { name?: string; email?: string; phone?: string; avatar?: File },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();

      if (data.name) formData.append("name", data.name);
      if (data.email) formData.append("email", data.email);
      if (data.phone) formData.append("phone", data.phone);
      if (data.avatar) formData.append("avatar", data.avatar);

      const res = await authApi.updateProfile(formData);
      return res.data; // { user }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Update failed");
    }
  },
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    data: { currentPassword: string; newPassword: string },
    { rejectWithValue },
  ) => {
    try {
      const res = await authApi.changePassword(data);
      return res.data; // { message }
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Password change failed",
      );
    }
  },
);

// ─────────────────────────────────────────
//  SLICE
// ─────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("User logged out, localStorage cleared");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // ── Register ──
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Login ──
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;

        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload.user));
          console.log("✅ Token stored in localStorage:", action.payload.token);
          console.log("✅ User stored:", action.payload.user);
          console.log("✅ Permissions:", action.payload.user?.permissions);
        } else {
          console.error("❌ No token received from API!", action.payload);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("Login rejected:", action.payload);
      });

    // ── Fetch Me ──
    builder
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
      });

    // ── Update Profile ──
    builder
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // ── Change Password ──
    builder
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state: any) => state.auth.user;
export const selectPermissions = (state: any) =>
  state.auth.user?.permissions || [];
export const selectUserRole = (state: any) =>
  state.auth.user?.roleName || state.auth.user?.role;
export const selectIsAdmin = (state: any) => {
  const user = state.auth.user;
  if (!user) return false;
  const role = user.roleName || user.role;
  return role === "super_admin" || role === "admin";
};
