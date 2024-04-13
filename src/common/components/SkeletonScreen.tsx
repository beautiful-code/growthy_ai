import React from 'react';
import { Center, Spinner } from '@chakra-ui/react';

export const SkeletonScreen: React.FC = () => {
  return (
    <Center height="100vh"> 
      <Spinner
        thickness="6px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        width= "100px" 
        height= "100px"
      />
    </Center>
  );
}
