import {
  Button,
  Center,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  Icon,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../../components/Card";
import { object, string, ref } from "yup";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useMutation } from "@tanstack/react-query";
import { sendForgotMail } from "../../../api/query/userQuery";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const forgotValidationSchema = object({
    email: string().email("Email is invalid").required("Email is required"),
  });

  const toast = useToast();
  const Navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationKey: ["forgot-email"],
    mutationFn: sendForgotMail,
    onSuccess: (data) => {
      console.log(data);
      Navigate(`/sucessfully-send/${email}`);
    },
    onError: (error) => {
      toast({
        title: "Forgot error.",
        description: error.message,
        status: "error",
      });
    },
  });

  return (
    <Container>
      <Center minH={"100vh"}>
        <Card
          p={{
            base: "4",
            md: "10",
          }}
          ShowCards={true}
        >
          <Link to="/signin">
            <Icon as={FaArrowLeftLong} boxSize={"6"} />
          </Link>

          <Text mt="4" textStyle="h1" fontWeight={"medium"}>
            Forgot Password
          </Text>
          <Text textStyle="p2" color={"black.60"} mt="16px">
            Enter your email address for which account you want to reset your
            password.
          </Text>
          <Formik
            initialValues={{
              email: "",
            }}
            onSubmit={(values) => {
              console.log(values);
              setEmail((prev) => (prev = values.email));
              mutate({ email: values.email });
            }}
            validationSchema={forgotValidationSchema}
          >
            {() => (
              <Form>
                <Stack mt="8" spacing="6">
                  <Field name="email">
                    {({ field, meta }) => (
                      <FormControl isInvalid={!!(meta.error && meta.touched)}>
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          {...field}
                          name="email"
                          type="email"
                          placeholder="JohnArthur@gmail.com"
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Button isLoading={isLoading} type="submit" w={"full"} mt="3">
                    Reset Password
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
        </Card>
      </Center>
    </Container>
  );
};

export default ForgotPassword;
