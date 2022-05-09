import { prisma } from '../database';

async function removeAllRecommendations() {
    await prisma.recommendation.deleteMany();
}

export const testRepository = {
    removeAllRecommendations,
};
