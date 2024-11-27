import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { toast } from 'react-toastify';

export const wrongNotify = (message?: string | ReactNode) =>
  toast.error(message || 'Something went wrong!');
export const successNotify = (message?: string | ReactNode) =>
  toast.success(message || 'Successful');

export const NotifyWithDescr = ({ title, descr }: { title: string; descr: string }) => {
  return (
    <div className={classNames('w-[232px] h-[100px] relative flex flex-col gap-[8px] bg-inherit')}>
      <span
        className={'text-[#151515] font-titilliumWeb text-[28px] italic font-bold leading-[100%]'}
      >
        {title}
      </span>
      <p
        className={'text-[#151515] font-titilliumWeb text-[16px] font-semibold leading-[140%]'}
        style={{ display: 'inline-block' }}
      >
        {descr}
      </p>
      <div className={'absolute bottom-[-70px] right-[-100px]'}></div>
    </div>
  );
};
