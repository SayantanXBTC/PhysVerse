import { Request } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
}

export interface SimulationParameters {
  [key: string]: number | string | boolean | object;
}

export enum SimulationType {
  PROJECTILE = 'projectile',
  SPRING_MASS = 'spring-mass',
  TWO_BODY_ORBIT = 'two-body-orbit'
}
