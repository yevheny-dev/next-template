import { AppProps } from 'next/app';
import Script from 'next/script';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import '@/styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

import { OnboardProvider, setupStore, SolanaProvider } from '@/app';
import { WalletConnectModal } from '@/features';

const { store, persistor } = setupStore();

declare global {
  interface Window {
    ethereum?: any;
    evmProvider?: any;
    Buffer?: any;
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        id='gtm-head'
        strategy='afterInteractive'
        dangerouslySetInnerHTML={{
          __html: `
        (function(w, d, s, l, i) {
          w[l] = w[l] || [];
          w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
          var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s),
            dl = l != 'dataLayer' ? '&l=' + l : '';
          j.async = true;
          j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
          f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', 'GTM-T9PPK8FT');
      `,
        }}
      />

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SolanaProvider>
            <OnboardProvider>
              <ToastContainer
                toastClassName={() =>
                  'bg-transparent shadow-none mb-[10px] p-0'
                }
                bodyClassName={() => 'p-0 m-0 text-gray-900'}
                hideProgressBar={true}
                closeButton={false}
                icon={false}
                position='bottom-center'
              />
              <Component {...pageProps} />
              <WalletConnectModal />
            </OnboardProvider>
          </SolanaProvider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default MyApp;
