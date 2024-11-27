import * as React from 'react';

import Seo from '@/components/Seo';

import { WalletConnectBtn } from '@/features';

export default function HomePage() {
  return (
    <>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white'>
          <div className='layout relative flex min-h-screen flex-col items-center justify-center py-12 text-center'>
            <WalletConnectBtn />
          </div>
        </section>
      </main>
    </>
  );
}
