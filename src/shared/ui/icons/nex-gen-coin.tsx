import React from 'react';

import { useIsMobile } from '@/shared';

export const Coin = () => {
  const isMobile = useIsMobile();
  return (
    <svg
      width={isMobile ? '56px' : '80px'}
      height={isMobile ? '56px' : '80px'}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_126_1099)">
        <rect width="80" height="80" rx="12" fill="#1A1A1E" />
        <g opacity="0.64">
          <g filter="url(#filter0_f_126_1099)">
            <ellipse cx="19.5" cy="66.5" rx="22.5" ry="13.5" fill="#B45AFA" />
          </g>
          <g filter="url(#filter1_f_126_1099)">
            <ellipse cx="62" cy="66" rx="20" ry="12" fill="#5A87FA" />
          </g>
        </g>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M22.0833 40.0002C22.0833 49.8835 30.1166 57.9168 40 57.9168C49.8833 57.9168 57.9166 49.8835 57.9166 40.0002C57.9166 39.3168 57.35 38.7502 56.6666 38.7502C55.9833 38.7502 55.4166 39.3168 55.4166 40.0002C55.4166 48.5002 48.5 55.4168 40 55.4168C31.5 55.4168 24.5833 48.5002 24.5833 40.0002C24.5833 31.5002 31.5 24.5835 40 24.5835C40.6833 24.5835 41.25 24.0168 41.25 23.3335C41.25 22.6502 40.6833 22.0835 40 22.0835C30.1166 22.0835 22.0833 30.1168 22.0833 40.0002ZM40 48.75C39.3167 48.75 38.75 48.1833 38.75 47.5V47.0832H38.6167C36.4 47.0832 34.5833 45.2166 34.5833 42.9166C34.5833 42.2332 35.15 41.6666 35.8333 41.6666C36.5166 41.6666 37.0833 42.2332 37.0833 42.9166C37.0833 43.8332 37.7667 44.5832 38.6167 44.5832H38.75V40.8813L37.0833 40.2999C36.0166 39.9165 34.5833 39.1499 34.5833 36.6999C34.5833 34.6166 36.2333 32.8999 38.25 32.8999H38.75V32.5C38.75 31.8167 39.3167 31.25 40 31.25C40.6833 31.25 41.25 31.8167 41.25 32.5V32.8999H41.3833C43.6 32.8999 45.4166 34.7666 45.4166 37.0666C45.4166 37.7499 44.85 38.3166 44.1666 38.3166C43.4833 38.3166 42.9166 37.7499 42.9166 37.0666C42.9166 36.1499 42.2333 35.3999 41.3833 35.3999H41.25V39.1018L42.9166 39.6832C43.9833 40.0666 45.4166 40.8332 45.4166 43.2832C45.4166 45.3832 43.7666 47.0832 41.75 47.0832H41.25V47.5C41.25 48.1833 40.6833 48.75 40 48.75ZM41.75 44.5832H41.25V41.7534L42.1 42.0499C42.6667 42.2499 42.9166 42.3832 42.9166 43.2832C42.9166 43.9999 42.4 44.5832 41.75 44.5832ZM38.75 35.3999V38.2297L37.9 37.9332C37.3333 37.7332 37.0833 37.5999 37.0833 36.6999C37.0833 35.9832 37.6 35.3999 38.25 35.3999H38.75ZM56.6667 31.2502C55.9833 31.2502 55.4167 30.6835 55.4167 30.0002V26.3498L49.2166 32.5499C48.9666 32.7999 48.6499 32.9166 48.3332 32.9166C48.0166 32.9166 47.6999 32.7999 47.4499 32.5499C46.9666 32.0666 46.9666 31.2666 47.4499 30.7832L53.6496 24.5835H50C49.3167 24.5835 48.75 24.0168 48.75 23.3335C48.75 22.6502 49.3167 22.0835 50 22.0835H56.6667C56.847 22.0835 57.0192 22.123 57.175 22.1936C57.3116 22.2536 57.4391 22.3391 57.5499 22.4499C57.657 22.557 57.7404 22.6797 57.8001 22.8111C57.8748 22.9706 57.9167 23.1477 57.9167 23.3335V30.0002C57.9167 30.6835 57.35 31.2502 56.6667 31.2502Z"
          fill="url(#paint0_linear_126_1099)"
        />
        <circle
          cx="40"
          cy="40"
          r="25.7"
          stroke="url(#paint1_linear_126_1099)"
          strokeOpacity="0.42"
          strokeWidth="0.6"
        />
        <circle
          cx="40"
          cy="40"
          r="35.85"
          stroke="url(#paint2_linear_126_1099)"
          strokeOpacity="0.24"
          strokeWidth="0.3"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_126_1099"
          x="-35"
          y="21"
          width="109"
          height="91"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur_126_1099" />
        </filter>
        <filter
          id="filter1_f_126_1099"
          x="10"
          y="22"
          width="104"
          height="88"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur_126_1099" />
        </filter>
        <linearGradient
          id="paint0_linear_126_1099"
          x1="40"
          y1="22.0835"
          x2="40"
          y2="57.9168"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_126_1099"
          x1="40"
          y1="14"
          x2="40"
          y2="66"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_126_1099"
          x1="40"
          y1="4"
          x2="40"
          y2="76"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <clipPath id="clip0_126_1099">
          <rect width="80" height="80" rx="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
