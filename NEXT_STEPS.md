# Ascending Titans - Frontend + Laravel Backend Integration

## ✅ Completed (Do Not Repeat)

- [x] Project initialization and dependency setup
- [x] TypeScript strict mode configuration
- [x] Tailwind CSS theme configuration
- [x] Component library (15+ components)
- [x] Type system (25+ interfaces/enums)
- [x] Validation schemas (15+ schemas)
- [x] Zustand stores (auth, ui)
- [x] Custom hooks (useAuth, useToast, useFetch)
- [x] Helper utilities (30+ functions)
- [x] Layout system (public, auth, dashboard, admin)
- [x] Page scaffolding (25+ pages)
- [x] Documentation (README, DEVELOPMENT_GUIDE)

---

## 🚀 Phase 2: API Service Layer Setup (Frontend Only)

This project is frontend-only. Your Laravel backend will handle all data persistence, authentication, and business logic.

### 1. Configure Environment Variables (Priority: CRITICAL)

Create `.env.local` with your Laravel backend URL:

```bash
# Copy template
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://your-laravel-backend.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NODE_ENV="development"
```

### 2. Axios API Client Configuration (Priority: HIGH)

Create `src/services/api-client.ts`:

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
});

// Request interceptor - add auth token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('authToken') 
      : null;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 3. Authentication Service (Priority: HIGH)

Create `src/services/auth.service.ts`:

```typescript
import apiClient from './api-client';
import { User, LoginPayload, RegisterPayload, ApiResponse } from '@/src/types';

export const authService = {
  async login(email: string, password: string): Promise<ApiResponse<{user: User; token: string}>> {
    const response = await apiClient.post('/api/auth/login', {
      email,
      password,
    });
    
    // Store token
    if (response.data.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
    }
    
    return response.data;
  },

  async register(data: RegisterPayload): Promise<ApiResponse<{user: User; token: string}>> {
    const response = await apiClient.post('/api/auth/register', data);
    
    if (response.data.data?.token) {
      localStorage.setItem('authToken', response.data.data.token);
    }
    
    return response.data;
  },

  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
    localStorage.removeItem('authToken');
  },

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return apiClient.get('/api/auth/me');
  },

  async resetPassword(email: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/forgot-password', { email });
  },

  async updatePassword(token: string, password: string): Promise<ApiResponse<any>> {
    return apiClient.post('/api/auth/reset-password', { token, password });
  },
};
```

### 4. User Service (Priority: HIGH)

Create `src/services/user.service.ts`:

```typescript
import apiClient from './api-client';
import { User, ApiResponse } from '@/src/types';

export const userService = {
  async getProfile(): Promise<ApiResponse<User>> {
    return apiClient.get('/api/users/profile');
  },

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put('/api/users/profile', data);
  },

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return apiClient.get(`/api/users/${id}`);
  },

  async deleteAccount(): Promise<ApiResponse<any>> {
    return apiClient.delete('/api/users/profile');
  },
};
```

### 5. Resource Services (Priority: MEDIUM)

Create similar services for your main resources:

**`src/services/catalogue.service.ts`:**
```typescript
export const catalogueService = {
  async list(page = 1, filters = {}) {
    return apiClient.get('/api/catalogues', { params: { page, ...filters } });
  },
  async create(data) {
    return apiClient.post('/api/catalogues', data);
  },
  async getById(id) {
    return apiClient.get(`/api/catalogues/${id}`);
  },
  async update(id, data) {
    return apiClient.put(`/api/catalogues/${id}`, data);
  },
  async delete(id) {
    return apiClient.delete(`/api/catalogues/${id}`);
  },
};
```

**`src/services/advertisement.service.ts`:**
```typescript
export const advertisementService = {
  async list(page = 1) { return apiClient.get('/api/advertisements', { params: { page } }); },
  async create(data) { return apiClient.post('/api/advertisements', data); },
  async getById(id) { return apiClient.get(`/api/advertisements/${id}`); },
  async update(id, data) { return apiClient.put(`/api/advertisements/${id}`, data); },
  async delete(id) { return apiClient.delete(`/api/advertisements/${id}`); },
};
```

**`src/services/job.service.ts`:**
```typescript
export const jobService = {
  async list(page = 1, filters = {}) { return apiClient.get('/api/jobs', { params: { page, ...filters } }); },
  async create(data) { return apiClient.post('/api/jobs', data); },
  async getById(id) { return apiClient.get(`/api/jobs/${id}`); },
  async update(id, data) { return apiClient.put(`/api/jobs/${id}`, data); },
  async apply(jobId, proposalData) { return apiClient.post(`/api/jobs/${jobId}/apply`, proposalData); },
};
```

**`src/services/message.service.ts`:**
```typescript
export const messageService = {
  async getConversations() { return apiClient.get('/api/messages'); },
  async getConversation(userId) { return apiClient.get(`/api/messages/${userId}`); },
  async sendMessage(userId, content) { return apiClient.post('/api/messages', { userId, content }); },
};
```

### 6. Admin Service (Priority: MEDIUM)

Create `src/services/admin.service.ts`:

```typescript
import apiClient from './api-client';

export const adminService = {
  async getStats() {
    return apiClient.get('/api/admin/stats');
  },

  async getUsers(page = 1) {
    return apiClient.get('/api/admin/users', { params: { page } });
  },

  async updateUserRole(userId: string, role: string) {
    return apiClient.put(`/api/admin/users/${userId}/role`, { role });
  },

  async deleteUser(userId: string) {
    return apiClient.delete(`/api/admin/users/${userId}`);
  },

  async getPendingContent(page = 1) {
    return apiClient.get('/api/admin/content/pending', { params: { page } });
  },

  async approveContent(contentId: string) {
    return apiClient.post(`/api/admin/content/${contentId}/approve`);
  },

  async rejectContent(contentId: string, reason: string) {
    return apiClient.post(`/api/admin/content/${contentId}/reject`, { reason });
  },
};
```

### 7. Create Centralized Service Index (Priority: HIGH)

Create `src/services/index.ts` for easy importing:

```typescript
export * from './auth.service';
export * from './user.service';
export * from './catalogue.service';
export * from './advertisement.service';
export * from './job.service';
export * from './message.service';
export * from './admin.service';
```

### 8. Update Auth Store to Persist Token (Priority: HIGH)

Update `src/store/authStore.ts` to integrate with API service:

```typescript
import { create } from 'zustand';
import { authService } from '@/src/services/auth.service';

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(email, password);
      set({
        user: response.data?.user || null,
        token: response.data?.token || null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Login failed', isLoading: false });
    }
  },

  register: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);
      set({
        user: response.data?.user || null,
        token: response.data?.token || null,
        isLoading: false,
      });
    } catch (error) {
      set({ error: 'Registration failed', isLoading: false });
    }
  },

  logout: async () => {
    try {
      await authService.logout();
      set({ user: null, token: null });
    } catch (error) {
      set({ error: 'Logout failed' });
    }
  },

  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  clearError: () => set({ error: null }),
}));
```

### 9. Connect Forms to API (Priority: MEDIUM)

Update login form (`app/auth/login/page.tsx`):

```tsx
'use client';

import { useAuthStore } from '@/src/store/authStore';
import { loginSchema } from '@/src/lib/validations';
import { useToast } from '@/src/hooks/useToast';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { login, isLoading, error } = useAuthStore();
  const { error: toastError } = useToast();
  const router = useRouter();

  const onSubmit = async (data: {email: string; password: string}) => {
    try {
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      toastError(error || 'Login failed');
    }
  };

  // ... rest of component
}
```

### 10. Test API Integration (Priority: HIGH)

Before deploying, test all endpoints:

**Using Postman/Insomnia:**
1. Test `/api/auth/login` with sample credentials
2. Verify response includes token
3. Test protected endpoint with Authorization header
4. Test error responses (401, 403, 422)

**Using React DevTools:**
1. Check Zustand store state after login
2. Verify token stored in localStorage
3. Check Axios interceptors adding headers

### 11. CORS Configuration

Ensure your Laravel backend allows CORS from your frontend:

**In Laravel `.env`:**
```env
FRONTEND_URL=http://localhost:3000
```

**In Laravel CORS middleware:**
```php
'allowed_origins' => [env('FRONTEND_URL', 'http://localhost:3000')],
```

---

## 📋 Expected API Endpoints (Laravel Backend)

Your Laravel backend should provide these endpoints:

### Authentication
- `POST /api/auth/login` — Login
- `POST /api/auth/register` — Register
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user
- `POST /api/auth/forgot-password` — Request password reset
- `POST /api/auth/reset-password` — Reset password

### Users
- `GET /api/users/profile` — Get current user profile
- `PUT /api/users/profile` — Update current user
- `GET /api/users/{id}` — Get user by ID
- `DELETE /api/users/profile` — Delete account

### Catalogues
- `GET /api/catalogues` — List catalogues (paginated)
- `POST /api/catalogues` — Create catalogue
- `GET /api/catalogues/{id}` — Get catalogue
- `PUT /api/catalogues/{id}` — Update catalogue
- `DELETE /api/catalogues/{id}` — Delete catalogue

### Advertisements
- `GET /api/advertisements` — List ads
- `POST /api/advertisements` — Create ad
- `GET /api/advertisements/{id}` — Get ad
- `PUT /api/advertisements/{id}` — Update ad
- `DELETE /api/advertisements/{id}` — Delete ad

### Jobs
- `GET /api/jobs` — List jobs
- `POST /api/jobs` — Create job
- `GET /api/jobs/{id}` — Get job
- `PUT /api/jobs/{id}` — Update job
- `POST /api/jobs/{id}/apply` — Apply for job

### Messages
- `GET /api/messages` — List conversations
- `GET /api/messages/{userId}` — Get conversation with user
- `POST /api/messages` — Send message

### Admin
- `GET /api/admin/stats` — Get system stats
- `GET /api/admin/users` — List users (admin)
- `PUT /api/admin/users/{id}/role` — Update user role
- `DELETE /api/admin/users/{id}` — Delete user
- `GET /api/admin/content/pending` — Pending content
- `POST /api/admin/content/{id}/approve` — Approve content
- `POST /api/admin/content/{id}/reject` — Reject content

---

## ✅ Response Format Expected

All Laravel endpoints should return responses in this format:

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "...",
      "email": "...",
      "role": "USER",
      "membershipTier": "REGULAR"
    }
  },
  "message": "Operation successful"
}
```

For errors:

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "email": ["Email is already taken"]
  }
}
```

---

## 🎯 Integration Checklist

- [ ] API client configured with correct base URL
- [ ] Auth service methods working with Laravel endpoints
- [ ] Token stored in localStorage after login
- [ ] Token sent in Authorization header for protected requests
- [ ] Forms connected to API services
- [ ] Error messages displayed to users
- [ ] Loading states shown during API calls
- [ ] Logout clears token and redirects to login
- [ ] Protected routes redirect to login if not authenticated
- [ ] Admin pages verify role before displaying

---

## 🚀 Deployment

1. **Frontend (Vercel):**
   ```bash
   # Set environment variables in Vercel dashboard
   NEXT_PUBLIC_API_URL=https://your-laravel-api.com
   ```

2. **Laravel Backend:** Already deployed separately

3. **Ensure CORS** allows requests from your frontend domain

---

## 📞 Your Laravel API Should Handle

- ✅ Authentication (login, register, tokens)
- ✅ User management (profiles, roles, permissions)
- ✅ All CRUD operations (catalogues, ads, jobs, messages)
- ✅ Content moderation
- ✅ Admin dashboard data
- ✅ Email notifications (optional)
- ✅ Payment processing (optional)

**This Next.js project handles only the UI and state management.**

---

Good luck with the integration! 🚀

