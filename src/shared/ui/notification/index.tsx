import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '@/app';
import { NotificationType, NotificationContent } from '@/shared/types';
import { removeOpenNotificationType, tokenSaleSelector } from '@/widgets';

import styles from './index.module.scss';

interface Props {
  type: NotificationType;
  customTitle?: string;
  customText?: string;
  closeAfter?: number;
}

export const Notification: React.FC<Props> = ({ type, customTitle, customText, closeAfter }) => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLDivElement>(null);
  const title = customTitle || NotificationContent[type].title;
  const text = customText || NotificationContent[type].text;

  const { openNotificationType } = useAppSelector(tokenSaleSelector);

  useEffect(() => {
    if (closeAfter && openNotificationType.includes(type)) {
      const id = setTimeout(() => {
        dispatch(removeOpenNotificationType(type));
      }, closeAfter);

      return () => {
        clearTimeout(id);
      };
    }
  }, [dispatch, closeAfter, openNotificationType, type]);

  useEffect(() => {
    if (!openNotificationType?.includes(type)) {
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.opacity = '0';
          ref.current.style.transform = '';
          ref.current.style.pointerEvents = 'none';
        }
      }, 0);
    } else if (openNotificationType?.includes(type)) {
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.opacity = '1';
          ref.current.style.transform = 'translateX(0)';
          ref.current.style.pointerEvents = 'all';
        }
      }, 0);
    }
  }, [type, openNotificationType]);

  return createPortal(
    <div
      ref={ref}
      aria-hidden="true"
      className="translate-x-[100%] transition-all duration-300 opacity-0 w-[309px] rounded-[12px] border-[1px] border-gray-600 bg-black fixed z-[901] top-[16px] right-[20px]"
    >
      <div className={'relative px-[8px] py-[17px]'}>
        <p
          className={
            'text-[#B9C0D4] text-center mb-[17px] text-[14px] font-semibold leading-[100%]'
          }
        >
          {title}
        </p>
        <div
          className={'border-[1px] border-[solid] rounded-[8px] border-gray-600 px-[8px] py-[12px]'}
        >
          <span
            className={
              'text-[rgba(185,_192,_212,_0.64)] text-center text-[14px] not-italic font-semibold leading-[140%]'
            }
          >
            {text}
          </span>
        </div>
        <div
          onClick={() => type !== NotificationType.TRANSACTION_IN_PROGRESS && toast.dismiss()}
          className={classNames(
            'absolute top-[4px] right-[4px] flex justify-center items-center flex-shrink-0 rounded-[8px] bg-[rgba(255,_255,_255,_0.04)]',
            {
              'p-0 cursor-pointer': type !== NotificationType.TRANSACTION_IN_PROGRESS,
              'p-[8px]': type === NotificationType.TRANSACTION_IN_PROGRESS,
            },
          )}
        >
          {type !== NotificationType.TRANSACTION_IN_PROGRESS &&
            type !== NotificationType.WRONG_NETWORK && (
              <button onClick={() => dispatch(removeOpenNotificationType(type))}>
                <img src={'/svg/close.svg'} alt="close" />
              </button>
            )}
          {type === NotificationType.TRANSACTION_IN_PROGRESS && (
            <img
              className={classNames({
                [styles.animateSpin]: true,
              })}
              src={'/svg/loading.svg'}
              alt="loading"
            />
          )}
        </div>
        <div className={'absolute top-0 left-0 transform scale-x-[-1]'}>
          <img src="/images/tokenomics/svg/light.svg" alt="" />
        </div>
        <div className={'absolute top-0 left-0'}>
          <img src="/images/tokenomics/svg/light2.svg" alt="" />
        </div>
      </div>
    </div>,
    document.body,
  );
};
