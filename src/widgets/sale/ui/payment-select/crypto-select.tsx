import classNames from 'classnames';
import { debounce } from 'lodash';
import React, { FC, useCallback, useState } from 'react';

import { useAppDispatch, useAppSelector } from '@/app';
import {
  Button,
  Modal,
  CryptoCurrency,
  SaleAvailableAssets,
  Scrollbar,
  SearchField,
  SaleAvailableChains,
  SaleAvailableChainsWithSol,
  getTokenIcon,
} from '@/shared';
import { PlusIcon } from '@/shared/ui/icons/plus';
import { NetworkChains } from '@/shared';
import { SolanaChain } from '@/shared';
import _ from 'lodash';
import { setIsCryptoSelectModalOpen, tokenSaleSelector } from '../../model';
import commonStyles from '../payment.module.scss';
import { Dropdown } from '@/shared/ui/dropdown';
import styles from '@/shared/ui/dropdown/index.module.scss';

const generalStyle = 'w-[26px] h-[26px] rounded-full flex items-center justify-center';
const moveStyle = ' ml-[-6px] border-[2px] border-[#151518] border-solid box-content';

interface Props {
  activeAsset: CryptoCurrency;
  mostPopularAssetsIds: string[];
  selectAsset: (asset: CryptoCurrency) => void;
}

export const CryptoSelect: FC<Props> = ({ activeAsset, mostPopularAssetsIds, selectAsset }) => {
  const { isCryptoSelectModalOpen } = useAppSelector(tokenSaleSelector);
  const dispatch = useAppDispatch();
  const [veiwAssets, setVeiwAssets] = useState(SaleAvailableAssets);

  const handleModalOpen = useCallback((state: boolean) => {
    dispatch(setIsCryptoSelectModalOpen(state));
  }, []);

  const getFindNetwork = (network: string) => {
    const res = NetworkChains.find((net) => net.displayName == network);
    return res;
  };

  const [selectedNetwork, setSelectedNetwork] = useState<any | null>(getFindNetwork('Ethereum'));

  const handleNetworkSelect = (networkName: any | null) => {
    setSelectedNetwork(networkName);
  };

  const firstAssets = veiwAssets.filter((assets) => assets.networkName == 'Ethereum');
  const restOfAssets = veiwAssets.filter((assets) => assets.networkName != 'Ethereum');

  const filteredRestOfAssets = _.sortBy(restOfAssets, 'networkName');

  const allAssets = [...firstAssets, ...filteredRestOfAssets];

  const filteredAssets =
    selectedNetwork.displayName != 'All Chains'
      ? selectedNetwork.displayName == 'BNB Smart Chain'
        ? allAssets.filter((asset) => asset.networkName === 'Bsc')
        : allAssets.filter((asset) => asset.networkName === selectedNetwork.displayName)
      : allAssets;

  const AllChains = {
    name: 'All Chains',
    displayName: 'All Chains',
    shortName: 'All Chains',
  };

  const allChains = [AllChains, SolanaChain, ...NetworkChains];

  const getChainIcon = (networkName: string | undefined) => {
    let network = networkName;
    if (networkName?.toLowerCase() == 'bsc') {
      network = 'BNB Smart Chain';
    }

    const chain = allChains.find((chain) => chain.displayName === network);
    return chain ? chain.icon : null;
  };

  return (
    <>
      <div
        onClick={() => handleModalOpen(true)}
        className={classNames(commonStyles.assetBtn, {
          [commonStyles.active]: !mostPopularAssetsIds.includes(activeAsset.id),
        })}
      >
        {!mostPopularAssetsIds.includes(activeAsset.id) ? (
          <div className="flex items-center w-full">
            <img className={commonStyles.icon} src={activeAsset.icon} alt={activeAsset.name} />
            <span className={commonStyles.symbol}>{activeAsset.symbol}</span>
            <span className={commonStyles.network}>{activeAsset.networkName}</span>
            <Button
              className="uppercase ml-auto"
              style={{ borderRadius: '35px', paddingInline: '12px', fontWeight: 600 }}
              size={'32'}
            >
              Change
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center">
              <img className={generalStyle} src="/svg/assets/base.svg" alt="base" />
              <img className={generalStyle + moveStyle} src="/svg/assets/pol.svg" alt="plg" />
              <img className={generalStyle + moveStyle} src="/svg/assets/avax.svg" alt="avax" />
              <div className={generalStyle + moveStyle} style={{ background: '#1f1f23' }}>
                <PlusIcon />
              </div>
            </div>
            <span className={commonStyles.value}>Other Crypto</span>
          </>
        )}
      </div>
      {isCryptoSelectModalOpen && (
        <Modal title="Select A Crypto For Payment" onClose={() => handleModalOpen(false)}>
          <span className="text-[#70707B] text-[14px] font-bold">Select Chain</span>
          <Dropdown
            selectedNetwork={selectedNetwork}
            options={allChains}
            onNetworkSelect={handleNetworkSelect}
          />{' '}
          <br />
          <span className="text-[#70707B] text-[14px] font-bold">Select Token</span>
          <Scrollbar key={allAssets.length} height={320}>
            <div className={styles.tokenOption}>
              {filteredAssets.map((asset) => (
                <button
                  className="flex items-center justify-between p-[12px_12px_12px_8px] rounded-[8px]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                  key={asset.id}
                  onClick={() => {
                    selectAsset(asset);
                    handleModalOpen(false);
                  }}
                >
                  <div>
                    <span className={commonStyles.value} style={{ marginLeft: 0 }}>
                      {asset.symbol}
                    </span>
                    <span className={commonStyles.network}>{asset.networkName}</span>
                  </div>
                  <div className="relative">
                    <img
                      className=" w-[26px] h-[26px]"
                      src={asset.icon}
                      alt={asset.symbol}
                      width={26}
                    />
                    <div className="absolute top-[14px] left-[14px] border-[1px] rounded-[99px] border-black">
                      <img
                        src={getChainIcon(asset.networkName) || ''}
                        alt="token-chain"
                        width={22}
                      />{' '}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Scrollbar>
        </Modal>
      )}
    </>
  );
};

CryptoSelect.displayName = 'CryptoSelect';
