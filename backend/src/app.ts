import express, { Application } from 'express';
import cors from 'cors';
import { router } from './infrastructure/adapters/http/routes';
import { errorMiddleware } from './infrastructure/adapters/http/middlewares/error.middleware';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/v1', router);
app.use(errorMiddleware);

export default app;
