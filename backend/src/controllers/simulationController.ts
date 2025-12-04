import { Response } from 'express';
import { Simulation } from '../models/Simulation';
import { AuthRequest } from '../types';

export const createSimulation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, type, parameters, isPublic } = req.body;

    const simulation = await Simulation.create({
      userId: req.userId,
      name,
      type,
      parameters,
      isPublic: isPublic || false
    });

    res.status(201).json({ simulation });
  } catch (error) {
    console.error('Create simulation error:', error);
    res.status(500).json({ error: 'Failed to create simulation' });
  }
};

export const getSimulations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const simulations = await Simulation.find({ userId: req.userId })
      .sort({ createdAt: -1 });

    res.json({ simulations });
  } catch (error) {
    console.error('Get simulations error:', error);
    res.status(500).json({ error: 'Failed to fetch simulations' });
  }
};

export const getSimulation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const simulation = await Simulation.findOne({
      _id: id,
      userId: req.userId
    });

    if (!simulation) {
      res.status(404).json({ error: 'Simulation not found' });
      return;
    }

    res.json({ simulation });
  } catch (error) {
    console.error('Get simulation error:', error);
    res.status(500).json({ error: 'Failed to fetch simulation' });
  }
};

export const updateSimulation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const simulation = await Simulation.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!simulation) {
      res.status(404).json({ error: 'Simulation not found' });
      return;
    }

    res.json({ simulation });
  } catch (error) {
    console.error('Update simulation error:', error);
    res.status(500).json({ error: 'Failed to update simulation' });
  }
};

export const deleteSimulation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const simulation = await Simulation.findOneAndDelete({
      _id: id,
      userId: req.userId
    });

    if (!simulation) {
      res.status(404).json({ error: 'Simulation not found' });
      return;
    }

    res.json({ message: 'Simulation deleted successfully' });
  } catch (error) {
    console.error('Delete simulation error:', error);
    res.status(500).json({ error: 'Failed to delete simulation' });
  }
};

export const getPublicSimulations = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const simulations = await Simulation.find({ isPublic: true })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('userId', 'name');

    res.json({ simulations });
  } catch (error) {
    console.error('Get public simulations error:', error);
    res.status(500).json({ error: 'Failed to fetch public simulations' });
  }
};

export const getPublicSimulation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const simulation = await Simulation.findOne({
      _id: id,
      isPublic: true
    }).populate('userId', 'name');

    if (!simulation) {
      res.status(404).json({ error: 'Simulation not found' });
      return;
    }

    res.json({ simulation });
  } catch (error) {
    console.error('Get public simulation error:', error);
    res.status(500).json({ error: 'Failed to fetch simulation' });
  }
};
