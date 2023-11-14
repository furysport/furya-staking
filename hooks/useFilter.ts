import { useMemo } from 'react';

const useFilter = <T>(
  filterKey: string,
  filterValue: string,
  list: T[] = [],
): T[] => useMemo(() => list?.filter((item) => item[filterKey]?.toLowerCase()?.includes(filterValue)), [list, filterKey, filterValue]);

export default useFilter;
