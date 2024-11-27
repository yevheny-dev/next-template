import classNames from 'classnames';
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  FC,
  Fragment,
  CSSProperties,
  ReactNode,
} from 'react';

type FieldType = 'days' | 'hrs' | 'mins' | 'sec';
type ITimer = {
  [key in FieldType]: string;
};

interface ChildrenClasses {
  dotsClasses: string;
  numClasses: string;
  dateClasses: string;
  cellClasses: string;
}

interface Props {
  till: number | undefined;
  style?: CSSProperties;
  childrenClasses?: ChildrenClasses;
}

export const Timer: FC<Props> = ({ till, style, childrenClasses }) => {
  const [leftTime, setLeftTime] = useState(0);
  const [timeObj, setTimeObj] = useState<ITimer>({
    days: '00',
    hrs: '00',
    mins: '00',
    sec: '00',
  });

  useLayoutEffect(() => {
    if (leftTime === 0) {
      setTimeObj({ days: '00', hrs: '00', mins: '00', sec: '00' });
      return;
    }

    let totalSeconds = Math.floor(leftTime / 1000);

    const calcDays = Math.floor(totalSeconds / (24 * 60 * 60));
    const days = calcDays > 9 ? calcDays.toString() : `0${calcDays}`;
    totalSeconds %= 24 * 60 * 60;

    const calcHours = Math.floor(totalSeconds / (60 * 60));
    const hrs = calcHours > 9 ? calcHours.toString() : `0${calcHours}`;
    totalSeconds %= 60 * 60;

    const calculatedMinutes = Math.floor(totalSeconds / 60);
    const mins = calculatedMinutes > 9 ? calculatedMinutes.toString() : `0${calculatedMinutes}`;
    totalSeconds %= 60;

    const sec = totalSeconds > 9 ? totalSeconds.toString() : `0${totalSeconds}`;
    setTimeObj({ days, hrs, mins, sec });
  }, [leftTime]);

  useEffect(() => {
    if (!till) return;

    let interval: any;

    const reduceTimer = () => {
      const diff = till - new Date().getTime();

      if (diff < 1000) {
        if (leftTime === 0) return;

        if (interval) {
          clearInterval(interval);
          interval = undefined;
        }
        setLeftTime(0);
      } else {
        setLeftTime(diff);
      }
    };

    reduceTimer();

    interval = setInterval(reduceTimer, 1000);
    return () => (interval ? clearInterval(interval) : undefined);
  }, [till]);

  const defaultTextClasses = 'text-[#6A56F6] font-[300] leading-[110%] ';
  const dotsClasses =
    defaultTextClasses +
    (childrenClasses?.dotsClasses ? childrenClasses?.dotsClasses : 'text-[36px]');
  const numClasses =
    defaultTextClasses +
    (childrenClasses?.numClasses ? childrenClasses?.numClasses : 'text-[36px] text-shadow');
  const dateClasses =
    defaultTextClasses +
    (childrenClasses?.dateClasses
      ? childrenClasses?.dateClasses
      : 'text-[10px] capitalize text-shadow');
  const cellClasses =
    childrenClasses?.cellClasses || 'flex flex-col items-center justify-center min-w-[50px]';

  return (
    <div
      style={{ background: 'rgba(2, 1, 6, 0.32)', ...style }}
      className={classNames(
        'rounded-[8px] py-[7px] px-[8px] flex justify-between laptop:gap-[4px] laptop:mb-[5px]',
      )}
    >
      {Object.entries(timeObj).map(([key, val], index, array) => (
        <Fragment key={index}>
          <div className={cellClasses}>
            <span className={numClasses}>{val}</span>
            <span className={dateClasses}>{key}</span>
          </div>
          {index !== array.length - 1 && <span className={dotsClasses}>:</span>}
        </Fragment>
      ))}
    </div>
  );
};
