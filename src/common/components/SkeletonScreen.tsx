import React from 'react';
import { Skeleton, Stack } from '@chakra-ui/react';

export const SkeletonScreen: React.FC = () => {
  return (
      <Stack m={4}>
        {Array.from({ length: 10 }).map((_, index) => (
          <Skeleton key={index} height="20px" />
        ))}
      </Stack>
  );
}
