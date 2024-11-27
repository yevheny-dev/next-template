import React, { memo } from 'react';

import styles from './payment.module.scss';

import { PaymentActions } from './payment-actions';
import { PaymentInfo } from './payment-info';
import { useTokenSale } from '../hooks/use-token-sale';

export const PaymentWidget = memo(() => {
  useTokenSale();
  return (
    <div className={styles.layout}>
      <PaymentInfo />
      <PaymentActions />
    </div>
  );
});

PaymentWidget.displayName = 'PaymentWidget';
