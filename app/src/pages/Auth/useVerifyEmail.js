import { useMutation } from "@tanstack/react-query";
import { verifyUserMail } from "../../api/query/userQuery";
import { Navigate } from "react-router-dom";

export const useVerifyEmail = (mutationFn, options = {}) => {
  return useMutation({
    onMutate: ({ token }) => verifyUserMail({ token }),
    onError: (error) => {
      //   Toast({
      //     title: "SignUp Error",
      //     description: error.message,
      //     status: "error",
      //   });
      // Navigate("/signup");
      console.log(error);
    },
    onSuccess: (data) => {
      console.log(data);
      Navigate("/signin");
    },
  });
};
