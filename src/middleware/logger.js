import pino from 'pino-http';

export const logger = pino({
  transport: process.env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
      }
    : undefined,
});
