import { jest } from '@jest/globals';
import { recommendationRepository } from '../../src/repositories/recommendationRepository';
import { recommendationService } from '../../src/services/recommendationsService';

import { testService } from '../../src/services/testService';

describe('INSERT recommendation', () => {
    beforeAll(() => {
        process.env.DATABASE_URL = 'postgres://postgres:123123@localhost:5432/sing_me_a_song_ts_test';
    });

    beforeEach(async () => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        await testService.deleteAll();
    });

    afterAll(async () => {
        await testService.deleteAll();
    });

    it('should be a conflict error for same body', async () => {
        const body = {
            id: 1,
            name: 'Chitãozinho E Xororó - Evidências',
            youtubeLink: 'https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO',
            score: 245,
        };

        jest.spyOn(recommendationRepository, 'findByName').mockResolvedValueOnce(body);

        const result = async () => {
            await recommendationService.insert({
                name: body.name,
                youtubeLink: body.youtubeLink,
            });
        };

        expect(result).rejects.toEqual({ message: 'Recommendations names must be unique', type: 'conflict' });
    });
});

describe('UPVOTE AND DOWNVOTE recommendation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should not increment the amount of likes for invalid id', async () => {
        const bodyId = 1;

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

        const result = async () => {
            await recommendationService.upvote(bodyId);
        };

        expect(result).rejects.toEqual({ type: 'not_found', message: '' });
    });

    it('should not decrease the number of likes for invalid id', async () => {
        const bodyId = 1;

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(null);

        const result = async () => {
            await recommendationService.downvote(bodyId);
        };

        expect(result).rejects.toEqual({ type: 'not_found', message: '' });
    });
});

describe('REMOVE recommendation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should remove recommendation with -5 likes', async () => {
        const body = {
            id: 1,
            name: 'Chitãozinho E Xororó - Evidências',
            youtubeLink: 'https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO',
            score: -5,
        };

        jest.spyOn(recommendationRepository, 'find').mockResolvedValueOnce(body);
        jest.spyOn(recommendationRepository, 'updateScore').mockResolvedValueOnce({
            ...body,
            score: body.score - 1,
        });

        const deleteRecommendation = jest.spyOn(recommendationRepository, 'remove').mockResolvedValueOnce(null);

        await recommendationService.downvote(body.id);

        expect(deleteRecommendation).toBeCalledTimes(1);
        expect(recommendationRepository.updateScore).toBeCalledWith(body.id, 'decrement');
    });
});

describe('RANDOM recommendations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should return not found if there are no recommendations', async () => {
        jest.spyOn(recommendationRepository, 'findAll').mockResolvedValueOnce([]);

        jest.spyOn(global.Math, 'random').mockReturnValueOnce(1);

        const result = async () => {
            await recommendationService.getRandom();
        };

        expect(result).rejects.toEqual({ type: 'not_found', message: '' });
    });
});

describe('TOP recommendation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });

    it('should remove recommendation with -5 likes', async () => {
        const recommendations = [
            {
                id: 1,
                name: 'Chitãozinho E Xororó - Evidências',
                youtubeLink: 'https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO',
                score: 300,
            },
            {
                id: 2,
                name: ',Falamansa - Xote dos Milagres',
                youtubeLink: ',https://www.youtube.com/watch?v=chwyjJbcs1Y',
                score: 100,
            },
        ];

        jest.spyOn(recommendationRepository, 'getAmountByScore').mockResolvedValueOnce(recommendations);

        const result = async () => {
            await recommendationService.getRandom();
        };
        console.log(result);

        expect(result).rejects.toEqual({
            id: 1,
            name: 'Chitãozinho E Xororó - Evidências',
            youtubeLink: 'https://www.youtube.com/watch?v=ePjtnSPFWK8&ab_channel=CHXVEVO',
            score: 300,
        });
    });
});
