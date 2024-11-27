import React, {useState, useEffect, FC} from 'react';

import {useIsMobile, useIsTablet} from '@/shared/lib/hooks/use-is-mobile';

import style from './index.module.scss';

interface GuideObj {
  guideTitle: string;
  guideText: string;
  guideImage: string;
  guideImageMobile: string;
}

interface GuideProps {
  title: string;
  guide: GuideObj[];
}

export const GuidesContainer = ({ title, guide }: GuideProps) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const currentGuide = currentPage - 1;

  useEffect(() => {
    if (animating) {
      const timeout = setTimeout(() => setAnimating(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [animating]);

  const handlePageChange = (page: number) => {
    if (page > currentPage) {
      setDirection('right');
    } else {
      setDirection('left');
    }
    setAnimating(true);
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex items-center gap-[20px] mt-[10px] md:mt-[100px] laptop:mt-0 mb-[30px]">
        <p className={style.title}>{title}</p>
      </div>

      <div
        className="flex md:flex-row flex-col items-stretch rounded-[12px] w-full h-full"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: isTablet ? 'cover' : 'contain',
          backgroundImage: isMobile
            ? "url('/images/guidesBgMob.png')"
            : "url('/images/guidesBg.png')",
        }}
      >
        <div className="px-[12px] py-[16px] flex flex-col md:w-[40%] w-full justify-between">
          <div
            className={style.guidePoint}
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'center center',
              backgroundImage: "url('/images/guidePoint.svg')",
            }}
          >
            <span className="text-[12px] text-[#FAFAFA] font-bold">{currentPage}</span>
          </div>
          <div className="flex flex-col justify-center pl-[4px]">
            <span className={style.guideTitle}>{guide[currentGuide].guideTitle}</span>
            <span className={style.guideText}>{guide[currentGuide].guideText}</span>
          </div>
          <div>
            {!isMobile && (
              <Pagination
                totalDots={guide.length}
                currentPageFromParent={currentPage}
                onPageChange={(page) => handlePageChange(page)}
              />
            )}
          </div>
        </div>

        <div className="p-[16px] md:p-[30px] md:w-[60%] w-full h-full flex justify-center flex-col items-center space-y-[30px] md:space-y-[0px]">
          <div className="relative w-full h-full flex justify-center items-center overflow-hidden">

            <img
              key={`old-${currentPage}`}
              src={isMobile ? guide[currentGuide].guideImageMobile : guide[currentGuide].guideImage}
              alt={guide[currentGuide].guideTitle}
              className={`transition-transform min-h-[500px] duration-500 ease-in-out transform ${
                animating
                  ? direction === 'right'
                    ? '-translate-x-full'
                    : 'translate-x-full'
                  : 'translate-x-0'
              }`}
            />

            {/*<img*/}
            {/*  key={currentPage}*/}
            {/*  src={isMobile ? guide[currentGuide].guideImageMobile : guide[currentGuide].guideImage}*/}
            {/*  alt={guide[currentGuide].guideTitle}*/}
            {/*  className={`absolute transition-transform duration-500 ease-in-out transform ${*/}
            {/*    animating*/}
            {/*      ? 'translate-x-0'*/}
            {/*      : direction === 'left'*/}
            {/*            ? '-translate-x-full'*/}
            {/*            : 'translate-x-full'*/}
            {/*  }`}*/}
            {/*/>*/}
          </div>

          {isMobile && (
            <Pagination
              totalDots={guide.length}
              currentPageFromParent={currentPage}
              onPageChange={(page) => handlePageChange(page)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

interface PaginationProps {
  totalDots: number;
  currentPageFromParent?: number;
  onPageChange?: (page: number) => void;
}

const Pagination: FC<PaginationProps> = ({
  totalDots,
  currentPageFromParent = 1,
  onPageChange,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(currentPageFromParent);

  useEffect(() => {
    if (currentPageFromParent) {
      setCurrentPage(currentPageFromParent);
    }
  }, [currentPageFromParent]);

  const handleDotClick = (page: number) => {
    setCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  const handleNext = () => {
    if (currentPage < totalDots) {
      setCurrentPage(currentPage + 1);
      if (onPageChange) onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      if (onPageChange) onPageChange(currentPage - 1);
    }
  };

  return (
    <div className={style.pagination}>
      <button className={style.arrow} onClick={handlePrev} disabled={currentPage === 1}>
        <LeftArrow active={currentPage !== 1} />
      </button>

      {Array.from({ length: totalDots }).map((_, index) => {
        const page = index + 1;
        return (
          <div
            key={page}
            className={`${style.dot} ${page === currentPage ? style.active : ''}`}
            onClick={() => handleDotClick(page)}
          ></div>
        );
      })}

      <button className={style.arrow} onClick={handleNext} disabled={currentPage === totalDots}>
        <RightArrow active={currentPage !== totalDots} />
      </button>
    </div>
  );
};

const LeftArrow = ({ active }: any) => {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 8C0 3.58172 3.58172 0 8 0H36C40.4183 0 44 3.58172 44 8V36C44 40.4183 40.4183 44 36 44H8C3.58172 44 0 40.4183 0 36V8Z"
        fill="white"
        fillOpacity="0.03"
      />
      <path
        d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H36C40.1421 0.5 43.5 3.85786 43.5 8V36C43.5 40.1421 40.1421 43.5 36 43.5H8C3.85786 43.5 0.5 40.1421 0.5 36V8Z"
        stroke="url(#paint0_linear_2926_21610)"
        strokeOpacity="0.12"
      />
      <path
        d="M19.7778 23.0486L21.1458 24.4167L23.375 26.6458C23.8472 27.1111 24.6528 26.7778 24.6528 26.1111L24.6528 21.7847L24.6528 17.8889C24.6528 17.2222 23.8472 16.8889 23.375 17.3611L19.7778 20.9583C19.2014 21.5278 19.2014 22.4722 19.7778 23.0486Z"
        fill={active ? '#FAFAFA' : '#FAFAFA1F'}
      />
      <defs>
        <linearGradient
          id="paint0_linear_2926_21610"
          x1="5.5"
          y1="-5.43644e-07"
          x2="44.7034"
          y2="2.57416"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.32" />
        </linearGradient>
      </defs>
    </svg>
  );
};

const RightArrow = ({ active }: any) => {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M44 8C44 3.58172 40.4183 0 36 0H8C3.58172 0 0 3.58172 0 8V36C0 40.4183 3.58172 44 8 44H36C40.4183 44 44 40.4183 44 36V8Z"
        fill="white"
        fillOpacity="0.03"
      />
      <path
        d="M43.5 8C43.5 3.85786 40.1421 0.5 36 0.5H8C3.85786 0.5 0.5 3.85786 0.5 8V36C0.5 40.1421 3.85786 43.5 8 43.5H36C40.1421 43.5 43.5 40.1421 43.5 36V8Z"
        stroke="url(#paint0_linear_2926_21623)"
        strokeOpacity="0.12"
      />
      <path
        d="M24.2222 23.0486L22.8542 24.4167L20.625 26.6458C20.1528 27.1111 19.3472 26.7778 19.3472 26.1111L19.3472 21.7847L19.3472 17.8889C19.3472 17.2222 20.1528 16.8889 20.625 17.3611L24.2222 20.9583C24.7986 21.5278 24.7986 22.4722 24.2222 23.0486Z"
        fill={active ? '#FAFAFA' : '#FAFAFA1F'}
      />
      <defs>
        <linearGradient
          id="paint0_linear_2926_21623"
          x1="38.5"
          y1="-5.43644e-07"
          x2="-0.703425"
          y2="2.57416"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0.32" />
        </linearGradient>
      </defs>
    </svg>
  );
};
