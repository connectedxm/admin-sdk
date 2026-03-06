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
 * @category Keys
 * @group Accounts
 */
export const ACCOUNTS_BY_INTERNAL_REF_ID_QUERY_KEY = (internalRefId: string) => [
  ...ACCOUNTS_QUERY_KEY(),
  "INTERNAL_REF_ID",
  internalRefId,
];

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNTS_BY_INTERNAL_REF_ID_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNTS_BY_INTERNAL_REF_ID_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountsByInternalRefId>>
) => {
  client.setQueryData(
    ACCOUNTS_BY_INTERNAL_REF_ID_QUERY_KEY(...keyParams),
    response
  );
};

interface GetAccountsByInternalRefIdProps extends SingleQueryParams {
  internalRefId: string;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAccountsByInternalRefId = async ({
  internalRefId = "",
  adminApiParams,
}: GetAccountsByInternalRefIdProps): Promise<
  ConnectedXMResponse<Account[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/accounts/internal-ref-id/${internalRefId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAccountsByInternalRefId = (
  internalRefId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccountsByInternalRefId>> = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetAccountsByInternalRefId>
  >(
    ACCOUNTS_BY_INTERNAL_REF_ID_QUERY_KEY(internalRefId),
    (params: SingleQueryParams) =>
      GetAccountsByInternalRefId({
        internalRefId: internalRefId || "unknown",
        ...params,
      }),
    {
      ...options,
      enabled: !!internalRefId && (options?.enabled ?? true),
    }
  );
};
