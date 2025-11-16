import {
  Button,
  Center,
  Checkbox,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { Link, useNavigate } from "react-router-dom";
import { object, string, ref } from "yup";
import * as yup from "yup";
import Card from "../../../components/Card";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "../../../api/query/userQuery";
import { useState } from "react";

const signupValidationSchema = object({
  name: string().required("Name is required"),
  surname: string().required("Surname is required"),
  email: string().email("Email is invalid").required("Email is required"),
  password: string()
    .min(6, "Password must be of 6 characters")
    .required("Password Required"),
  passwordRepeat: string()
    .oneOf([ref("password"), null], "Password must match")
    .required("Repeat Password must required"),
  acceptTerms: yup.bool().oneOf([true], "Agree Tearms & Conditions"),
});

const SignUp = () => {
  const [email, setEmail] = useState("");
  const Navigate = useNavigate();
  const toast = useToast();
  const { mutate, isLoading } = useMutation({
    mutationKey: ["signup"],
    mutationFn: signupUser,
    onSuccess: (data) => {
      if (email !== "") {
        Navigate(`/register-email-verification/${email}`);
      }
    },
    onError: (error) => {
      toast({
        title: "SignUp error occurred.",
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
              acceptTerms: false,
              name: "",
              surname: "",
              email: "",
              password: "",
              passwordRepeat: "",
            }}
            onSubmit={(values) => {
              setEmail(values.email);
              mutate({
                firstName: values.name,
                lastName: values.surname,
                email: values.email,
                password: values.password,
              });
            }}
            validationSchema={signupValidationSchema}
          >
            {() => (
              <Form>
                <Stack mt="40px" spacing="6">
                  <Flex gap={"4"}>
                    <Field name="name">
                      {({ field, meta }) => (
                        <FormControl isInvalid={!!(meta.error && meta.touched)}>
                          <FormLabel htmlFor="name">Name</FormLabel>
                          <Input {...field} name="name" placeholder="John" />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                    <Field name="surname">
                      {({ field, meta }) => (
                        <FormControl isInvalid={!!(meta.error && meta.touched)}>
                          <FormLabel htmlFor="surname">Surname</FormLabel>
                          <Input
                            {...field}
                            name="surname"
                            placeholder="Arthur"
                          />
                          <FormErrorMessage>{meta.error}</FormErrorMessage>
                        </FormControl>
                      )}
                    </Field>
                  </Flex>
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
                  <Field name="passwordRepeat">
                    {({ field, meta }) => (
                      <FormControl isInvalid={!!(meta.error && meta.touched)}>
                        <FormLabel htmlFor="passwordRepeat">
                          Repeat Password
                        </FormLabel>
                        <Input
                          {...field}
                          name="passwordRepeat"
                          type="password"
                          placeholder="*******"
                        />
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Field name="acceptTerms" type="checkbox">
                    {({ field, meta }) => (
                      <FormControl isInvalid={!!(meta.error && meta.touched)}>
                        <Checkbox {...field}>
                          <Text as="span" textStyle="p3">
                            I agree with{" "}
                          </Text>
                          <Text as="span" color="p.purple" textStyle="p3">
                            Terms and Conditions
                          </Text>
                        </Checkbox>
                        <FormErrorMessage>{meta.error}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>

                  <Button isLoading={isLoading} type="submit">
                    Create Account
                  </Button>
                  <Text textStyle={"p3"} color="black.60" textAlign={"center"}>
                    Already have an account?{" "}
                    <Link to="/signin">
                      <Text as={"span"} color="p.purple" textStyle={"p3"}>
                        Login
                      </Text>
                    </Link>
                  </Text>
                </Stack>
              </Form>
            )}
          </Formik>
        </Card>
      </Center>
    </Container>
  );
};

export default SignUp;
