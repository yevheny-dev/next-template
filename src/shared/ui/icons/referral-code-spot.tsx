import React from 'react';

export const ReferralCodeSpot = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className ? className : 'absolute right-0 top-0 z-[-1]'}
      xmlns="http://www.w3.org/2000/svg"
      width="279"
      height="186"
      viewBox="0 0 279 186"
      fill="none"
    >
      <g filter="url(#filter0_f_645_3967)">
        <ellipse
          cx="114.533"
          cy="44.5"
          rx="114.533"
          ry="44.5"
          transform="matrix(-1 8.74228e-08 8.74228e-08 1 346 -20)"
          fill="#6A56F6"
          fillOpacity="0.36"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_645_3967"
          x="0.214466"
          y="-136.72"
          width="462.506"
          height="322.44"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="58.36" result="effect1_foregroundBlur_645_3967" />
        </filter>
      </defs>
    </svg>
  );
};
