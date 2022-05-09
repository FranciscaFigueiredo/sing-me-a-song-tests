import { Router } from 'express';
import { recommendationController } from '../controllers/recommendationController';
import { testController } from '../controllers/testController';

const recommendationRouter = Router();

recommendationRouter.post('/reset', testController.deleteAllRecommendations);
recommendationRouter.post('/create', recommendationController.downvote);

export default recommendationRouter;
