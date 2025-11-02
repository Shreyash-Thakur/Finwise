import { createApp } from './server.js';
import { config } from './config/env.js';

async function bootstrap() {
  try {
    const app = await createApp();
    
    const server = app.listen(config.port, () => {
      console.log(`🚀 FinWise backend server running on port ${config.port}`);
      console.log(`📊 Environment: ${config.nodeEnv}`);
      console.log(`🔗 Health check: http://localhost:${config.port}/health`);
      console.log(`📡 API base URL: http://localhost:${config.port}/api`);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('📤 SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('📤 SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('✅ Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();