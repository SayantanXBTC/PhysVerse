import { api } from '@/lib/api';
import { Simulation, SimulationType } from '@/types';

export const simulationService = {
  async create(name: string, type: string, parameters: Record<string, unknown>, isPublic = false): Promise<Simulation> {
    const { data } = await api.post<{ simulation: Simulation }>('/simulations', {
      name,
      type,
      parameters,
      isPublic
    });
    return data.simulation;
  },

  async getAll(): Promise<Simulation[]> {
    const { data } = await api.get<{ simulations: Simulation[] }>('/simulations');
    return data.simulations;
  },

  async getById(id: string): Promise<Simulation> {
    const { data } = await api.get<{ simulation: Simulation }>(`/simulations/${id}`);
    return data.simulation;
  },

  async update(id: string, updates: Partial<Simulation>): Promise<Simulation> {
    const { data } = await api.put<{ simulation: Simulation }>(`/simulations/${id}`, updates);
    return data.simulation;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/simulations/${id}`);
  },

  async getPublic(): Promise<Simulation[]> {
    const { data } = await api.get<{ simulations: Simulation[] }>('/public/simulations');
    return data.simulations;
  },

  async getPublicById(id: string): Promise<Simulation> {
    const { data } = await api.get<{ simulation: Simulation }>(`/public/simulations/${id}`);
    return data.simulation;
  }
};
