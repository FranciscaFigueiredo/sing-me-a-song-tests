import { Recommendation } from '@prisma/client';
import { recommendationRepository } from '../repositories/recommendationRepository';
import { notFoundError } from '../utils/errorUtils';

export type CreateRecommendationData = Omit<Recommendation, 'id' | 'score'>;

async function insert(createRecommendationData: CreateRecommendationData): Promise<void> {
    await recommendationRepository.create(createRecommendationData);
}

async function upvote(id: number): Promise<void> {
    const recommendation = await recommendationRepository.find(id);
    if (!recommendation) throw notFoundError();

    await recommendationRepository.updateScore(id, 'increment');
}

async function downvote(id: number): Promise<void> {
    const recommendation = await recommendationRepository.find(id);
    if (!recommendation) throw notFoundError();

    await recommendationRepository.updateScore(id, 'decrement');

    if (recommendation.score < -5) {
        await recommendationRepository.remove(id);
    }
}

async function getById(id: number): Promise<Recommendation> {
    return recommendationRepository.find(id);
}

async function get(): Promise<Recommendation[]> {
    return recommendationRepository.findAll();
}

async function getTop(amount: number): Promise<Recommendation[]> {
    return recommendationRepository.getAmountByScore(amount);
}

async function getByScore(scoreFilter: 'gt' | 'lte'): Promise<Recommendation[]> {
    const recommendations = await recommendationRepository.findAll({
        score: 10,
        scoreFilter,
    });

    if (recommendations.length > 0) {
        return recommendations;
    }

    return recommendationRepository.findAll();
}

function getScoreFilter(random: number): 'gt' | 'lte' {
    if (random < 0.7) {
        return 'gt';
    }

    return 'lte';
}

async function getRandom(): Promise<Recommendation> {
    const random = Math.random();
    const scoreFilter = getScoreFilter(random);

    const recommendations = await getByScore(scoreFilter);
    if (recommendations.length === 0) {
        throw notFoundError();
    }

    const randomIndex = Math.floor(Math.random() * recommendations.length);
    return recommendations[randomIndex];
}

export const recommendationService = {
    insert,
    upvote,
    downvote,
    getRandom,
    get,
    getById,
    getTop,
};
