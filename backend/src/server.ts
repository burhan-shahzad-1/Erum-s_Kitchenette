import app from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';

const startServer = async (): Promise<void> => {
  await connectDatabase();
  app.listen(env.port, () => {
    console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`);
  });
};

startServer();
