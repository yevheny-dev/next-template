import React from 'react';

export const Ellipse = () => {
  return (
    <svg
      className={'absolute top-0 left-0'}
      xmlns="http://www.w3.org/2000/svg"
      width="900"
      height="170"
      viewBox="0 0 900 170"
      fill="none"
    >
      <g filter="url(#filter0_f_492_3476)">
        <path
          d="M760 2.09687e-05C760 22.6437 444.5 21 263 73.5C178.825 97.8481 51 87.6256 51 -0.000102997C51 -48 209.715 -41 405.5 -41C601.285 -40.9999 760 -22.6436 760 2.09687e-05Z"
          fill="#6A56F6"
          fillOpacity="0.32"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_492_3476"
          x="-89"
          y="-181.357"
          width="989"
          height="406.281"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="70" result="effect1_foregroundBlur_492_3476" />
        </filter>
      </defs>
    </svg>
  );
};

export const EllipseMobile = () => {
  return (
    <svg
      className={'absolute top-0 left-0 w-full'}
      xmlns="http://www.w3.org/2000/svg"
      width="328"
      height="181"
      viewBox="0 0 328 181"
      fill="none"
    >
      <g filter="url(#filter0_f_281_125)">
        <path
          d="M460 27.8375C460 43.079 247.738 41.9726 125.629 77.3106C68.9979 93.6994 -17 86.8186 -17 27.8374C-17 -4.47147 89.7801 0.24025 221.5 0.240273C353.22 0.240296 460 12.596 460 27.8375Z"
          fill="#6A56F6"
          fillOpacity="0.32"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_281_125"
          x="-113"
          y="-96"
          width="669"
          height="277"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="48" result="effect1_foregroundBlur_281_125" />
        </filter>
      </defs>
    </svg>
  );
};
