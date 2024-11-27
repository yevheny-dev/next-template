import React, { FC, ReactNode } from 'react';

import { CopyBtn } from '../copy-btn';

import styles from './index.module.scss';

interface Props {
  content: ReactNode;
  copyText: string;
}

export const CopyField: FC<Props> = ({ content, copyText }) => {
  return (
    <div className={styles.copyField}>
      {content}
      <CopyBtn text={copyText} />
    </div>
  );
};
