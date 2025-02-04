import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_QUERY_KEY } from "./useGetAccount";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Endpoint to retrieve a list of account tiers for a specific account.
 * This function allows users to fetch tier information associated with an account, 
 * which can be filtered by an optional account type.
 * It is designed to be used in applications where account tier details are required.
 * @name GetAccountTiers
 * @param {string} accountId - The id of the account
 * @param {string} [type] - Optional account type ("external" | "internal")
 * @version 1.2
 **/

export const ACCOUNT_TIERS_QUERY_KEY = (
  accountId: string,
  type?: "external" | "internal"
) => {
  const keys = [...ACCOUNT_QUERY_KEY(accountId), "TIERS"];
  if (type) keys.push(type);
  return keys;
};

export const SET_ACCOUNT_TIERS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountTiers>>
) => {
  client.setQueryData(ACCOUNT_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetAccountTiersProps extends InfiniteQueryParams {
  accountId: string;
  type?: "external" | "internal";
}

export const GetAccountTiers = async ({
  accountId,
  type,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAccountTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/tiers`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      type: type || undefined,
    },
  });
  return data;
};

export const useGetAccountTiers = (
  accountId: string = "",
  type?: "external" | "internal",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAccountTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAccountTiers>>>(
    ACCOUNT_TIERS_QUERY_KEY(accountId, type),
    (params: InfiniteQueryParams) =>
      GetAccountTiers({
        ...params,
        accountId,
        type,
      }),
    params,
    {
      ...options,
      enabled: !!accountId && (options.enabled ?? true),
    },
    "accounts"
  );
};