import React from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Select,
  Text,
} from "@chakra-ui/react";

type ButtonPaginationProps =  {
  children: React.ReactNode;
  index: number;
  setPageIndex: (index: number) => void;
  pageIndex: number;
  colorScheme?: string;
}

const ButtonPagination: React.FC<ButtonPaginationProps> = (props) => {
  const {
    children,
    index,
    setPageIndex,
    pageIndex,
    colorScheme = "teal",
  } = props;

  return (
    <Button
      size="sm"
      onClick={() => setPageIndex(index)}
      colorScheme={colorScheme}
      variant={pageIndex === index ? "solid" : "link"}
      key={`page-button-${index}`}
    >
      {children}
    </Button>
  );
};

type  PaginationTableProps = {
  pageSize: number;
  setPageSize: (size: number) => void;
  pageIndex: number;
  setPageIndex: (index: number) => void;
  totalItemsCount: number;
  pageSizeOptions?: number[];
  colorScheme?: string;
  showOptions?: boolean;
  labelOptions?: string;
  showQuantity?: boolean;
}

const PaginationTable: React.FC<PaginationTableProps> = ({
  pageSize,
  setPageSize,
  pageIndex,
  setPageIndex,
  totalItemsCount,
  pageSizeOptions = [10, 25, 50],
  colorScheme = "teal",
  showOptions = true,
  labelOptions = "Number of Rows",
  showQuantity = false,
}) => {
  const TOTAL_INDEX = Math.ceil(totalItemsCount / pageSize);

  const showButtons = () => {
    const buttons: JSX.Element[] = [];

    if (TOTAL_INDEX <= 5) {
      for (let i = 0; i < TOTAL_INDEX; i++) {
        buttons.push(
          <ButtonPagination
            key={`button-${i}`}
            colorScheme={colorScheme}
            setPageIndex={setPageIndex}
            index={i}
            pageIndex={pageIndex}
          >
            {i + 1}
          </ButtonPagination>
        );
      }
    } else {
      // Logic for when there are more than 5 pages
      if (pageIndex < 3) {
        for (let i = 0; i < 5; i++) {
          buttons.push(
            <ButtonPagination
              key={`button-${i}`}
              colorScheme={colorScheme}
              setPageIndex={setPageIndex}
              index={i}
              pageIndex={pageIndex}
            >
              {i + 1}
            </ButtonPagination>
          );
        }
      } else if (pageIndex >= TOTAL_INDEX - 3) {
        for (let i = TOTAL_INDEX - 5; i < TOTAL_INDEX; i++) {
          buttons.push(
            <ButtonPagination
              key={`button-${i}`}
              colorScheme={colorScheme}
              setPageIndex={setPageIndex}
              index={i}
              pageIndex={pageIndex}
            >
              {i + 1}
            </ButtonPagination>
          );
        }
      } else {
        for (let i = pageIndex - 2; i <= pageIndex + 2; i++) {
          buttons.push(
            <ButtonPagination
              key={`button-${i}`}
              colorScheme={colorScheme}
              setPageIndex={setPageIndex}
              index={i}
              pageIndex={pageIndex}
            >
              {i + 1}
            </ButtonPagination>
          );
        }
      }
    }

    buttons.unshift(
      <IconButton
        key="prev-page"
        icon={<ArrowLeftIcon />}
        size="sm"
        onClick={() => setPageIndex(pageIndex - 1)}
        isDisabled={pageIndex <= 0}
        colorScheme={colorScheme}
        variant="link"
        aria-label="Previous Page"
      />
    );

    buttons.push(
      <IconButton
        key="next-page"
        icon={<ArrowRightIcon />}
        size="sm"
        onClick={() => setPageIndex(pageIndex + 1)}
        isDisabled={pageIndex + 1 >= TOTAL_INDEX}
        colorScheme={colorScheme}
        variant="link"
        aria-label="Next Page"
      />
    );

    return buttons;
  };

  return (
    <HStack w="100%" p={2}>
      {showOptions && (
        <HStack w="40%">
          <Text fontSize="sm">{labelOptions}: </Text>
          <Select
            w="auto"
            size="sm"
            variant="unstyled"
            value={pageSize.toString()}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPageIndex(0);
            }}
          >
            {pageSizeOptions.map((size) => (
              <option key={`option-${size}`} value={size}>
                {size}
              </option>
            ))}
          </Select>
          {showQuantity && <Text fontSize="sm">Total: {totalItemsCount}</Text>}
        </HStack>
      )}
      <Box w="60%" justifyContent="flex-end" display="flex">
        <HStack spacing={4}>{showButtons()}</HStack>
      </Box>
    </HStack>
  );
};

export default PaginationTable;
