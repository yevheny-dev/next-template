import React from 'react';

import styles from './index.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  refProp?: React.Ref<HTMLInputElement>;
}

export const Input: React.FC<Props> = ({ className = '', refProp, ...props }) => {
  return <input className={`${styles.input} ${className}`} ref={refProp} {...props} />;
};
