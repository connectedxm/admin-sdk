import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { EmailReceipt, EmailReceiptStatus } from "@src/interfaces";
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
export const ACCOUNT_EMAILS_QUERY_KEY = (
  accountId: string,
  status?: keyof typeof EmailReceiptStatus
) => {
  const queryKey = [...ACCOUNT_QUERY_KEY(accountId), "EMAILS_RECEIPTS"];

  if (status) {
    queryKey.push(status);
  }
  return queryKey;
};

/**
 * @category Setters
 * @group Accounts
 */
export const SET_ACCOUNT_EMAILS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_EMAILS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAcccountEmailReceipts>>
) => {
  client.setQueryData(ACCOUNT_EMAILS_QUERY_KEY(...keyParams), response);
};

interface GetAcccountEmailReceiptsProps extends InfiniteQueryParams {
  accountId: string;
  status?: keyof typeof EmailReceiptStatus;
}

/**
 * @category Queries
 * @group Accounts
 */
export const GetAcccountEmailReceipts = async ({
  accountId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAcccountEmailReceiptsProps): Promise<
  ConnectedXMResponse<EmailReceipt[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/email-receipts`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Accounts
 */
export const useGetAcccountEmailReceipts = (
  accountId: string = "",
  status?: keyof typeof EmailReceiptStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAcccountEmailReceipts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAcccountEmailReceipts>>
  >(
    ACCOUNT_EMAILS_QUERY_KEY(accountId, status),
    (params: InfiniteQueryParams) =>
      GetAcccountEmailReceipts({ accountId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!accountId && (options?.enabled ?? true),
    }
  );
};
