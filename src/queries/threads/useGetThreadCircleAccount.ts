import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ThreadCircleAccount } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { QueryClient } from "@tanstack/react-query";
import { THREAD_CIRCLE_ACCOUNTS_QUERY_KEY } from "./useGetThreadCircleAccounts";

/**
 * @category Keys
 * @group Threads
 */
export const THREAD_CIRCLE_ACCOUNT_QUERY_KEY = (
  circleId: string,
  accountId: string
) => [...THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(circleId), accountId];

/**
 * @category Setters
 * @group Threads
 */
export const SET_THREAD_CIRCLE_ACCOUNT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof THREAD_CIRCLE_ACCOUNT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetThreadCircleAccount>>
) => {
  client.setQueryData(THREAD_CIRCLE_ACCOUNT_QUERY_KEY(...keyParams), response);
};

interface GetThreadCircleAccountProps extends SingleQueryParams {
  circleId: string;
  accountId: string;
}

/**
 * @category Queries
 * @group Threads
 */
export const GetThreadCircleAccount = async ({
  circleId,
  accountId,
  adminApiParams,
}: GetThreadCircleAccountProps): Promise<
  ConnectedXMResponse<ThreadCircleAccount>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/threads/circles/${circleId}/accounts/${accountId}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Threads
 */
export const useGetThreadCircleAccount = (
  circleId: string,
  accountId: string,
  options: SingleQueryOptions<ReturnType<typeof GetThreadCircleAccount>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadCircleAccount>>(
    THREAD_CIRCLE_ACCOUNT_QUERY_KEY(circleId, accountId),
    (params: SingleQueryParams) =>
      GetThreadCircleAccount({ circleId, accountId, ...params }),
    options
  );
};
