import React from 'react';

export const ReferralWidgetSpot = () => {
  return (
    <svg
      className={'absolute top-0 left-0'}
      xmlns="http://www.w3.org/2000/svg"
      width="194"
      height="194"
      viewBox="0 0 194 194"
      fill="none"
    >
      <g clipPath="url(#clip0_723_687)">
        <g filter="url(#filter0_f_723_687)">
          <ellipse cx="11.5" cy="10.5" rx="78.5" ry="30.5" fill="#6A56F6" fillOpacity="0.32" />
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_723_687"
          x="-147"
          y="-100"
          width="317"
          height="221"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="40" result="effect1_foregroundBlur_723_687" />
        </filter>
        <clipPath id="clip0_723_687">
          <path d="M0 12C0 5.37258 5.37258 0 12 0H194V194H0V12Z" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};