import classNames from 'classnames';
import React, { useState } from 'react';

import { Button, EMAIL_REGEXP, Image, useIsMobile } from '@/shared';
import { CheckViolet } from '@/shared/ui/icons/check-rounded.tsx';
import { Ellipse, EllipseMobile } from '@/widgets/subscribe/blurred-spots.tsx';

export const Subscribe = () => {
  const isMobile = useIsMobile();
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successSended, setSuccessSended] = useState(false);
  const [loading, setLoading] = useState(false);

  const buttonClasses = '!laptop:text-[18px] !text-[16px] !text-white !font-semibold';
  const buttonBackground = successSended ? 'rgba(106, 86, 246, 0.20)' : '';

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const emailValue = e.target.value;
    const validEmail = EMAIL_REGEXP.test(emailValue);

    if (validEmail) {
      setErrorMsg('');
    }

    setEmail(emailValue);
  };

  const handleSubmit = () => {
    const validEmail = EMAIL_REGEXP.test(email);

    if (validEmail) {
      setLoading(true);
      setTimeout(() => {
        setSuccessSended(true);
        setLoading(false);
        setEmail('');
      }, 2000);
    } else {
      setErrorMsg('invalid email');
    }
  };

  return (
    <div
      style={{ background: 'rgba(38, 39, 43, 0.42)' }}
      className={
        'px-[16px] laptop:px-[64px] py-[24px] laptop:py-[47px] rounded-[16px] laptop:rounded-[20px] border border-borderMain overflow-hidden relative'
      }
    >
      <div className={'absolute h-full w-full inset-0 bg-noise bg-cover opacity-[0.1]'}></div>
      <div
        className={
          'absolute h-full w-full laptop:w-[640px] top-0 left-0 laptop:bg-grid bg-gridMob bg-contain'
        }
      ></div>
      {isMobile && <EllipseMobile />}
      {!isMobile && <Ellipse />}
      <div
        className={
          'flex flex-col laptop:flex-row gap-[16px] items-center laptop:justify-between relative z-10'
        }
      >
        <Image
          className={'absolute top-[-3%] left-[-15%] laptop:top-[-40%] laptop:left-[27%]'}
          src={'/images/letter-large.webp'}
          lazy
        />
        <Image
          className={'absolute top-[34%] left-[60%] laptop:top-[60%] laptop:left-[37%]'}
          src={'/images/letter-medium.webp'}
          lazy
        />
        <Image
          className={'absolute top-[-5%] left-[83%] laptop:top-[-30%] laptop:left-[42%]'}
          src={'/images/letter-small.webp'}
          lazy
        />
        <h3
          className={
            'text-white text-[28px] laptop:text-[32px] text-center laptop:text-left font-semibold leading-[120%] laptop:max-w-[221px] mb-[8px] laptop:mb-0'
          }
        >
          Subscribe to our newsletter
        </h3>
        <div
          style={{
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: successSended ? 'rgba(106, 86, 246, 0.24)' : '#020106',
          }}
          className={
            'w-full laptop:w-[440px] rounded-[42px] backdrop-blur-[12px] py-[13px] laptop:py-[6px] pr-[6px] pl-[16px] laptop:pl-[20px] flex'
          }
        >
          <input
            value={email}
            disabled={successSended}
            onChange={(event) => onChange(event)}
            placeholder={successSended ? 'Thank you for subscribing!' : 'Enter your email'}
            className={
              'outline-0 bg-transparent text-white placeholder:text-[#B9C0D4] laptop:text-[18px] leading-[24px] flex-[1_1_50%]'
            }
          />
          <Button
            style={{ background: buttonBackground }}
            disabled={successSended}
            loading={loading}
            onClick={() => handleSubmit()}
            className={classNames(
              buttonClasses,
              'ml-auto hidden laptop:block',
              {
                ['laptop:w-[180px]']: !successSended,
              },
              { ['!border-[#6A56F6] !px-[14px]']: successSended },
            )}
            variant={'outline'}
            size={'48'}
          >
            {successSended ? <CheckViolet /> : 'Subscribe'}
          </Button>
        </div>
        <Button
          style={{ background: buttonBackground }}
          fullWidth
          onClick={() => handleSubmit()}
          disabled={successSended}
          loading={loading}
          className={classNames(buttonClasses, 'laptop:hidden', {
            ['!border-[#6A56F6]']: successSended,
          })}
          variant={'outline'}
          size={'52'}
        >
          {successSended ? <CheckViolet /> : 'Subscribe'}
        </Button>
      </div>
    </div>
  );
};
