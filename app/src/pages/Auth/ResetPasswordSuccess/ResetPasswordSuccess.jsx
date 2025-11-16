import Card from "../../../components/Card";
import { Icon, VStack, Text, Button, Center, Box } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { RiCheckboxCircleFill } from "react-icons/ri";

const ResetPasswordSuccess = () => {
  return (
    <Center minH={"100vh"}>
      <Card
        p={{
          base: "4",
          md: "10",
        }}
        ShowCards={true}
      >
        <VStack spacing={"6"}>
          <Icon as={RiCheckboxCircleFill} boxSize={"48px"} color={"green"} />
          <Text textStyle="h4" color="p.black" fontWeight={"medium"}>
            Password Reset Done
          </Text>
          <Text textStyle="p2" color="black.60" textAlign={"center"}>
            Now you can access you account.
          </Text>
          <Box w="full">
            <Link to="/signin">
              <Button w="full">Sign In</Button>
            </Link>
          </Box>
        </VStack>
      </Card>
    </Center>
  );
};

export default ResetPasswordSuccess;
