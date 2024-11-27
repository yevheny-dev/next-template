import React, { useState } from 'react';

import { SearchIcon } from '../icons/search';

import styles from './index.module.scss';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  refProp?: React.Ref<HTMLInputElement>;
}

export const SearchField: React.FC<Props> = ({ className = '', refProp, ...props }) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div className={`${styles.field} ${className} ${isFocus ? styles.focus : ''}`}>
      <SearchIcon />
      <input
        className={styles.input}
        ref={refProp}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        {...props}
      />
    </div>
  );
};
