import React from 'react';
import { Link } from 'react-router-dom';

export const AuditBlock = () => {
  return (
    <a
      href="https://solanex.ai/audits/0xguard.pdf"
      target="_blank"
      rel="noopener noreferrer" // Good practice for external links
      className="block w-full h-full "
    >
      <div
        className="w-full h-full  p-[12px] relative top-[40px]"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundImage: "url('/images/audit.png')",
        }}
      >
        <span className="text-[14px] text-[#7D89B0] font-semibold ml-[4px]">Audit Result</span>
        <div className="h-full w-full flex justify-end mt-[80px]">
          <a
            style={{
              width: '36px',
              height: '36px',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundImage: "url('/images/auditBtn.png')",
            }}
            target="_blank"
            href="https://solanex.ai/audits/0xguard.pdf"
          ></a>
        </div>
      </div>
    </a>
  );
};

export const AuditBlockMob = () => {
  return (
    <a
      href="https://solanex.ai/audits/0xguard.pdf"
      target="_blank"
      rel="noopener noreferrer" // Good practice for external links
      className="block w-full h-full z-[9000] mx-auto cursor-pointer"
    >
      <div
        className="w-full h-[140px] p-[12px] relative mt-[6px] my-auto max-w-[400px] mx-auto"
        style={{
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundImage: "url('/images/auditBg.png')",
          padding: '12px', // Ensures 12px padding is applied
        }}
      >
        <span className="text-[14px] text-[#7D89B0] font-semibold ml-[4px] relative top-[10px]">
          Audit Result
        </span>
        <div className="flex justify-center relative w-[117px] h-[35px] mx-auto mt-[12px]">
          <img src="/images/auditIcon.png" alt="icon" />
        </div>
        <div className="h-full w-full flex justify-end">
          <a
            style={{
              width: '36px',
              height: '36px',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundImage: "url('/images/auditBtn.png')",
            }}
            target="_blank"
            href="https://solanex.ai/audits/0xguard.pdf"
          ></a>
        </div>
      </div>
    </a>
  );
};
