import Card from "../../../components/Card";
import {
  Icon,
  VStack,
  Text,
  Button,
  Box,
  Center,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { MdEmail } from "react-icons/md";
import { useParams } from "react-router-dom";
import { sendVerificationMailUser } from "../../../api/query/userQuery";

const RegisterEmailVerify = () => {
  const toast = useToast();
  const { email } = useParams();

  if (email == "") {
    return <Center h="100vh">Invalid Email</Center>;
  }

  const { mutate, isSuccess, isLoading } = useMutation({
    mutationKey: ["send-verification-mail"],
    mutationFn: sendVerificationMailUser,
    onSettled: (data) => {
      console.log(data);
    },
    onError: (error) => {
      toast({
        title: "SignUp error occurred.",
        description: error.message,
        status: "error",
      });
    },
    enabled: !!email,
  });

  useEffect(() => {
    mutate({ email });
  }, [email]);

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
          <Icon as={MdEmail} boxSize={"48px"} color={"p.purple"} />
          <Text textStyle="h4" color="p.black" fontWeight={"medium"}>
            Email Verification
          </Text>
          <Text textStyle="p2" color="black.60" textAlign={"center"}>
            We have sent you an email verification to{" "}
            <Box as="b" color="p.black">
              {email}
            </Box>
            . If you didn’t receive it, click the button below.
          </Text>
          <Button
            variant={"outline"}
            w="full"
            onClick={() => {
              mutate({ email });
            }}
            isLoading={isLoading}
          >
            Re-Send Email
          </Button>
        </VStack>
      </Card>
    </Center>
  );
};

export default RegisterEmailVerify;
