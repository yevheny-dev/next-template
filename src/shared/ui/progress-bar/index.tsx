import React, { FC, useEffect, useRef, useState } from 'react';
import './progress.scss';

export const ProgressBar: FC<{ percent: number }> = ({ percent }) => {
  const safePercent = percent > 100 ? 100 : percent < 0 ? 0 : percent;
  const [bars, setBars] = useState(0);

  const ref = useRef<HTMLDivElement | null>(null);
  const barWidth = 4;

  useEffect(() => {
    if (ref.current) {
      const progress = ref.current.getBoundingClientRect();
      setBars(Math.round(progress.width / (barWidth * 2)));
    }
  }, [ref]);

  return (
    <div ref={ref} className="progress">
      {Array(bars)
        .fill('')
        .map((_, index, arr) => {
          const total = arr.length;
          const r =
            safePercent > 50
              ? Math.floor((total * safePercent) / 100)
              : (total * safePercent) / 100;
          return <span className={`bar ${r > index ? 'active' : ''}`} key={index} />;
        })}
    </div>
  );
};
