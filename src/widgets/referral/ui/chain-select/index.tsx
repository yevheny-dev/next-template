import classNames from 'classnames';
import { debounce } from 'lodash';
import React, { FC, useCallback, useEffect, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import {
  Button,
  getChainName,
  getRewardIcon,
  GlobalChainId,
  Image,
  Modal,
  Scrollbar,
  SearchField,
} from '@/shared';
import { RewardToken, setIsChainSelectModalOpen, tokenSaleSelector } from '@/widgets';

import style from './index.module.scss';
interface Props {
  chains: { chain: number; balances: RewardToken[]; storages: string[] }[];
  onChange: (chain: { chain: number; balances: RewardToken[]; storages: string[] }) => void;
  activeChain: GlobalChainId;
}

export const ChainSelect: FC<Props> = ({ chains, onChange, activeChain }) => {
  const { isChainSelectModalOpen } = useAppSelector(tokenSaleSelector);
  const [searchValue, setSearchValue] = useState('');
  const [veiwAssets, setVeiwAssets] = useState(chains);
  const dispatch = useAppDispatch();
  const handleModalOpen = useCallback(
    (state: boolean) => {
      dispatch(setIsChainSelectModalOpen(state));
    },
    [dispatch],
  );
  useEffect(() => {
    setVeiwAssets(chains);
  }, [chains]);

  const handleChangeSearch = debounce((value) => {
    setSearchValue(value);

    if (!value) {
      setVeiwAssets(chains);
      return;
    }

    setVeiwAssets(
      chains.filter((chain) => {
        if (getChainName(chain.chain)?.toLocaleUpperCase().includes(value?.toLocaleUpperCase())) {
          return chain;
        }
      }),
    );
  }, 100);
  return (
    <>
      <button onClick={() => handleModalOpen(true)} className={classNames(style.assetBtn)}>
        <div className="flex items-center gap-[8px] w-full">
          <Image src={getRewardIcon(activeChain)} lazy />
          <p className="text-typoMain font-[600] capitalize leading-[100%]">
            {getChainName(activeChain)}
          </p>
          <Button
            className="uppercase ml-auto"
            style={{ borderRadius: '35px', paddingInline: '12px', fontWeight: 600 }}
            size={'32'}
          >
            Change
          </Button>
        </div>
      </button>
      {isChainSelectModalOpen && (
        <Modal title="Select a Token&Chain" onClose={() => handleModalOpen(false)}>
          <SearchField
            value={searchValue}
            onChange={(e) => handleChangeSearch(e.target.value)}
            placeholder="Search Chains..."
          />
          <Scrollbar height={320}>
            <div className="grid grid-cols-1 gap-[4px] mt-[12px]">
              {veiwAssets.map((chain) => (
                <button
                  className="flex items-center justify-between p-[12px_12px_12px_8px] rounded-[8px]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  key={chain.chain}
                  onClick={() => {
                    onChange(chain);
                    handleModalOpen(false);
                  }}
                >
                  <span className={style.value} style={{ marginLeft: 0 }}>
                    {getChainName(chain.chain)}
                  </span>
                  <Image src={getRewardIcon(chain.chain)} lazy />
                </button>
              ))}
            </div>
          </Scrollbar>
        </Modal>
      )}
    </>
  );
};
