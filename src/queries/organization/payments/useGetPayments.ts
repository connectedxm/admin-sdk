import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";

/**
 * Fetches a list of payments with optional filtering and pagination parameters.
 * This function allows retrieval of payment records, supporting features like pagination and sorting.
 * It is designed for use in applications that require access to payment data with flexible query options.
 * @name GetPayments
 * @version 1.2
 **/

export const PAYMENTS_QUERY_KEY = () => ["PAYMENTS"];

export const SET_PAYMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PAYMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPayments>>
) => {
  client.setQueryData(PAYMENTS_QUERY_KEY(...keyParams), response);
};

interface GetPaymentsProps extends InfiniteQueryParams {}

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