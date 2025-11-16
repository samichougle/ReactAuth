import Card from "../../../components/Card";
import {
  Icon,
  VStack,
  Text,
  Button,
  Center,
  Box,
  useQuery,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { verifyUserMail } from "../../../api/query/userQuery";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useVerifyEmail } from "../useVerifyEmail";

const RegisterSuccess = () => {
  const toast = useToast();
  const { token } = useParams();
  const Navigate = useNavigate();
  const { mutate: verifyEmail, isSuccess } = useVerifyEmail();

  console.log(token);

  useEffect(() => {
    verifyEmail({ token });
  }, []);

  if (isSuccess) {
    <Center h="100vh">
      <Spinner />
    </Center>;
  }

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
            Successfully Registration
          </Text>
          <Text textStyle="p2" color="black.60" textAlign={"center"}>
            Hurray! You have successfully created your account. Enter the app to
            explore all it’s features.
          </Text>
          <Box w="full">
            <Link to="/signin">
              <Button w="full">Enter the App</Button>
            </Link>
          </Box>
        </VStack>
      </Card>
    </Center>
  );
};

export default RegisterSuccess;
