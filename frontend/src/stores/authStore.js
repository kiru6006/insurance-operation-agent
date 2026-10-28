import { create } from 'zustand';
export const useAuthStore = create((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: false,
    error: null,
    login: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user, error: null });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null });
    },
}));
