import { Request, Response } from 'express';
import { testService } from '../services/testService';

async function deleteAllRecommendations(req: Request, res: Response): Promise<Response> {
    await testService.deleteAll();

    return res.sendStatus(204);
}

export const testController = {
    deleteAllRecommendations,
};
