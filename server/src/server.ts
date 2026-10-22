import { app } from './app.js';
import { env } from './config/env.js';
import { connectDatabase, disconnectDatabase } from './config/db.js';
import { adminController } from './controllers/adminController.js';

async function bootstrap() {
  console.info('====================================================');
  console.info('  HOMELINE INTERIO — Backend API Server');
  console.info('  Concept Demo by Nats LAB');
  console.info('====================================================');

  // Attempt database connection
  await connectDatabase();

  // Ensure default administrator account is provisioned
  await adminController.bootstrapAdmin();

  const server = app.listen(env.PORT, () => {
    console.info(`[SERVER] Running on http://localhost:${env.PORT}`);
    console.info(`[SERVER] Environment: ${env.NODE_ENV}`);
    console.info(`[SERVER] AI Provider: ${env.AI_PROVIDER}`);
    console.info(`[SERVER] Default Admin: ${env.ADMIN_EMAIL}`);
  });

  // Graceful shutdown handling
  const shutdown = async () => {
    console.info('\n[SERVER] Shutting down gracefully...');
    server.close(async () => {
      await disconnectDatabase();
      console.info('[SERVER] Closed all connections. Exiting process.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch(err => {
  console.error('[SERVER] Fatal bootstrap error:', err);
  process.exit(1);
});
