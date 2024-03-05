import { ReactNode } from 'react';

import { Link } from '@chakra-ui/react';
import { truncate } from 'libs/text';

type Props = {
  chainId: string;
  txHash: string;
  children?: ReactNode;
};

const getUrl = (chainId, txHash) => {
  switch (chainId) {
    case 'furya-1':
      return `https://inbloc.org/furya/transactions/${txHash}`;
    case 'narwhal-1':
    default:
      return null;
  }
};

const Finder = ({ children, txHash, chainId }: Props) => (
  <Link isExternal href={getUrl(chainId, txHash)}>
    {children} TxHash: {truncate(txHash, [4, 4])}
  </Link>
);

export default Finder;
