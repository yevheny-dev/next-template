import React, { FC, useEffect, useState } from 'react';
import { useIsMobile } from '@/shared';
import {ProgressBar} from '@/shared/ui/progress-bar';

export type BonusStep = {
  percentage: number;
  value: number;
};

interface Props {
  values: BonusStep[];
  currentStep: number;
}

const textClass =
  'font-semibold text-[12px] laptop:text-[14px] leading-[100%] text-white whitespace-nowrap';

export const BonusProgress: FC<Props> = ({ values, currentStep }) => {
  const isMobile = useIsMobile();
  const [visibleSteps, setVisibleSteps] = useState<BonusStep[]>(values);

  useEffect(() => {
    if (!isMobile) {
      setVisibleSteps(values);
    } else {
      if (currentStep === 0) {
        setVisibleSteps(values.slice(0, 3));
      } else if (currentStep === values.length - 1) {
        setVisibleSteps(values.slice(-3));
      } else {
        setVisibleSteps(values.slice(currentStep - 1, currentStep + 2));
      }
    }
  }, [isMobile, values, currentStep]);

  return (
    <div className={'flex w-full items-center py-[24px]'}>
      {visibleSteps.map((value, index) => {
        const stepIndex = isMobile ? values.indexOf(value) : index;
        return (
          <BonusStep
            step={value}
            key={value.percentage}
            isFirst={stepIndex === 0}
            isActive={stepIndex === currentStep}
            isAchieved={stepIndex <= currentStep}
            isLast={stepIndex === values.length - 1}
          />
        );
      })}
    </div>
  );
};

const BonusStep = ({
  isFirst,
  isActive,
  isAchieved,
  step,
  isLast,
}: {
  step: BonusStep;
  isFirst: boolean;
  isActive?: boolean;
  isAchieved: boolean;
  isLast: boolean;
}) => {
  return (
    <div
      className={`flex items-center ${isFirst ? 'flex-[0_0_auto]' : 'flex-[1_1_100%]'}`}
    >
      {!isFirst && (
          <ProgressBar percent={isAchieved ? 100 : 0} />
      )}
      <div
        className={`relative ${isActive ? 'p-[6px] flex justify-center items-center' : 'px-[2px] py-[10px]'}`}
      >
        <span
          className={`${textClass} absolute top-[-30px] ${isActive && '!top-[-40px] rounded-[35px] border-[1px] border-[solid] border-[#FFF] bg-[#6A56F6] pb-[4px] pt-[6px] px-[10px]'} ${isFirst ? 'left-0' : 'right-0'} ${!isFirst && !isLast ? 'translate-x-[35%]' : ''}`}
        >
          {step.percentage}%
        </span>
        <span
          style={{ color: 'rgba(185, 192, 212, 0.54)' }}
          className={`${textClass} ${isActive && '!text-white !bottom-[-30px]'} absolute bottom-[-22px] ${isFirst ? 'left-0' : 'right-0'} ${!isFirst && !isLast ? 'translate-x-[35%]' : ''}`}
        >
          ${step.value}+
        </span>
      </div>
    </div>
  );
};
