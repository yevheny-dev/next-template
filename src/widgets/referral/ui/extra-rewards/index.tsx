import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import {
  EXTRA_REWARDS_MAIL,
  EXTRA_REWARDS_TELEGRAM,
  Image,
  MIN_EARNED_VALUE,
  MIN_LEADER_RANK,
  MIN_REFERRALS,
} from '@/shared';
import { Mail16x16 } from '@/shared/ui/icons/mail.tsx';
import { ModalClose } from '@/shared/ui/icons/modal-close.tsx';
import { Telegram16x16 } from '@/shared/ui/icons/telegram.tsx';
import { tokenSaleSelector } from '@/widgets';

const links: { icon: ReactNode; label: string; url: string }[] = [
  {
    icon: <Telegram16x16 />,
    url: EXTRA_REWARDS_TELEGRAM,
    label: '@solanex_manager',
  },
  {
    icon: <Mail16x16 />,
    url: `mailto:${EXTRA_REWARDS_MAIL}`,
    label: 'info@solanex.ai',
  },
];

export const ExtraRewards = ({ instantlyEarned }: { instantlyEarned: string }) => {
  const { referralPurchaseHistoryItems, personalLeaderboardStats } = useSelector(tokenSaleSelector);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    if (!personalLeaderboardStats || personalLeaderboardStats.rank < MIN_LEADER_RANK) {
      setIsShow(false);
      return;
    } else {
      if (
        Number(instantlyEarned) > MIN_EARNED_VALUE ||
        referralPurchaseHistoryItems.length > MIN_REFERRALS
      ) {
        setIsShow(true);
      } else {
        setIsShow(false);
      }
    }
  }, [personalLeaderboardStats, referralPurchaseHistoryItems.length]);

  if (isShow) {
    return (
      <div
        style={{
          background: 'rgba(106, 86, 246, 0.16)',
          border: '1px solid rgba(255, 255, 255, 0.20)',
        }}
        className={
          'rounded-[12px] pt-[36px] pb-[24px] px-[12px] laptop:px-[20px] laptop:py-[38px] relative mb-[24px] laptop:mb-[32px] overflow-hidden h-[414px] laptop:h-auto'
        }
      >
        <div className={'flex flex-col h-full laptop:flex-row items-center justify-between'}>
          <div className={'font-semibold relative z-[2]'}>
            <p
              className={
                'text-[#FAFAFA] text-[24px] laptop:text-[28px] leading-[100%] capitalize mb-[12px] laptop:mb-[16px] max-w-[246px] laptop:max-w-full'
              }
            >
              Let’s Talk About Bigger Rewards!
            </p>
            <p className={'max-w-[480px] text-[#B9C0D4] text-[14px] leading-[150%]'}>
              You’ve done an incredible job bringing in referrals! Contact our team to explore
              improved financial terms and extra rewards for your efforts!
            </p>
          </div>
          <div
            className={
              'flex flex-col laptop:flex-row gap-[6px] laptop:gap-[8px] items-center w-full laptop:w-auto relative z-[2]'
            }
          >
            {links.map((link) => (
              <a
                className={
                  'flex justify-center items-center gap-[6px] h-[46px] w-full laptop:w-[210px] rounded-[37px] border border-white bg-[#6A56F6]'
                }
                key={link.url}
                href={link.url}
                target={'_blank'}
                rel="noreferrer"
              >
                {link.icon}{' '}
                <span className={'text-white text-[16px] font-semibold leading-[100%] capitalize'}>
                  {link.label}
                </span>
              </a>
            ))}
          </div>
        </div>
        <Spot />
        <Image
          className={'absolute top-0 right-0 rotate-90 z-[-1]'}
          src={'/svg/corner-light.svg'}
          lazy
        />
        <Image
          className={
            'max-h-[426px] laptop:max-h-[100%] absolute laptop:top-0 top-[-10px] laptop:bottom-0 left-[5%] laptop:left-[190px]'
          }
          src={'/images/reward_coins.webp'}
          mobSrc={'/images/reward_coins_mob.webp'}
          lazy
        />
        <div
          onClick={() => setIsShow(false)}
          className={'absolute top-[8px] right-[8px] cursor-pointer'}
        >
          <ModalClose />
        </div>
      </div>
    );
  }
};

const Spot = () => {
  return (
    <svg
      className={'absolute right-0 top-0 z-[-1]'}
      width="315"
      height="162"
      viewBox="0 0 315 162"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_2847_2684)">
        <ellipse
          cx="159.5"
          cy="62"
          rx="159.5"
          ry="62"
          transform="matrix(-1 8.74228e-08 8.74228e-08 1 382 -50)"
          fill="#6A56F6"
          fillOpacity="0.36"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_2847_2684"
          x="-53.72"
          y="-166.72"
          width="552.44"
          height="357.44"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="58.36" result="effect1_foregroundBlur_2847_2684" />
        </filter>
      </defs>
    </svg>
  );
};
