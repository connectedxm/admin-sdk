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
 * @category Keys
 * @group Payments
 */
export const PAYMENT_QUERY_KEY = (paymentId: string) => [
  ...PAYMENTS_QUERY_KEY(),
  "PAYMENT",
  paymentId,
];

/**
 * @category Setters
 * @group Payments
 */
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

/**
 * @category Queries
 * @group Payments
 */
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
/**
 * @category Hooks
 * @group Payments
 */
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
