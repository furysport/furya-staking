import React, { FC } from 'react';
import { Box } from '@chakra-ui/react';

const backgrounds = {
  'migaloo-1':
    'linear-gradient(90deg, rgba(60, 205, 100, 0.25) 2.83%, rgba(0, 117, 255, 0.25) 97.47%)',
};

const RadialGradient: FC = () => (
    <Box
      position="absolute"
      height="718px"
      left="-131px"
      top="-314px"
      background={backgrounds['migaloo-1']}
      width="full"
      filter="blur(250px)"
      borderTopRightRadius="20%"
      zIndex="-1"
    />
  )

export default RadialGradient;
