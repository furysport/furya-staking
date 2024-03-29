import { FC, ReactNode, useEffect, useState } from 'react';
import { isMobile } from 'react-device-detect';

import { Flex, useMediaQuery } from '@chakra-ui/react';
import Header from 'components/Header/Header';
import Status from 'components/Status';
import { useRouter } from 'next/router';
import { useRecoilValue } from 'recoil';
import { chainState } from 'state/chainState';

import MobileNotSupportedModal from '../Wallet/Modal/MobileNotSupportedModal';
import RadialGradient from './RadialGradient';

interface Props {
  children: ReactNode;
}
const AppLayout: FC<Props> = ({ children }) => {
  const { chainId } = useRecoilValue(chainState)
  const [isMobileView] = useMediaQuery('(max-width: 480px)')

  const router = useRouter()
  const [showHeader, setShowHeader] = useState(false)

  useEffect(() => {
    setShowHeader(router.pathname.includes('delegate'))
  }, [router.pathname])

  return (
    <>
      {(isMobile || isMobileView) && <MobileNotSupportedModal />}
      {!(isMobile || isMobileView) && (
        <Flex
          direction="column"
          backgroundColor="transparent"
          height="100vh">
          <RadialGradient />
          {showHeader && <Header/>}
          <Flex
            key={chainId}
            justifyContent="center"
            mx="auto"
            maxWidth="container.xl"
            marginBottom={20}
            width="full"
            flex="1 1 auto "
          >
            {children}
          </Flex>
          <Flex paddingY={10} paddingX={6} alignSelf="flex-end">
            <Status />
          </Flex>
        </Flex>
      )}
    </>
  )
}

export default AppLayout
