import { testRepository } from '../repositories/testRepository';

async function deleteAll() {
    await testRepository.removeAllRecommendations();
}

export const testService = {
    deleteAll,
};
