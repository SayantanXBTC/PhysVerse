export enum SimulationType {
  PROJECTILE = 'projectile',
  SPRING_MASS = 'spring-mass',
  TWO_BODY_ORBIT = 'two-body-orbit'
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Simulation {
  _id: string;
  userId: string | User;
  name: string;
  type: SimulationType;
  parameters: Record<string, any>;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SimulationParameters {
  [key: string]: number | string | boolean;
}
