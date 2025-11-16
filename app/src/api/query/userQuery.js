import { Axios } from "../axios";

const USER_URL = "/user";

export const signinUser = async ({ password, email }) => {
  try {
    const { data } = await Axios.post(
      `${USER_URL}/signin`,
      {
        email,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const signupUser = async ({ email, password, firstName, lastName }) => {
  try {
    const { data } = await Axios.post(`${USER_URL}/signup`, {
      email,
      password,
      firstName,
      lastName,
    });
    return data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const sendVerificationMailUser = async ({ email }) => {
  try {
    const { data } = await Axios.post(`${USER_URL}/send-verification-mail`, {
      email,
    });
    return data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const verifyUserMail = async ({ token }) => {
  try {
    const { data } = await Axios.post(`${USER_URL}/verify-user-mail`, {
      token,
    });
    return data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const sendForgotMail = async ({ email }) => {
  try {
    const { data } = await Axios.post(`${USER_URL}/forgot-password`, {
      email,
    });
    return data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};

export const verifyForgotToken = async ({ token, password }) => {
  try {
    const { data } = await Axios.post(`${USER_URL}/verify-forgot-mail`, {
      token,
      password,
    });
    return data;
  } catch (error) {
    throw Error(error.response.data.message);
  }
};
