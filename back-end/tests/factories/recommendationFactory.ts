import { faker } from '@faker-js/faker';
import { prisma } from '../../src/database';

function createRecommendationBody() {
    const body = {
        name: faker.music.genre(),
        youtubeLink: 'https://www.youtube.com/watch?v=4FaHeREoRUc&list=RD4FaHeREoRUc&start_radio=1',
    };

    return body;
}

async function createRecommendation() {
    const body = createRecommendationBody();

    const insertedRecommendation = await prisma.recommendation.create({
        data: body,
    });

    return insertedRecommendation;
}

export {
    createRecommendationBody,
    createRecommendation,
};
