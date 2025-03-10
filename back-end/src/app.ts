import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware';
import recommendationRouter from './routers/recommendationRouter';
import testsRouter from './routers/testsRouter';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/recommendations', recommendationRouter);

if (process.env.NODE_ENV === 'test') {
    app.use('/tests', testsRouter);
}

app.use(errorHandlerMiddleware);

export default app;
