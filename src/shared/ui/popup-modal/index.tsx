import React from 'react';
import './index.scss';

export const Modal = ({ isOpen, children }: any) => {
  return (
    <div id="custom-modal" style={{ display: isOpen ? 'flex' : 'none' }}>
      <div
        className="custom-modal-inner"
        onClick={(e) => {
          e?.stopPropagation();
        }}
      >
        {children}
      </div>
    </div>
  );
};
