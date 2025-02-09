import { useEffect, useState } from "react";
import { chainFactory } from "../store/chainFactory";
import { Transaction } from "emmet.js/dist/factory/types";

export default function useExplorerTransactions(page: number) {
  

  const [txs, setTxs] = useState<Transaction[]>([]);

  async function fetchData() {
    try {
      // const response: Response = await fetch(`${txBackend}/pages/page/?page=${page}`);
      // const data = await response.json();
      const data = await chainFactory.getTransactions(
        2,
        (page - 1) * 10,
      );
      data && setTxs(data);
    } catch (error: any) {
      console.error(error.message);
    }
  }

  const refresh = () => {
    (async () => {
      await fetchData();
    })();
  };

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    
    if (txs.length === 0) {
      refresh();
    } else {
      interval = setInterval(async () => {
        await fetchData();
      }, 60_000);

      return () => clearInterval(interval);
    }
  });

  return { txs, refresh };
}
