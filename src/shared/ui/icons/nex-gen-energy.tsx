import React from 'react';

import { useIsMobile } from '@/shared';

export const Energy = () => {
  const isMobile = useIsMobile();
  return (
    <svg
      width={isMobile ? '56px' : '80px'}
      height={isMobile ? '56px' : '80px'}
      viewBox="0 0 81 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_126_1177)">
        <rect x="0.5" width="80" height="80" rx="12" fill="#1A1A1E" />
        <g opacity="0.64">
          <g filter="url(#filter0_f_126_1177)">
            <ellipse cx="20" cy="66.5" rx="22.5" ry="13.5" fill="#B45AFA" />
          </g>
          <g filter="url(#filter1_f_126_1177)">
            <ellipse cx="62.5" cy="66" rx="20" ry="12" fill="#5A87FA" />
          </g>
        </g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M41.9833 57.0999C42.35 57.2333 42.7333 57.2999 43.1166 57.2999C43.9999 57.2999 44.8666 56.9333 45.4833 56.2333L58.0999 41.8999C58.9333 40.9499 59.1333 39.6499 58.6166 38.4999C58.0999 37.3499 57 36.6333 55.7333 36.6333H51.8332V25.8833C51.8332 24.5499 51.0333 23.3833 49.7833 22.9166C48.5333 22.4333 47.1666 22.7833 46.2833 23.7833L33.6666 38.1166C32.8333 39.0666 32.6333 40.3666 33.1499 41.5166C33.6666 42.6666 34.7666 43.3833 36.0333 43.3833H39.9333V54.1333C39.9333 55.4666 40.7333 56.6333 41.9833 57.0999ZM48.1499 25.4333C48.2999 25.2499 48.4833 25.1999 48.6333 25.1999C48.7333 25.1999 48.8333 25.2166 48.8833 25.2499C49.0166 25.2999 49.3166 25.4666 49.3166 25.8833V37.8833C49.3166 38.5666 49.8833 39.1333 50.5666 39.1333H55.7166C56.1166 39.1333 56.2833 39.4166 56.3333 39.5333C56.3833 39.6499 56.4833 39.9499 56.2166 40.2499L43.5999 54.5999C43.3332 54.9166 43 54.8333 42.8666 54.7833C42.7333 54.7333 42.4333 54.5666 42.4333 54.1499V42.1499C42.4333 41.4666 41.8666 40.8999 41.1833 40.8999H36.0333C35.6333 40.8999 35.4666 40.6166 35.4166 40.4999C35.3666 40.3833 35.2666 40.0833 35.5332 39.7833L48.1499 25.4333ZM23 27.9165H34.6667C35.35 27.9165 35.9167 27.3498 35.9167 26.6665C35.9167 25.9832 35.35 25.4165 34.6667 25.4165H23C22.3167 25.4165 21.75 25.9832 21.75 26.6665C21.75 27.3498 22.3167 27.9165 23 27.9165ZM34.25 53.3335C34.25 54.0168 33.6833 54.5835 33 54.5835H23C22.3167 54.5835 21.75 54.0168 21.75 53.3335C21.75 52.6502 22.3167 52.0835 23 52.0835H33C33.6833 52.0835 34.25 52.6502 34.25 53.3335ZM23 41.25H28C28.6833 41.25 29.25 40.6833 29.25 40C29.25 39.3167 28.6833 38.75 28 38.75H23C22.3167 38.75 21.75 39.3167 21.75 40C21.75 40.6833 22.3167 41.25 23 41.25Z"
          fill="url(#paint0_linear_126_1177)"
        />
        <path
          d="M26.0296 38.657L48.518 13.8422C49.7466 12.4865 52 13.3556 52 15.1852V37C52 38.1046 52.8954 39 54 39H63.3903C65.1402 39 66.0463 41.0884 64.8509 42.3663L42.4605 66.3008C41.2212 67.6256 39 66.7486 39 64.9345V44C39 42.8954 38.1046 42 37 42H27.5116C25.7768 42 24.8647 39.9424 26.0296 38.657Z"
          stroke="#6A56F6"
          strokeOpacity="0.42"
          strokeWidth="0.6"
          strokeLinecap="round"
        />
        <path
          d="M16.1472 39.4341L51.428 1.7014C52.6672 0.376114 54.8889 1.25299 54.8889 3.06736V36.6C54.8889 37.7046 55.7843 38.6 56.8889 38.6H73.29C75.0548 38.6 75.9546 40.7191 74.7291 41.9889L39.5502 78.4369C38.3008 79.7313 36.1111 78.8469 36.1111 77.0479V44.8C36.1111 43.6954 35.2157 42.8 34.1111 42.8H17.6081C15.8585 42.8 14.9523 40.712 16.1472 39.4341Z"
          stroke="#6A56F6"
          strokeOpacity="0.24"
          strokeWidth="0.3"
          strokeLinecap="round"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_126_1177"
          x="-34.5"
          y="21"
          width="109"
          height="91"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur_126_1177" />
        </filter>
        <filter
          id="filter1_f_126_1177"
          x="10.5"
          y="22"
          width="104"
          height="88"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur_126_1177" />
        </filter>
        <linearGradient
          id="paint0_linear_126_1177"
          x1="40.325"
          y1="22.7017"
          x2="40.325"
          y2="57.2999"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <clipPath id="clip0_126_1177">
          <rect x="0.5" width="80" height="80" rx="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
