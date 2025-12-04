import { Router } from 'express';
import { getPublicSimulations, getPublicSimulation } from '../controllers/simulationController';

const router = Router();

router.get('/simulations', getPublicSimulations);
router.get('/simulations/:id', getPublicSimulation);

export default router;
