import Onboard, { OnboardAPI } from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import torusModule from '@web3-onboard/torus';
import walletConnectModule from '@web3-onboard/walletconnect';

declare global {
  interface Window {
    opera?: any;
  }
}

const chains = [
  {
    id: 1,
    token: 'ETH',
    label: 'Ethereum Mainnet',
    rpcUrl: 'https://ethereum.publicnode.com',
  },
];

const icon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" viewBox="0 0 14 12" fill="none">
  <path d="M7.80871 7.57895H3.97993L0.679257 4.35789V3.22105C0.679257 3.22105 3.05492 0.977145 4.11196 0H7.94074L4.64007 3.16882V4.4016L7.80871 7.57895Z" fill="#6A56F6"/>
  <path d="M6.48844 4.42105L10.3172 4.42105L13.6179 7.64211V8.77895C13.6179 8.77895 11.2422 11.0229 10.1852 12H6.35642L9.65709 8.83118V7.5984L6.48844 4.42105Z" fill="#6A56F6"/>
  <path d="M13.9997 3.2374H6.19129C6.19129 3.2374 8.41973 1.07089 9.52506 0H10.7133L14 3.2371L13.9997 3.2374Z" fill="#6A56F6"/>
  <path d="M0.000318806 8.7626H7.80871C7.80871 8.7626 5.58027 10.9291 4.47494 12H3.28669L0 8.7629L0.000318806 8.7626Z" fill="#6A56F6"/>
</svg>`;

const appMetadata = {
  name: 'SOL DEX',
  description: 'SOL DEX',
  icon: icon,
  logo: icon,
  recommendedInjectedWallets: [
    { name: 'MetaMask', url: 'https://metamask.io' },
    { name: 'WalletConnect', url: 'https://walletconnect.com/' },
  ],
};

export const initOnboard = (): OnboardAPI => {
  const userAgent = navigator?.userAgent || navigator?.vendor || window?.opera;
  const isMobileDevice = /android|iphone|ipad|ipod|windows phone/i.test(userAgent);

  const injected = injectedModule({
    filter: { Phantom: false },
    displayUnavailable: isMobileDevice
      ? false
      : ['Trust Wallet', 'MetaMask', 'Coinbase Wallet', 'Phantom', 'Rainbow', 'OKX Wallet'],
    sort: (wallets) => {
      return wallets;
    },
  });
  const torus = torusModule();
  const wc = walletConnectModule({
    version: 2,
    handleUri: (uri: any) => console.warn(uri, 'walletconnect uri'),
    projectId: 'd2423ba732cce1398612959331709d36',
    requiredChains: [1],
    optionalChains: [56, 137, 42161],
    dappUrl: window.origin,
  });

  const wallets = [injected, torus, wc];
  const result = Onboard({
    wallets,
    chains,
    appMetadata,
    connect: {
      showSidebar: false,
      autoConnectLastWallet: true,
      autoConnectAllPreviousWallet: true,
    },
    theme: 'system',
    notify: {
      enabled: false,
    },
    accountCenter: {
      mobile: {
        enabled: false,
      },
      desktop: {
        enabled: false,
      },
    },
    disableFontDownload: true,
    containerElements: {
      connectModal: '#custom-onboard-modal .custom-onboard-modal-inner',
    },
  });

  return result;
};
