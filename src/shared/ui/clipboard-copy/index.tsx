import React, { useState, ReactNode, FC } from 'react';

interface CopyToClipboardProps {
  text: string;
  onCopy?: () => void;
  onCopyElement?: ReactNode;
  children: ReactNode;
}

export const CopyToClipboard: FC<CopyToClipboardProps> = ({
  text,
  onCopy,
  children,
  onCopyElement,
}) => {
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
    <>
      <button onClick={handleCopy}>{copied && onCopyElement ? onCopyElement : children}</button>
      {copied && <span className="tooltip-box tooltip-top">Copied to clipboard</span>}
    </>
  );
};
