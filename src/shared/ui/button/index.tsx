import classNames from 'classnames';
import React, { DetailedHTMLProps, FC, useRef } from 'react';

// import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';

import { Loading } from '@/shared';

export type BtnSize = '58' | '52' | '48' | '44' | '36' | '32' | '40';

interface ButtonProps
  extends DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  fullWidth?: boolean;
  fontSize?: any;
  maxwidth?: string;
  loading?: boolean;
  size?: BtnSize;
  name?: string;
  check?: boolean;
  to?: string;
  withAnim?: boolean;
}

export const Button: FC<ButtonProps> = ({
  size = '58',
  variant = 'primary',
  children,
  fullWidth,
  name,
  loading,
  check,
  to,
  withAnim = true,
  ...otherProp
}) => {
  // const navigate = useNavigate();

  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLink = () => {
    if (!to) return;
    // navigate(to);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    button.style.setProperty('--x', `${x}px`);
    button.style.setProperty('--y', `${y}px`);
  };
  return (
    <button
      disabled={loading}
      aria-label={name}
      style={{ maxWidth: otherProp?.maxwidth, ...otherProp?.style }}
      {...otherProp}
      ref={buttonRef}
      className={classNames(otherProp.className, styles.base, {
        [styles.size32]: size === '32',
        [styles.size36]: size === '36',
        [styles.size40]: size === '40',
        [styles.size44]: size === '44',
        [styles.size48]: size === '48',
        [styles.size52]: size === '52',
        [styles.size58]: size === '58',
        [styles.check]: check,
        [styles.primary]: variant === 'primary',
        [styles.outline]: variant === 'outline',
        [styles.secondary]: variant === 'secondary',
        [styles.white]: variant === 'white',
        [styles.fullWidth]: fullWidth,
        [styles.loading]: loading,
        [styles.anim]: withAnim,
      })}
      onMouseMove={handleMouseMove}
      onClick={to ? handleLink : otherProp.onClick}
    >
      <>
        {children}
        {loading && <Loading />}
      </>
    </button>
  );
};
