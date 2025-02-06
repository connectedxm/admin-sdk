import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Account } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNTS_QUERY_KEY } from "./useGetAccounts";

/**
 * Fetches account details by a specific account ID.
 * This function is designed to retrieve detailed information about an account using its unique identifier.
 * It is intended for use in applications where account-specific data is required.
 * @name GetAccount
 * @param {string} accountId (path) - The ID of the account
 * @version 1.3
 **/

export const ACCOUNT_QUERY_KEY = (accountId: string) => [
  ...ACCOUNTS_QUERY_KEY(),
  accountId,
];

export const SET_ACCOUNT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccount>>
) => {
  client.setQueryData(ACCOUNT_QUERY_KEY(...keyParams), response);
};

interface GetAccountProps extends SingleQueryParams {
  accountId: string;
}

export const GetAccount = async ({
  accountId = "",
  adminApiParams,
}: GetAccountProps): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}`);
  return data;
};

export const useGetAccount = (
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccount>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccount>>(
    ACCOUNT_QUERY_KEY(accountId),
    (params: SingleQueryParams) =>
      GetAccount({ accountId: accountId || "unknown", ...params }),
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    },
    "accounts"
  );
};