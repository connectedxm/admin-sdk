import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, EmailReceipt } from "@src/interfaces";
import { EmailReceiptStatus } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve a list of email receipts with optional filtering by status.
 * This function allows users to fetch email receipt records, which can be filtered by their status if desired.
 * It is designed to be used in applications where tracking and managing email receipts is necessary.
 * @name GetEmailReceipts
 * @param {string} [status] (query) Optional status to filter email receipts
 * @version 1.3
 **/

export const EMAIL_RECEIPTS_QUERY_KEY = (status?: string) => [
  "EMAIL_RECEIPTS",
  status || "all",
];

export const SET_EMAIL_RECEIPTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EMAIL_RECEIPTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEmailReceipts>>
) => {
  client.setQueryData(EMAIL_RECEIPTS_QUERY_KEY(...keyParams), response);
};

interface GetEmailReceiptsParams extends InfiniteQueryParams {
  status?: EmailReceiptStatus;
}

export const GetEmailReceipts = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  adminApiParams,
}: GetEmailReceiptsParams): Promise<ConnectedXMResponse<EmailReceipt[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/email-receipts`, {
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

export const useGetEmailReceipts = (
  status?: EmailReceiptStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEmailReceipts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEmailReceipts>>
  >(
    EMAIL_RECEIPTS_QUERY_KEY(status),
    (params: InfiniteQueryParams) => GetEmailReceipts({ ...params, status }),
    params,
    options,
    "org"
  );
};
