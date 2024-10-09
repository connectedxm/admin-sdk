import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Payments
 */
export const PAYMENTS_QUERY_KEY = () => ["PAYMENTS"];

/**
 * @category Setters
 * @group Payments
 */
export const SET_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPayments>>
) => {
  client.setQueryData(PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetPaymentsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Payments
 */
export const GetPayments = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/payments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Payments
 */
export const useGetPayments = (
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetPayments>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetPayments>>>(
    PAYMENTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetPayments(params),
    params,
    options,
    "org"
  );
};
