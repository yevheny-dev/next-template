import React, { useState, useEffect } from 'react';
import styles from './index.module.scss';
import _ from 'lodash';
interface DropdownProps {
  options: any[];
  className?: string;
  refProp?: React.Ref<HTMLDivElement>;
  onNetworkSelect?: (networkName: string | null) => void;
  selectedNetwork?: any;
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  className = '',
  refProp,
  selectedNetwork,
  onNetworkSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<any | null>(selectedNetwork);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (option: any, event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedOption(option);

    if (onNetworkSelect) {
      onNetworkSelect(option);
    }
    setIsOpen(false);
  };

  return (
    <div
      className={`${styles.dropdown} ${className} ${isOpen ? styles.open : ''}`}
      ref={refProp}
      onClick={toggleDropdown}
    >
      <div className={styles.selected}>
        <div className="flex flex-row items-center space-x-[6px]">
          {selectedNetwork?.displayName != 'All Chains' && (
            <img
              className="w-[26px] h-[26px]"
              src={selectedOption.icon}
              alt={selectedOption.displayName}
            />
          )}

          <span>{`${selectedOption.displayName}`}</span>
        </div>
        <DropdownIcon />
      </div>
      {isOpen && (
        <div className={styles.options}>
          {/* Fixed or sticky first <li> */}
          <div className="flex items-center flex-row px-[8px]">
            {selectedOption?.displayName != 'All Chains' && (
              <img
                className="w-[26px] h-[26px]"
                src={selectedOption.icon}
                alt={selectedOption.networkName}
              />
            )}
            <li className={` ${styles.fixedOption}`}>{`${selectedOption.displayName}`}</li>
          </div>

          {/* Scrollable section */}
          <div className={styles.scrollableOptions}>
            {options.map((option: any, index: number) => (
              <li
                key={index}
                className={styles.option}
                onClick={(event) => handleSelect(option, event)} // Pass event to handler
              >
                {' '}
                {`${option.displayName}`}
                {option.displayName !== 'All Chains' && (
                  <img className="w-[26px] h-[26px]" src={option.icon} alt={option.networkName} />
                )}
              </li>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 11C7.82233 11 7.64465 10.9304 7.50438 10.7812L4.20339 7.27051C3.9322 6.9821 3.9322 6.50472 4.20339 6.21631C4.47458 5.9279 4.92344 5.9279 5.19462 6.21631L8 9.1999L10.8054 6.21631C11.0766 5.9279 11.5254 5.9279 11.7966 6.21631C12.0678 6.50472 12.0678 6.9821 11.7966 7.27051L8.49562 10.7812C8.35535 10.9304 8.17767 11 8 11Z"
        fill="#B9C0D4"
      />
    </svg>
  );
};
