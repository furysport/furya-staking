import React from 'react';

import { HStack, Image, Text } from '@chakra-ui/react';
import Link from 'next/link';

const Logo = () => (
  <HStack alignItems="center">
    <Link href="/" passHref>
      <Image src="/img/logo.svg" alt="WhiteFury Logo" boxSize={[8, 12]} />
    </Link>
    <HStack display={['none', 'flex']}>
      <Text pl={2} fontSize="26" fontWeight="400">
          Furya
      </Text>
    </HStack>
  </HStack>
);

export default Logo;
