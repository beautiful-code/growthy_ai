import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Text, VStack } from "@chakra-ui/react";
import { getReqRespPairById } from "chatgpt-req-resp/chatgptLogQueries";
import { TChatgptReqResp } from "types";

export const ReqRespDetail = () => {
  const { id } = useParams();
  const [pair, setPair] = useState<TChatgptReqResp | null>(null);

  useEffect(() => {
    const fetchPair = async () => {
      if (id) {
        try {
          const { data } = await getReqRespPairById(id);
          setPair(data);
        } catch (error) {
          console.error("Error fetching request-response pair:", error);
        }
      }
    };

    fetchPair();
  }, [id]);

  if (!pair) {
    return <Box>Loading or no data found...</Box>;
  }

  return (
    <Box mx="5%" my="20px">
      <VStack spacing={4} align="stretch" m={4}>
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            Request
          </Text>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {pair.req}
          </pre>
        </Box>
        <Box>
          <Text fontSize="xl" fontWeight="bold">
            Response
          </Text>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {pair.resp}
          </pre>
        </Box>
      </VStack>
    </Box>
  );
};
