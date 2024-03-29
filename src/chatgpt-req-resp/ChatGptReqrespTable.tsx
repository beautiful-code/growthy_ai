import { useEffect, useState } from "react";
import moment from "moment";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Link,
  Text,
  Button,
  Stack,
  Select, // Import Select component
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { getReqRespPairs } from "chatgpt-req-resp/chatgptLogQueries";

import { TChatgptReqResp } from "types";

export const ChatGptReqRespTable = () => {
  const navigate = useNavigate();
  const [reqRespPairs, setReqRespPairs] = useState<TChatgptReqResp[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    const fetchReqRespPairs = async () => {
      try {
        const { data } = await getReqRespPairs();
        setReqRespPairs(data);
      } catch (error) {
        console.error("Error fetching request-response pairs:", error);
      }
    };

    fetchReqRespPairs();
  }, []);

  const handleNavigate = (id: string) => {
    navigate(`/chatgpt-req-resp/${id}`);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reqRespPairs.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(reqRespPairs.length / itemsPerPage);

  const handleNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));

  const handleItemsPerPageChange = (event: any) => {
    setItemsPerPage(Number(event.target.value));
    setCurrentPage(1); // Reset to first page to avoid empty page view
  };

  return (
    <Box mx="5%" my="20px">
      <Box overflowX="auto">
        <Table variant={"striped"} border="1px solid #e3e3e3">
          <Thead>
            <Tr>
              <Th>Request</Th>
              <Th>Response</Th>
            </Tr>
          </Thead>
          <Tbody>
            {reqRespPairs.length === 0 && <Text>No items</Text>}
            {currentItems.map((pair, index) => (
              <Tr key={index}>
                <Td>
                  <Text>
                    {moment(pair.created_at).format("MMMM Do YYYY, h:mm:ss a")}
                  </Text>
                </Td>
                <Td>
                  <Link
                    color="blue.500"
                    onClick={() => handleNavigate(pair.id)}
                    cursor="pointer"
                  >
                    {pair.req.slice(0, 50)}
                  </Link>
                </Td>
                <Td>{pair.resp.slice(0, 50)}</Td>
                <Td>{pair.name}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      {reqRespPairs?.length > itemsPerPage && (
        <Stack
          direction="row"
          spacing={4}
          align="center"
          justifyContent="center"
          mt={4}
        >
          <Button onClick={handlePreviousPage} isDisabled={currentPage === 1}>
            Previous
          </Button>
          <Text>
            Page {currentPage} of {totalPages}
          </Text>
          <Button
            onClick={handleNextPage}
            isDisabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Stack>
      )}
      {reqRespPairs?.length > itemsPerPage && (
        <Box my={4} display="flex" justifyContent="center">
          <Select
            onChange={handleItemsPerPageChange}
            value={itemsPerPage}
            w="auto"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
        </Box>
      )}
    </Box>
  );
};
