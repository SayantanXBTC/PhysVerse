import { api } from '@/lib/api';
import { AuthResponse, User } from '@/types';

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
    localStorage.setItem('token', data.token);
    return data;
  },

  async login(email: string, password: string, rememberMe?: boolean): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password, rememberMe });
    localStorage.setItem('token', data.token);
    return data;
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<{ user: User }>('/auth/me');
    return data.user;
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post('/auth/forgot-password', { email });
    return data;
  },

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    const { data } = await api.post('/auth/reset-password', { token, password });
    return data;
  },

  async verifyEmail(token: string): Promise<{ message: string }> {
    const { data } = await api.post('/auth/verify-email', { token });
    return data;
  },

  async resendVerification(): Promise<{ message: string }> {
    const { data } = await api.post('/auth/resend-verification');
    return data;
  },

  async updateProfile(name: string, avatar?: string): Promise<{ user: User }> {
    const { data } = await api.put('/auth/profile', { name, avatar });
    return data;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await api.put('/auth/change-password', { currentPassword, newPassword });
    return data;
  },

  async deleteAccount(password: string): Promise<{ message: string }> {
    const { data } = await api.delete('/auth/account', { data: { password } });
    localStorage.removeItem('token');
    return data;
  },

  async getUserStats(): Promise<any> {
    const { data } = await api.get('/auth/stats');
    return data;
  },

  logout(): void {
    localStorage.removeItem('token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
};
