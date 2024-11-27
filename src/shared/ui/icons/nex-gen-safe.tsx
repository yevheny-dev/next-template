import React from 'react';

import { useIsMobile } from '@/shared';

export const Safe = () => {
  const isMobile = useIsMobile();
  return (
    <svg
      width={isMobile ? '56px' : '80px'}
      height={isMobile ? '56px' : '80px'}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_126_1119)">
        <rect width="80" height="80" rx="12" fill="#1A1A1E" />
        <path
          d="M39.9614 63.6348C39.43 63.6348 38.8986 63.5685 38.3893 63.4135C26.8972 60.247 18.5714 49.5077 18.5714 37.8605V28.1398C18.5714 25.6598 20.365 22.9806 22.6679 22.0285L35.0015 16.9798C38.2122 15.6734 41.7328 15.6734 44.9214 16.9798L57.255 22.0285C59.5579 22.9806 61.3514 25.6598 61.3514 28.1398V37.8605C61.3514 49.4855 53.0036 60.2249 41.5336 63.4135C41.0243 63.5685 40.4929 63.6348 39.9614 63.6348ZM39.9614 19.3491C38.6993 19.3491 37.4593 19.5927 36.2635 20.0799L23.93 25.1284C22.8672 25.5712 21.8929 27.0105 21.8929 28.1619V37.8827C21.8929 48.0463 29.2 57.4349 39.275 60.2249C39.7179 60.3577 40.205 60.3577 40.6479 60.2249C50.7229 57.4349 58.03 48.0463 58.03 37.8827V28.1619C58.03 27.0105 57.0557 25.5712 55.9928 25.1284L43.6593 20.0799C42.4636 19.5927 41.2236 19.3491 39.9614 19.3491Z"
          fill="url(#paint0_linear_126_1119)"
        />
        <path
          d="M37.4117 79.0404L37.4117 79.0404C38.2472 79.2917 39.1218 79.4 40 79.4C40.8782 79.4 41.7528 79.2917 42.5883 79.0404L42.593 79.039L42.593 79.0391C61.8152 73.7602 75.8 55.9798 75.8 36.7464V20.5842C75.8 16.5437 72.8322 12.1618 69.0306 10.6086L37.4117 79.0404ZM37.4117 79.0404L37.4066 79.039C18.1478 73.7969 4.2 56.017 4.2 36.7464V20.5842C4.2 16.5435 7.16816 12.1613 10.9701 10.6084M37.4117 79.0404L10.9701 10.6084M10.9701 10.6084L31.7268 2.21469C37.0828 0.0617347 42.9546 0.0619286 48.2727 2.21451L48.2728 2.21454L69.0299 10.6084H10.9701Z"
          stroke="url(#paint1_linear_126_1119)"
          strokeOpacity="0.24"
          strokeWidth="0.4"
        />
        <path
          d="M41.086 72.6502L41.0901 72.649C57.1544 68.2457 68.8 53.4278 68.8 37.4001V21.9799C68.8 21.1187 68.4295 20.13 67.841 19.2648C67.2528 18.4001 66.4647 17.6851 65.6594 17.3528C65.6592 17.3528 65.6591 17.3527 65.6589 17.3526L45.8944 9.34469L41.086 72.6502ZM41.086 72.6502C40.4134 72.8499 39.6723 72.8499 38.9997 72.6502L38.9957 72.6491M41.086 72.6502L38.9957 72.6491M38.9957 72.6491C22.9307 68.2456 11.2 53.4271 11.2 37.4001V21.9799C11.2 21.1187 11.5705 20.13 12.159 19.2648C12.7472 18.4002 13.5351 17.6853 14.3404 17.3529C14.3406 17.3528 14.3408 17.3527 14.3411 17.3526L34.1914 9.34469C34.1914 9.34469 34.1914 9.34468 34.1914 9.34468M38.9957 72.6491L34.1914 9.34468M34.1914 9.34468C36.0842 8.58139 38.0461 8.2 40.0429 8.2M34.1914 9.34468L40.0429 8.2M40.0429 8.2C42.0395 8.2 44.0014 8.58135 45.8941 9.34457L40.0429 8.2Z"
          stroke="url(#paint2_linear_126_1119)"
          strokeOpacity="0.42"
          strokeWidth="0.4"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.2857 43.4191C45.5854 42.4875 48 39.457 48 35.8571C48 31.5143 44.4857 28 40.1428 28C35.8 28 32.2857 31.5143 32.2857 35.8571C32.2857 39.457 34.7003 42.4875 38 43.4191V50.1425C38 51.3139 38.9714 52.2854 40.1429 52.2854C41.3143 52.2854 42.2857 51.3139 42.2857 50.1425V43.4191ZM40.1739 39.4284C42.1311 39.4117 43.7143 37.8182 43.7143 35.8571C43.7143 33.8857 42.1143 32.2857 40.1428 32.2857C38.1714 32.2857 36.5714 33.8857 36.5714 35.8571C36.5714 37.8182 38.1546 39.4117 40.1118 39.4284C40.1221 39.4283 40.1325 39.4282 40.1429 39.4282C40.1532 39.4282 40.1636 39.4283 40.1739 39.4284Z"
          fill="#292D32"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M42.2857 43.4191C45.5854 42.4875 48 39.457 48 35.8571C48 31.5143 44.4857 28 40.1428 28C35.8 28 32.2857 31.5143 32.2857 35.8571C32.2857 39.457 34.7003 42.4875 38 43.4191V50.1425C38 51.3139 38.9714 52.2854 40.1429 52.2854C41.3143 52.2854 42.2857 51.3139 42.2857 50.1425V43.4191ZM40.1739 39.4284C42.1311 39.4117 43.7143 37.8182 43.7143 35.8571C43.7143 33.8857 42.1143 32.2857 40.1428 32.2857C38.1714 32.2857 36.5714 33.8857 36.5714 35.8571C36.5714 37.8182 38.1546 39.4117 40.1118 39.4284C40.1221 39.4283 40.1325 39.4282 40.1429 39.4282C40.1532 39.4282 40.1636 39.4283 40.1739 39.4284Z"
          fill="url(#paint3_linear_126_1119)"
          fillOpacity="0.84"
        />
        <g opacity="0.64">
          <g filter="url(#filter0_f_126_1119)">
            <ellipse cx="19.5" cy="66.5" rx="22.5" ry="13.5" fill="#B45AFA" />
          </g>
          <g filter="url(#filter1_f_126_1119)">
            <ellipse cx="62" cy="66" rx="20" ry="12" fill="#5A87FA" />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_126_1119"
          x="-35"
          y="21"
          width="109"
          height="91"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur_126_1119" />
        </filter>
        <filter
          id="filter1_f_126_1119"
          x="10"
          y="22"
          width="104"
          height="88"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="16" result="effect1_foregroundBlur_126_1119" />
        </filter>
        <linearGradient
          id="paint0_linear_126_1119"
          x1="39.9614"
          y1="16"
          x2="39.9614"
          y2="63.6348"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_126_1119"
          x1="40"
          y1="0.400024"
          x2="40"
          y2="79.6"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <linearGradient
          id="paint2_linear_126_1119"
          x1="40.0429"
          y1="2.68728"
          x2="40.0429"
          y2="78.2513"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <linearGradient
          id="paint3_linear_126_1119"
          x1="40.1428"
          y1="28"
          x2="40.1428"
          y2="52.2854"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6A56F6" />
          <stop offset="1" stopColor="#4B39C8" />
        </linearGradient>
        <clipPath id="clip0_126_1119">
          <rect width="80" height="80" rx="12" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};
