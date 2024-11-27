import classNames from 'classnames';
import React, { useRef } from 'react';

import { useIsMobile, useInView } from '@/shared';

import styles from './index.module.scss';

type Props = {
  src: string;
  mobSrc?: string;
  absolute?: boolean;
  lazy?: boolean;
  alt?: string;
  className?: string;
  conMaxWidth?: string;
  conMaxHeight?: string;
  objectFit?: 'cover' | 'contain';
  root?: HTMLElement;
  style?: any;
};

export const Image = ({
  lazy = false,
  absolute,
  src,
  mobSrc,
  alt = 'img',
  className,
  conMaxWidth = '',
  conMaxHeight = '',
  root,
  objectFit = 'contain',
  style,
  ...props
}: Props) => {
  const isMobile = useIsMobile();
  const ref = useRef<HTMLImageElement | null>(null);
  const inView = useInView(ref, {
    root: root || undefined,
    rootMargin: '100%',
    threshold: 0,
    once: true,
  });

  const classes = classNames(
    styles.Image,
    {
      [styles.load]: inView || !lazy,
      [styles.absolute]: absolute,
      [styles.fadeIn]: inView,
    },
    className,
  );
  const stylesCss = { maxWidth: conMaxWidth, maxHeight: conMaxHeight, ...style };
  const srcAttr = isMobile && mobSrc ? mobSrc : src;

  return (
    <img
      ref={ref}
      className={classes}
      src={!lazy ? srcAttr : inView ? srcAttr : ''}
      alt={alt}
      style={{ ...stylesCss, objectFit }}
      {...props}
    />
  );
};
