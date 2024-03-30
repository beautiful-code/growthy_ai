/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ChakraProvider,
  HStack,
  IconButton,
  Select,
  Text,
} from "@chakra-ui/react";

const ButtonPagination = (props: any) => {
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
      onClick={() => {
        setPageIndex(index);
      }}
      colorScheme={colorScheme}
      variant={pageIndex === index ? "solid" : "link"}
    >
      {children}
    </Button>
  );
};

/**
 *
 * Pagination of data for tables
 *
 * @component
 * @param {Number} pageSize The number of items to be displayed per page
 * @param {Function} setPageSize The setter of pageSize
 * @param {Number} pageIndex The index in which we are located within the table pagination
 * @param {Function} setPageIndex The setter of pageIndex
 * @param {Number} totalItemCount The length of the array of data to be displayed in the table
 * @param {Array.Number} pageSizeOptions The options of the number of items to be displayed per page. - Default = [10,25,50]
 * @param {String} colorScheme - The color scheme of the pagination - Default = "teal"
 * @param {Boolean} showOptions - Show options - Default = true
 * @param {String} labelOptions - Options label - Default = "Items displayed"
 * @param {Boolean} showQuantity - Show quantity - Default = false
 * @return {Component} Table pagination component.
 */

/** */
const PaginationTable = (props: any) => {
  const {
    pageSize,
    setPageSize,
    pageIndex,
    setPageIndex,
    totalItemsCount,
    pageSizeOptions = [10, 25, 50],
    showOptions = true,
    labelOptions = "Number of Rows",
    colorScheme = "teal",
    showQuantity = false,
  } = props;

  const showButtons = () => {
    const buttons = [];

    const TOTAL_INDEX = Math.ceil(totalItemsCount / pageSize);
    if (TOTAL_INDEX < 5) {
      for (let index = 0; index < TOTAL_INDEX; index++) {
        buttons.push(
          <ButtonPagination
            colorScheme={colorScheme}
            setPageIndex={setPageIndex}
            index={index}
            pageIndex={pageIndex}
                      >
            {index + 1}
          </ButtonPagination>
        );
      }
    }

    if (TOTAL_INDEX >= 5) {
      if (pageIndex < 3) {
        for (let index = 0; index < 5; index++) {
          buttons.push(
            <ButtonPagination
              colorScheme={colorScheme}
              setPageIndex={setPageIndex}
              index={index}
              pageIndex={pageIndex}
                          >
              {index + 1}
            </ButtonPagination>
          );
        }
      } else if (pageIndex >= TOTAL_INDEX - 2) {
        for (let index = TOTAL_INDEX - 5; index < TOTAL_INDEX; index++) {
          buttons.push(
            <ButtonPagination
              colorScheme={colorScheme}
              setPageIndex={setPageIndex}
              index={index}
              pageIndex={pageIndex}
                          >
              {index + 1}
            </ButtonPagination>
          );
        }
      } else {
        for (let index = pageIndex - 2; index < pageIndex + 3; index++) {
          buttons.push(
            <ButtonPagination
              colorScheme={colorScheme}
              setPageIndex={setPageIndex}
              index={index}
              pageIndex={pageIndex}
                          >
              {index + 1}
            </ButtonPagination>
          );
        }
      }
    }

    // If the index is greater than zero, show the button to go back
    buttons.unshift(
      <IconButton
        icon={<ArrowLeftIcon />}
        size="sm"
        onClick={() => {
          setPageIndex(pageIndex - 1);
        } }
        isDisabled={!(pageIndex > 0)}
        colorScheme={colorScheme}
        variant="link" 
        aria-label={""}      
      >
        Back
      </IconButton>
    );

    buttons.push(
      <IconButton
        icon={<ArrowRightIcon />}
        size="sm"
        onClick={() => {
          setPageIndex(pageIndex + 1);
        } }
        isDisabled={!(pageIndex + 1 < TOTAL_INDEX)}
        colorScheme={colorScheme}
        variant="link" 
        aria-label={""}      
      >
        Back
      </IconButton>
    );

    return buttons;
  };

  return (
    <ChakraProvider>
      <HStack w="100%" p={2}>
        <HStack w="40%">
          {showOptions && (
            <>
              <Text fontSize="sm"> {labelOptions}: </Text>
              <Select 
                w="auto"
                size="sm"
                variant="unstyled"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(e.target.value);
                  setPageIndex(0);
                }}
              >
                {pageSizeOptions.map((opt: any) => (
                  <option key={opt.id} value={opt}>
                    {opt}
                  </option>
                ))}
              </Select>

              {showQuantity && (
                <Text fontSize="sm">Total: {totalItemsCount}</Text>
              )}
            </>
          )}
        </HStack>
        <Box w="60%" justifyContent="right" display="flex">
          <HStack>{showButtons()}</HStack>
        </Box>
      </HStack>
    </ChakraProvider>
  );
};

export default PaginationTable;
