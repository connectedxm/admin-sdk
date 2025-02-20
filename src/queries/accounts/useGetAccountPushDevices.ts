import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, PushDevice } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";

/**
 * @category Keys
 * @group Accounts
 */
export const ACCOUNT_PUSH_DEVICES_QUERY_KEY = (accountId: string) => {
  const key = [...ACCOUNT_QUERY_KEY(accountId), "PUSH_DEVICES"];
  return key;
};

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_PUSH_DEVICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_PUSH_DEVICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountPushDevices>>
) => {
  client.setQueryData(ACCOUNT_PUSH_DEVICES_QUERY_KEY(...keyParams), response);
};

interface GetAccountPushDevicesProps extends InfiniteQueryParams {
  accountId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountPushDevices = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountPushDevicesProps): Promise<ConnectedXMResponse<PushDevice[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/push-devices`, {
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
 * @group Accounts
 */
export const useGetAccountPushDevices = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountPushDevices>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAccountPushDevices>>
  >(
    ACCOUNT_PUSH_DEVICES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetAccountPushDevices({
        ...params,
        accountId,
      }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};
