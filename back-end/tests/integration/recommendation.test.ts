import supertest from 'supertest';
import app from '../../src/app';
import '../../src/setup';

import * as recommendationFactory from '../factories/recommendationFactory';
import { prisma } from '../../src/database';

describe('POST /recommendations', () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should be 201 for a valid body', async () => {
        const body = recommendationFactory.createRecommendationBody();

        const result = await supertest(app).post('/recommendations').send(body);

        expect(result.status).toEqual(201);
    });

    it('should be 422 for a invalid body', async () => {
        const body = recommendationFactory.createRecommendationBody();
        delete body.name;

        const result = await supertest(app).post('/recommendations').send(body);
        expect(result.status).toEqual(422);
    });
});

describe('GET /recommendations', () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('the return has to come with the registered data', async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const result = await supertest(app).get('/recommendations');

        expect(result.body[0]).toEqual(recommendation);
    });

    it('should return empty array if there is no data recorded', async () => {
        const result = await supertest(app).get('/recommendations');
        expect(result.body).toEqual([]);
    });
});

describe('GET /recommendations/:id', () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should return recommendation with corresponding id', async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        const result = await supertest(app).get(`/recommendations/${recommendation.id}`);

        expect(result.body).toEqual(recommendation);
    });

    it('should return 404 for non-existent recommendation', async () => {
        const result = await supertest(app).get('/recommendations/1');
        expect(result.status).toEqual(404);
    });
});

describe('GET /recommendations/:id/upvote', () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should return recommendation with corresponding id', async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        await supertest(app).post(`/recommendations/${recommendation.id}/upvote`);
        const data = await supertest(app).get(`/recommendations/${recommendation.id}`);
        const body = JSON.parse(data.text);

        expect(body).toEqual({ ...recommendation, score: recommendation.score + 1 });
    });
});

describe('GET /recommendations/:id/downvote', () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should return recommendation with corresponding id', async () => {
        const recommendation = await recommendationFactory.createRecommendation();

        await supertest(app).post(`/recommendations/${recommendation.id}/downvote`);
        const data = await supertest(app).get(`/recommendations/${recommendation.id}`);
        const body = JSON.parse(data.text);

        expect(body).toEqual({ ...recommendation, score: recommendation.score - 1 });
    });
});
