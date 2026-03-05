import { Router } from 'express';
import {
  startLife,
  makeDecision,
  getTimeline,
  getStats,
} from '../controllers/lifeController';

const router = Router();

router.post('/start-life', startLife);
router.post('/decision', makeDecision);
router.get('/timeline/:sessionId', getTimeline);
router.get('/stats/:sessionId', getStats);

export default router;
