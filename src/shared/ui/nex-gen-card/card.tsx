import React from 'react';

export const Card = ({ icon, title, text }: { icon: any; title: string; text: string }) => {
  return (
    <div
      className={
        'relative flex pt-[24px] laptop:max-w-[416px] max-w-[164px] min-h-[270px] p-[16px] laptop:py-[24px] laptop:px-[28px] pb-0 flex-col flex-shrink-0 items-start gap-[32px] rounded-t-[16px]  laptop:rounded-t-[24px] border-[1.5px] border-[solid] border-b-0 border-[#4D5761]'
      }
    >
      <div
        className={
          'absolute hidden laptop:block bottom-0 left-[-2px] bg-[linear-gradient(_transparent,_black)] w-[102%] h-[164px] '
        }
      ></div>
      <div>{icon}</div>
      <div className={'flex flex-col gap-[12px]'}>
        <p
          className={
            'text-[#FFF] laptop:text-[24px] text-[18px] not-italic font-semibold leading-[110%]'
          }
        >
          {title}
        </p>
        <p className={'z-10 text-[#B9C0D4] laptop:text-[17px] text-[14px] font-normal leading-[140%]'}>
          {text}
        </p>
      </div>
    </div>
  );
};
