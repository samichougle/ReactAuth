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
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { Link, useNavigate, useParams } from "react-router-dom";
import Card from "../../../components/Card";
import * as yup from "yup";
import { object, string, ref } from "yup";
import { useMutation } from "@tanstack/react-query";
import { verifyForgotToken } from "../../../api/query/userQuery";

const resetValidationSchema = object({
  password: string()
    .min(6, "Password must be of 6 characters")
    .required("Password Required"),
  passwordRepeat: string()
    .oneOf([ref("password"), null], "Password must match")
    .required("Repeat Password must required"),
  acceptTerms: yup.bool().oneOf([true], "Agree Tearms & Conditions"),
});

const ResetPassword = () => {
  const toast = useToast();
  const { token } = useParams();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation({
    mutationKey: ["verify-forgot-token"],
    mutationFn: verifyForgotToken,
    enabled: !!token,
    onError: (error) => {
      toast({
        title: "SignUp Error",
        description: error.message,
        status: "error",
      });

      // navigate("/signup");
    },
    onSettled: () => {
      navigate("/reset-success");
    },
  });

  if (isLoading)
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );

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
          <Text mt="4" textStyle="h1" fontWeight={"medium"}>
            Reset Password
          </Text>
          <Text textStyle="p2" color={"black.60"} mt="16px">
            Enter your new password.
          </Text>
          <Formik
            initialValues={{
              password: "",
              passwordRepeat: "",
            }}
            onSubmit={(values) => {
              mutate({ token, password: values.password });
            }}
            validationSchema={resetValidationSchema}
          >
            {() => (
              <Form>
                <Stack mt="8" spacing="6">
                  <Field name="password">
                    {({ field, meta }) => (
                      <FormControl isInvalid={!!(meta.error && meta.touched)}>
                        <FormLabel htmlFor="password">New Password</FormLabel>
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
                          Repeat New Password
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

                  <Button w={"full"} mt="3" isLoading={isLoading} type="submit">
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

export default ResetPassword;
