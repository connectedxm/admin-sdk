import { GetAdminAPI } from "@src/AdminAPI";
import { QueryClient } from "@tanstack/react-query";
import { PAYMENTS_QUERY_KEY } from "./useGetPayments";
import {
  SingleQueryParams,
  SingleQueryOptions,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse, Payment } from "@src/interfaces";

/**
 * Fetches detailed information about a specific payment using its unique identifier.
 * This function is part of the payment management system and allows retrieval of payment details for further processing or display.
 * It is designed to be used in applications where payment information needs to be accessed or verified.
 * @name GetPayment
 * @param {string} paymentId (path) The id of the payment
 * @version 1.3
 **/

export const PAYMENT_QUERY_KEY = (paymentId: string) => [
  ...PAYMENTS_QUERY_KEY(),
  paymentId,
];

export const SET_PAYMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PAYMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPayment>>
) => {
  client.setQueryData(PAYMENT_QUERY_KEY(...keyParams), response);
};

interface GetPaymentProps extends SingleQueryParams {
  paymentId: string;
}

export const GetPayment = async ({
  paymentId,
  adminApiParams,
}: GetPaymentProps): Promise<ConnectedXMResponse<Payment>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<Payment>>(
    `/payments/${paymentId}`
  );
  return data;
};

export const useGetPayment = (
  paymentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetPayment>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetPayment>>(
    PAYMENT_QUERY_KEY(paymentId),
    (params: SingleQueryParams) =>
      GetPayment({
        paymentId,
        ...params,
      }),
    {
      ...options,
      enabled: !!paymentId && (options.enabled ?? true),
    },
    "org"
  );
};