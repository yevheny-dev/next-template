import React, { FC, useEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { lockBodyScroll, Image } from '@/shared';
import { LightBorder, LightCorner } from '../icons';
import { ModalClose } from '../icons/modal-close';
import styles from './index.module.scss';

interface Props {
  title: string;
  size?: 392 | 440;
  onClose?: (...args: any[]) => void;
  children: ReactNode;
}

export const Modal: FC<Props> = ({ onClose, children, title, size }) => {
  const ref = useRef<HTMLDivElement>(null);

  const myClose = (e: any) => {
    if (ref.current) {
      ref.current.classList.remove('opacity-100');
    }
    setTimeout(() => {
      lockBodyScroll(false)
      onClose && onClose(e);
    }, 300);
  };

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.classList.add('opacity-100');
      }
    }, 0);

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        myClose(e);
      }
    };

    document.addEventListener('keydown', handleEscape);

    lockBodyScroll(true);
    return () => {
      lockBodyScroll(false);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  return createPortal(
    <div
      ref={ref}
      id={styles.modal}
      tabIndex={-1}
      aria-hidden="true"
      onClick={(e) => myClose(e)}
      className="transition-all duration-300 opacity-0 fixed h-screen z-[901] top-0 left-0 right-0 flex items-center w-full p-4 overflow-y-auto overflow-x-hidden"
    >
      {/* <Image
        className={'absolute right-0 top-0 pointer-events-none max-h-screen'}
        src={'/images/hero/light-right.webp'}
      />  */}
      {/* <Image
        className={'absolute left-0 top-0 pointer-events-none max-h-screen'}
        src={'/images/hero/light-left.webp'}

      />   */}

      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`${styles.modalContent} m-auto z-[901]`}
        style={{
          maxWidth: size ? size : 392,
          backgroundImage: `url('./assets/overlay.svg')`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <LightCorner />
        <LightBorder />
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>
            <h3 className="ml-2">{title}</h3>
          </h5>
          <button onClick={(e) => myClose(e)} type="button" className={styles.btnClose}>
            <ModalClose />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
};
