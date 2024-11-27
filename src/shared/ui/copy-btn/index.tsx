import React, { useState, FC } from 'react';

import { Button } from '@/shared';

interface Props {
  text: string;
  onCopy?: () => void;
}

export const CopyBtn: FC<Props> = ({ text, onCopy }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (e: any) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="relative">
      <Button
        style={{ paddingBlock: '8px', paddingInline: '12px', borderRadius: '35px' }}
        size="32"
        onClick={handleCopy}
      >
        COPY
      </Button>
      {copied && <span className="tooltip-box tooltip-top min-w-[90px]">Copied to clipboard</span>}
    </div>
  );
};
