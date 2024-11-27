import classNames from 'classnames';
import React, { memo, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import { Button, FiatsList, Modal } from '@/shared';
import { CardIcon } from '@/shared/ui/icons';

import {
  PaymentType,
  setAssetAmount,
  setFiat,
  setPaymentType,
  tokenSaleSelector,
} from '../../model';
import commonStyles from '../payment.module.scss';

export const FiatSelect = memo(() => {
  const dispatch = useAppDispatch();
  const { fiat, currentPaymentType } = useAppSelector(tokenSaleSelector);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className={classNames(commonStyles.assetBtn, {
          [commonStyles.active]: currentPaymentType === PaymentType.FIAT,
        })}
      >
        {fiat ? (
          <div className="flex items-center w-full">
            <img className={commonStyles.icon} src={fiat.icon} alt={fiat.name} />
            <span className={commonStyles.symbol}>{fiat.symbol}</span>
            <span className={commonStyles.network}>{fiat.name}</span>
            <Button
              className="uppercase ml-auto"
              style={{ borderRadius: '35px', paddingInline: '12px', fontWeight: 600 }}
              size={'32'}
            >
              Change
            </Button>
          </div>
        ) : (
          <>
            <div
              style={{ background: 'rgba(255, 255, 255, 0.06)' }}
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center"
            >
              <CardIcon />
            </div>
            <span className={commonStyles.value}>Fiat</span>
            <span className={commonStyles.network}>USD,EUR,GBR</span>
          </>
        )}
      </div>
      {isOpen && (
        <Modal title="Select a Token&Chain" onClose={() => setIsOpen(false)}>
          <div className="grid grid-cols-1 gap-[4px] mt-[12px]">
            {FiatsList.map((fiat) => (
              <button
                className="flex items-center p-[12px_12px_12px_8px] rounded-[8px]"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                key={fiat.symbol}
                onClick={() => {
                  dispatch(setFiat(fiat));
                  dispatch(setPaymentType(PaymentType.FIAT));
                  dispatch(setAssetAmount(''));
                  setIsOpen(false);
                }}
              >
                <span className={commonStyles.value} style={{ marginLeft: 0 }}>
                  {fiat.symbol}
                </span>
                <span className={commonStyles.network}>{fiat.name}</span>
                <img className="ml-auto w-[26px] h-[26px]" src={fiat.icon} alt={fiat.symbol} />
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
});

FiatSelect.displayName = 'FiatSelect';
