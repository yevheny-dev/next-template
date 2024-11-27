import classNames from 'classnames';
import React, { memo } from 'react';

import { LightBorder, LightCorner } from '@/shared/ui/icons';

import { PaymentAmounts } from './payment-amounts';
import { PaymentBonus } from './payment-bonus';
import { PaymentBuy } from './payment-buy';
import { PaymentSelect } from './payment-select';
import styles from './payment.module.scss';

export const PaymentActions = memo(() => {
  return (
    <div
      className={classNames(styles.wrapper, 'p-[20px_8px_20px_8px] tabletSmall:p-[20px] relative')}
    >
      <LightCorner />
      <LightBorder />
      <h5 className={classNames(styles.title, 'mb-[12px]')}>Select a payment method</h5>
      <PaymentSelect />
      <PaymentAmounts />
      <PaymentBonus />
      <PaymentBuy />
      <div
        style={{
          background: 'linear-gradient(0deg, #020106 24.42%, rgba(2, 1, 6, 0.00) 100%)',
          pointerEvents: 'none',
        }}
        className={'absolute h-[96px] inset-[auto_-1px_-10px_-1px]'}
      ></div>
    </div>
  );
});

PaymentActions.displayName = 'PaymentActions';
