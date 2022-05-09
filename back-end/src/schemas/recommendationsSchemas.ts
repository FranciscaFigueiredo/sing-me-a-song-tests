import joi from 'joi';
import { CreateRecommendationData } from '../services/recommendationsService';

const youtubeLinkRegex = /((http)+?[s]?:\/\/(www.)*youtube\.com\/watch\?v=([-A-z0-9@:%_+.~#?&\/\/=]+)+?)/;

export const recommendationSchema = joi.object<CreateRecommendationData>({
    name: joi.string().required(),
    youtubeLink: joi.string().required().pattern(youtubeLinkRegex),
});
