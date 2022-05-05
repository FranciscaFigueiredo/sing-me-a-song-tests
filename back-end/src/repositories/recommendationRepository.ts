import { Prisma, PrismaPromise, Recommendation } from '@prisma/client';
import { prisma } from '../database';
import { CreateRecommendationData } from '../services/recommendationsService';

async function create(createRecommendationData: CreateRecommendationData): Promise<void> {
    await prisma.recommendation.create({
        data: createRecommendationData,
    });
}

interface FindAllWhere {
    score: number;
    scoreFilter: 'lte' | 'gt';
}

function getFindAllFilter(
    findAllWhere?: FindAllWhere,
): Prisma.RecommendationWhereInput {
    if (!findAllWhere) return {};

    const { score, scoreFilter } = findAllWhere;

    return {
        score: { [scoreFilter]: score },
    };
}

function findAll(findAllWhere?: FindAllWhere): PrismaPromise<Recommendation[]> {
    const filter = getFindAllFilter(findAllWhere);

    return prisma.recommendation.findMany({
        where: filter,
        orderBy: { id: 'desc' },
    });
}

function getAmountByScore(take: number): PrismaPromise<Recommendation[]> {
    return prisma.recommendation.findMany({
        orderBy: { score: 'desc' },
        take,
    });
}

function find(id: number): Prisma.Prisma__RecommendationClient<Recommendation> {
    return prisma.recommendation.findUnique({
        where: { id },
    });
}

async function updateScore(id: number, operation: 'increment' | 'decrement'): Promise<void> {
    await prisma.recommendation.update({
        where: { id },
        data: {
            score: { [operation]: 1 },
        },
    });
}

async function remove(id: number): Promise<void> {
    await prisma.recommendation.delete({
        where: { id },
    });
}

export const recommendationRepository = {
    create,
    findAll,
    find,
    updateScore,
    getAmountByScore,
    remove,
};
