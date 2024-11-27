import axios from 'axios';
import { useEffect, useState } from 'react';

import { CoinCapData, FetchTokensListResponse, TokensList } from '@/shared';

const fetchTokenPrice = async (coinNames: string) => {
  const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinNames}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true`;
  try {
    const response = await axios.get(url);
    return response?.data;
  } catch (error) {
    console.error(`Error fetching data for ${coinNames}:`, error);
    return null;
  }
};

const fetchTokensList = async () => {
  const url = 'https://api.coingecko.com/api/v3/coins/list';
  try {
    const response = await axios.get<FetchTokensListResponse[]>(url);
    return response?.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const useCoinCap = () => {
  const [info, setInfo] = useState<CoinCapData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const tokenList = await fetchTokensList();
      if (tokenList) {
        const tokens = tokenList?.filter((item) =>
          TokensList?.find((name) => name.toLowerCase() === item?.name.toLowerCase()),
        );
        const tokenIds = tokens?.map((item) => item?.id).join(',');
        const data = await fetchTokenPrice(tokenIds);
        const fetchedInfo = tokens?.map((item) => ({ ...item, ...data[item.id] }));

        sessionStorage.setItem('coinCapData', JSON.stringify(fetchedInfo));
        sessionStorage.setItem('timestamp', Date.now().toString());

        setInfo(fetchedInfo);
      }
      setLoading(false);
    };

    const loadData = () => {
      const storedData = sessionStorage.getItem('coinCapData');
      const timestamp = sessionStorage.getItem('timestamp');

      if (storedData && timestamp) {
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;

        if (now - parseInt(timestamp, 10) > tenMinutes) {
          fetchData();
        } else {
          setInfo(JSON.parse(storedData));
          setLoading(false);
        }
      } else {
        fetchData();
      }
    };

    loadData();
  }, []);

  return { info, loading };
};
