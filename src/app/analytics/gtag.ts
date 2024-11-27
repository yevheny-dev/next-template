import GoogleTagManager from '@redux-beacon/google-tag-manager';
import logger from '@redux-beacon/logger';
import { createMetaReducer, createMiddleware } from 'redux-beacon';

import { isDevelopment } from '@/shared';

import { eventsMap } from './eventsMap';

const gtm = GoogleTagManager();

export const gtmMainMiddleware = createMiddleware(eventsMap, gtm, {
  ...(isDevelopment ? { logger } : {}),
});
export const gtmMainMetaReducer = createMetaReducer(eventsMap, gtm, {
  ...(isDevelopment ? { logger } : {}),
});
