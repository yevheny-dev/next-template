import React, { FC, ReactNode } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';

interface Props {
  children: ReactNode;
  className?: string;
  height?: number;
  key?: any;
}

export const Scrollbar: FC<Props> = ({ children, className, height, key }) => {
  return (
    <Scrollbars
      key={key}
      //autoHide
      className={className}
      style={{ height }}
      renderThumbVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            background: '#fff!important',
            borderRadius: '10px',
            display: 'block!important',
            visibility: 'visible',
          }}
        />
      )}
      renderTrackVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            backgroundColor: '#fff',
            borderRadius: '10px',
            display: 'block',
            visibility: 'visible',
          }}
        />
      )}
    >
      {children}
    </Scrollbars>
  );
};
