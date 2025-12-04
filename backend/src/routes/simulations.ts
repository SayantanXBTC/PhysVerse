import { Router } from 'express';
import {
  createSimulation,
  getSimulations,
  getSimulation,
  updateSimulation,
  deleteSimulation
} from '../controllers/simulationController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createSimulationSchema, updateSimulationSchema } from '../validators/simulation';

const router = Router();

router.use(authenticate);

router.post('/', validate(createSimulationSchema), createSimulation);
router.get('/', getSimulations);
router.get('/:id', getSimulation);
router.put('/:id', validate(updateSimulationSchema), updateSimulation);
router.delete('/:id', deleteSimulation);

export default router;
