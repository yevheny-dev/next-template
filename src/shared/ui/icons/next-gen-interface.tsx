import React from 'react';

import { useIsMobile } from '@/shared';

export const Interface = () => {
  const isMobile = useIsMobile();
  return (
    <svg
      width={isMobile ? '56px' : '80px'}
      height={isMobile ? '56px' : '80px'}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_126_1134)">
        <rect width="80" height="80" rx="12" fill="#1A1A1E" />
        <g opacity="0.64">
          <g filter="url(#filter0_f_126_1134)">
            <ellipse cx="19.5" cy="66.5" rx="22.5" ry="13.5" fill="#B45AFA" />
          </g>
          <g filter="url(#filter1_f_126_1134)">
            <ellipse cx="62" cy="66" rx="20" ry="12" fill="#5A87FA" />
          </g>
        </g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M38.5 51.94H28.88C21.1059 51.94 18.6161 49.6317 18.504 42.1087C18.5013 42.0728 18.5 42.0365 18.5 42C18.5 41.9757 18.5006 41.9516 18.5018 41.9276C18.5006 41.8064 18.5 41.6839 18.5 41.56V28.88C18.5 20.92 20.92 18.5 28.88 18.5H51.1C59.06 18.5 61.48 20.92 61.48 28.88V41.54C61.4802 41.613 61.4802 41.6855 61.4799 41.7575C61.4931 41.8366 61.5 41.9176 61.5 42C61.5 42.0929 61.4913 42.1839 61.4746 42.2724C61.3432 49.669 58.8311 51.94 51.12 51.94H41.5V58.5H49C49.82 58.5 50.5 59.18 50.5 60C50.5 60.82 49.82 61.5 49 61.5H31C30.18 61.5 29.5 60.82 29.5 60C29.5 59.18 30.18 58.5 31 58.5H38.5V51.94ZM28.88 48.92C23.3192 48.92 21.8199 48.0575 21.5494 43.5H58.4306C58.1601 48.0575 56.6608 48.92 51.1 48.92H28.88ZM58.48 40.5H21.5V28.88C21.5 22.6 22.6 21.5 28.88 21.5H51.1C57.38 21.5 58.48 22.6 58.48 28.88V40.5Z"
          fill="url(#paint0_linear_126_1134)"
        />
        <rect
          opacity="0.42"
          x="11.3"
          y="16.3"
          width="57.4"
          height="39.4"
          rx="7.7"
          stroke="url(#paint1_linear_126_1134)"
          strokeWidth="0.6"
        />
        <rect
          opacity="0.24"
          x="4.2"
          y="11.2"
          width="71.6"
          height="49.6"
          rx="7.8"
          stroke="url(#paint2_linear_126_1134)"
          strokeWidth="0.4"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_126_1134"
          x="-35"
          y="21"
          width="109"
          height="91"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur_126_1134" />
        </filter>
        <filter
          id="filter1_f_126_1134"
          x="10"
          y="22"
          width="104"
          height="88"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur_126_1134" />
        </filter>
        <linearGradient
          id="paint0_linear_126_1134"
          x1="40"
          y1="18.5"
          x2="40"
          y2="61.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_126_1134"
          x1="40"
          y1="16"
          x2="40"
          y2="56"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_126_1134"
          x1="40"
          y1="11"
          x2="40"
          y2="61"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <clipPath id="clip0_126_1134">
          <rect width="80" height="80" rx="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
