import { Request, Response } from 'express';
import { recommendationSchema } from '../schemas/recommendationsSchemas';
import { recommendationService } from '../services/recommendationsService';
import { wrongSchemaError } from '../utils/errorUtils';

async function insert(req: Request, res: Response): Promise<Response> {
    const validation = recommendationSchema.validate(req.body);

    if (validation.error) {
        console.log(validation.error.message);

        throw wrongSchemaError();
    }

    await recommendationService.insert(req.body);

    return res.sendStatus(201);
}

async function upvote(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    await recommendationService.upvote(+id);

    return res.sendStatus(200);
}

async function downvote(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    await recommendationService.downvote(+id);

    return res.sendStatus(200);
}

async function random(req: Request, res: Response): Promise<Response> {
    const randomRecommendation = await recommendationService.getRandom();

    return res.send(randomRecommendation);
}

async function get(req: Request, res: Response): Promise<Response> {
    const recommendations = await recommendationService.get();

    return res.send(recommendations);
}

async function getTop(req: Request, res: Response): Promise<Response> {
    const { amount } = req.params;

    const recommendations = await recommendationService.getTop(+amount);

    return res.send(recommendations);
}

async function getById(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const recommendation = await recommendationService.getById(+id);

    return res.send(recommendation);
}

export const recommendationController = {
    insert,
    upvote,
    downvote,
    random,
    getTop,
    get,
    getById,
};
