import { useQueries } from 'react-query';

import { fetchTotalSupply } from 'libs/fetchTotalFurySupply';
import { fetchInflation } from 'libs/fetchFuryInflation';

export const useTotalYearlyFuryEmission = () => {
  const queries = useQueries([
    {
      queryKey: 'totalSupply',
      queryFn: fetchTotalSupply,
      refetchOnMount: true,
    },
    {
      queryKey: 'inflation',
      queryFn: fetchInflation,
    },
  ]);

  const [totalSupplyData, inflationData] = queries;
  // 10% into community pool
  const totalYearlyFuryEmission =
    (totalSupplyData?.data ?? 0) * (inflationData?.data ?? 0) * 0.9;
  return {
    totalYearlyFuryEmission,
  };
};
