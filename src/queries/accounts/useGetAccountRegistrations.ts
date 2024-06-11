import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Registration } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { QueryClient } from "@tanstack/react-query";

export const ACCOUNT_REGISTRATIONS_QUERY_KEY = (accountId: string) => [
  ...ACCOUNT_QUERY_KEY(accountId),
  "REGISTRATIONS",
];

export const SET_ACCOUNT_REGISTRATIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_REGISTRATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountRegistrations>>
) => {
  client.setQueryData(ACCOUNT_REGISTRATIONS_QUERY_KEY(...keyParams), response);
};

interface GetAccountRegistrationsProps extends InfiniteQueryParams {
  accountId: string;
}

export const GetAccountRegistrations = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountRegistrationsProps): Promise<
  ConnectedXMResponse<Registration[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/registrations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};
export const useGetAccountRegistrations = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountRegistrations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountRegistrations>>
  >(
    ACCOUNT_REGISTRATIONS_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountRegistrations({ accountId, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
