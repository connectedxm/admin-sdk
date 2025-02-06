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
 * Endpoint to retrieve a list of email receipts associated with a specific account.
 * This function allows users to fetch email receipt data for an account, with optional filtering by receipt status.
 * It is designed to be used in applications where tracking email communications for an account is necessary.
 * @name GetAccountEmailReceipts
 * @param {string} accountId (path) The id of the account
 * @param {keyof typeof EmailReceiptStatus} [status] (query) Optional filtering by email receipt status
 * @version 1.3
 **/

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
    },
    "accounts"
  );
};
