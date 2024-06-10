import axios from "axios";
import { ConnectedXMResponse } from "../interfaces";

export const GetErrorMessage = (
  error: any,
  fallback: string = "Something went wrong"
) => {
  let message: string = fallback;
  if (axios.isAxiosError(error)) {
    message =
      (error.response?.data as ConnectedXMResponse<any>)?.message || message;
  } else {
    message = (error as Error).message;
  }

  return message;
};
