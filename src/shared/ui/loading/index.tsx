import classNames from 'classnames';
import React from 'react';

import style from './index.module.scss';

export const Loading = ({ size = 16 }: { size?: number }) => {
  const containerClasses = `w-[${size}px] h-[${size}px]`;
  return (
    <div className={classNames(containerClasses)}>
      <svg
        className={style.rotate}
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        viewBox="0 0 18 18"
        fill="none"
      >
        <path d="M9 1.57147L9 3.57147" stroke="#6A56F6" strokeWidth="2" strokeLinecap="round" />
        <path
          d="M16.4287 9.00012L14.4287 9.00012"
          stroke="#6A56F6"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M9 16.4288L9 14.4288"
          stroke="#6A56F6"
          strokeOpacity="0.16"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M1.57129 9.00012L3.57129 9.00012"
          stroke="#6A56F6"
          strokeOpacity="0.64"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M14.2529 3.74725L12.8387 5.16147"
          stroke="#6A56F6"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M3.74707 14.253L5.16128 12.8388"
          stroke="#6A56F6"
          strokeOpacity="0.32"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M3.74707 3.74725L5.16128 5.16147"
          stroke="#6A56F6"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
