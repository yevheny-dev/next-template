import React, { useState } from 'react';

import './index.scss';

interface Props {
  ariaLabel?: string;
  defaultValue?: number;
  getAriaValueText?: (value: number) => string; // const valuetext = (value: number) => `${value}°C`;
  valueLabelDisplay?: 'auto' | 'on' | 'off';
  shiftStep?: number;
  step?: number;
  min: number;
  max: number;
}

export const RangeSlider: React.FC<Props> = ({
  ariaLabel,
  defaultValue = 0,
  step = 1,
  min,
  max,
}) => {
  const [value, setValue] = useState<number>(defaultValue);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    setValue(newValue);
  };

  const safeDiference = max - min || 0;

  const percentage = ((value - min) / safeDiference) * 100;

  return (
    <div className="slider-container">
      <input
        type="range"
        aria-label={ariaLabel}
        value={value}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        style={{
          background: `linear-gradient(to right, #6A57F6 ${percentage}%, #48485b ${percentage}%)`,
        }}
      />
      <div className="slider-marks">
        {Array.from({ length: safeDiference / step + 1 }, (_, index) => {
          const markValue = min + index * step;
          return (
            <div
              key={markValue}
              className={`slider-mark ${markValue === value ? 'active' : ''}`}
              style={{
                left: `${((markValue - min) / safeDiference) * 100}%`,
                background: `${markValue <= value ? '#6A57F6' : '#B9C0D4'}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
