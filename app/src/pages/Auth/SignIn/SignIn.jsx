import {
  Box,
  Button,
  Center,
  Checkbox,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { Link } from "react-router-dom";
import { object, string, ref } from "yup";
import * as yup from "yup";
import Card from "../../../components/Card";
import { useMutation } from "@tanstack/react-query";
import { signinUser } from "../../../api/query/userQuery";
import useAuth from "../../../hooks/useAuth";

const signinValidationSchema = object({
  email: string().email("Email is invalid").required("Email is required"),
  password: string()
    .min(6, "Password must be of 6 characters")
    .required("Password Required"),
});

const SignIn = () => {
  const toast = useToast();
  const { login } = useAuth();

  const { mutate, isLoading } = useMutation({
    mutationKey: ["signin"],
    mutationFn: signinUser,
    onSuccess: (data) => {
      const { token } = data;
      if (token) {
        login(token);
      }
    },
    onError: (error) => {
      toast({
        title: "SignIn error occurred.",
        description: error.message,
        status: "error",
      });
    },
  });

  return (
    <Container>
      <Center minH={"100vh"}>
        <Card>
          <Text textStyle="h1" fontWeight={"medium"}>
            Welcome to Crypto App
          </Text>
          <Text textStyle="p2" color={"black.60"} mt="16px">
            Enter your credentials to access the account.
          </Text>
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={(values) => {
              mutate(values);
              // console.log(values);
              // mutate({
              //   email: values.email,
              //   password: values.password,
              // });
            }}
            validationSchema={signinValidationSchema}
          >
            {() => (
              <Form>
                <Stack mt="40px" spacing="6">
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
                  <Field name="password">
                    {({ field, meta }) => (
                      <FormControl isInvalid={!!(meta.error && meta.touched)}>
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                          {...field}
                          name="password"
                          type="password"
                          placeholder="*******"
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <HStack justify={"space-between"}>
                    <Checkbox>
                      <Text textStyle={"p3"}>Remember me</Text>
                    </Checkbox>

                    <Link to="/forgot-password">
                      <Text as="span" color={"p.purple"} textStyle={"p3"}>
                        Forgot Password?
                      </Text>
                    </Link>
                  </HStack>
                  <Box>
                    <Button isLoading={isLoading} type="submit" w="full">
                      Login
                    </Button>
                    <Link to="/signup">
                      <Button w={"full"} mt="3" variant={"outline"}>
                        Create New Account
                      </Button>
                    </Link>
                  </Box>
                </Stack>
              </Form>
            )}
          </Formik>
        </Card>
      </Center>
    </Container>
  );
};

export default SignIn;
