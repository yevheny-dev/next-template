import { PublicKey } from '@solana/web3.js';
import BigNumber from 'bignumber.js';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { connection, SOLANA_PRECISION } from '@/shared';
import { solanaWalletSelector } from '@/widgets';

export const useSolanaBalance = () => {
  const solWallet = useSelector(solanaWalletSelector);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      const balanceRow = await connection.getBalance(new PublicKey(solWallet?.address || ''));
      const b = new BigNumber(balanceRow.toString())
        .dividedBy(SOLANA_PRECISION)
        .decimalPlaces(4, BigNumber.ROUND_FLOOR)
        .toNumber();

      setBalance(b);
    };
    if (solWallet?.address) {
      fetch();
    }
  }, [solWallet]);

  return balance;
};
