import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, BasePushDevice } from "@src/interfaces";

import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";

import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Accounts
 */
export const PUSH_DEVICES_QUERY_KEY = (accountId?: string) => {
  const key = ["PUSH_DEVICES"];
  if (accountId) key.push(accountId);
  return key;
};

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_PUSH_DEVICES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof PUSH_DEVICES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetPushDevices>>
) => {
  client.setQueryData(PUSH_DEVICES_QUERY_KEY(...keyParams), response);
};

interface GetPushDevicesProps extends InfiniteQueryParams {
  accountId?: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetPushDevices = async ({
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetPushDevicesProps): Promise<ConnectedXMResponse<BasePushDevice[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/push-devices`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      accountId: accountId || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetPushDevices = (
  accountId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetPushDevices>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetPushDevices>>>(
    PUSH_DEVICES_QUERY_KEY(accountId),
    (params: InfiniteQueryParams) =>
      GetPushDevices({
        ...params,
        accountId,
      }),
    params,
    {
      ...options,
      enabled: options?.enabled ?? true,
    }
  );
};
