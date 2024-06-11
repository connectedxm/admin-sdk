import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { BaseEmailReceipt, EmailReceiptStatus } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

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
}: GetEmailReceiptsParams): Promise<
  ConnectedXMResponse<BaseEmailReceipt[]>
> => {
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
    options
  );
};
