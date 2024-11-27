import { EventDefinition } from 'redux-beacon';

import { PURCHASE, WALLET_ATTACHED } from './actionTypes';

const walletAttach: EventDefinition = (_) => {
  return {
    hitType: 'wallet_attached',
  };
};

const purchase: EventDefinition = (action) => {
  return {
    event: 'purchase',
    hitType: 'event',
    ecommerce: {
      currency: action.payload.currency,
      value: action.payload.value,
      transaction_id: action.payload.transaction_id,
      items: [
        {
          item_category: action.payload.chain_name,
          item_category2: action.payload.token_name,
          item_category3: action.payload.utm_source || '',
          item_category4: action.payload.utm_medium || '',
          item_category5: action.payload.utm_campaign || '',
        },
      ],
    },
  };
};

export const eventsMap = {
  [WALLET_ATTACHED]: walletAttach,
  [PURCHASE]: purchase,
};
