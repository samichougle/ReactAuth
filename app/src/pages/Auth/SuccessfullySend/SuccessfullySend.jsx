import Card from "../../../components/Card";
import { Icon, VStack, Text, Button, Box, Center } from "@chakra-ui/react";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { useParams } from "react-router-dom";

const SuccessfullySend = () => {
  const params = useParams();

  const { email } = useParams();

  return (
    <Center minH={"100vh"}>
      <Card>
        <VStack spacing={"6"}>
          <Icon as={RiCheckboxCircleFill} boxSize={"48px"} color={"green"} />
          <Text textStyle="h4" color="p.black" fontWeight={"medium"}>
            Successfully Sent
          </Text>
          <Text textStyle="p2" color="black.60" textAlign={"center"}>
            We have sent you an email verification to{" "}
            <Box as="b" color="p.black">
              {email}
            </Box>
            . If you didn’t receive it, click the button below.
          </Text>
        </VStack>
      </Card>
    </Center>
  );
};

export default SuccessfullySend;
