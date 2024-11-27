import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '@/app';
import { Button, Image, Loading, SaleApi, Typography } from '@/shared';
import { CopyBtn } from '@/shared/ui/copy-btn';
import { ReferralCodeSpot } from '@/shared/ui/icons/referral-code-spot.tsx';
import { tokenSaleSelector } from '@/widgets';
import { useLazyGetOwnWalletsFromReferralQuery } from '@/widgets/sale/utils/api.ts';

export const TgBotBlock = () => {
  const { ownRefferalCode, ownExternalReferralWallets, isReferralCodeLoading } =
    useAppSelector(tokenSaleSelector);
  const [getOwnReferralWallets] = useLazyGetOwnWalletsFromReferralQuery();
  const [accessCode, setAccessCode] = useState<string | null>(null);
  const [isCodeVisible, setIsCodeVisible] = useState(false);

  console.log(1234)
  useEffect(() => {
    if (!ownRefferalCode) return;
    getOwnReferralWallets(ownRefferalCode);
  }, [ownRefferalCode, getOwnReferralWallets]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.post(`${SaleApi}/partner/notifications`, null, {
          params: {
            code: ownRefferalCode,
            sol: ownExternalReferralWallets?.sol,
            evm: ownExternalReferralWallets?.evm,
          },
        });
        setAccessCode(response.data.accessCode);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    if (ownExternalReferralWallets) {
      fetchNotifications();
    }
  }, [ownExternalReferralWallets, ownRefferalCode]);

  const toggleCodeVisibility = () => {
    setIsCodeVisible(!isCodeVisible);
  };

  const renderAccessCode = () => {
    if (!accessCode) return <Loading />;

    if (isCodeVisible) {
      return accessCode;
    }

    const visiblePart = accessCode.slice(0, 3);
    const hiddenPart = '*'.repeat(accessCode.length - 3);
    return visiblePart + hiddenPart;
  };

  return (
    <div
      style={{ background: 'rgba(38, 39, 43, 0.32)' }}
      className={
        'p-[12px] laptop:p-[20px] relative overflow-hidden border-b-0 rounded-[12px] border border-borderMain'
      }
    >
      <div
        style={{
          background: 'linear-gradient(0deg, #020106 24.42%, rgba(2, 1, 6, 0.00) 100%)',
        }}
        className={'absolute left-0 bottom-[-10px] w-full h-[100px]'}
      ></div>
      <Typography.Title
        className={'!text-[16px] laptop:!text-[20px] !tracking-normal mb-[16px] capitalize'}
      >
        Your Unique Code to View Referral Stats
      </Typography.Title>
      <div
        className={
          'flex flex-col laptop:flex-row items-center justify-between gap-[8px] mb-[16px] laptop:mb-[20px]'
        }
      >
        <div className={'flex-[0_1_60%] !w-full laptop:w-auto items-center'}>
          <div
            style={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}
            className={
              'pl-[16px] laptop:pl-[9px] py-[8px] pr-[10px] rounded-[42px] bg-[#020106] backdrop-blur-[12px] flex items-center justify-between gap-[6px] cursor-pointer'
            }
            onClick={toggleCodeVisibility} // Додаємо обробник події кліку
          >
            <span
              className={'text-[14px] laptop:text-[20px] leading-[24px] tracking-[2px] text-white'}
            >
              {renderAccessCode()} {/* Рендеримо код або зірочки */}
            </span>

            {accessCode ? <CopyBtn text={accessCode} /> : <Loading />}
          </div>
        </div>
        <a href="https://t.me/SolanexReferralBot" target="_blank" rel="noreferrer">
          <Button
            loading={isReferralCodeLoading}
            disabled={isReferralCodeLoading}
            size={'44'}
            className={'!rounded-full !w-full laptop:!w-auto capitalize'}
          >
            go to ReferralBot
          </Button>
        </a>
        <ReferralCodeSpot />
        <Image
          className={'absolute top-0 right-0 rotate-90 z-[-1]'}
          src={'/svg/corner-light.svg'}
          lazy
        />
      </div>
    </div>
  );
};
