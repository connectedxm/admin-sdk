import { GetAdminAPI } from "@src/AdminAPI";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, BaseAPILog } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Key
 * @group Emails
 */
export const API_LOGS_QUERY_KEY = (
  startDate: string = "",
  endDate: string = "",
  method?: string,
  status?: "success" | "failed",
  source?: string,
  userId?: string,
  accountId?: string
) => {
  const keys = ["API_LOGS", startDate, endDate];
  if (method) keys.push(method);
  if (status) keys.push(status.toString());
  if (source) keys.push(source);
  if (userId) keys.push(userId);
  if (accountId) keys.push(accountId);
  return keys;
};

/**
 * @category Setters
 * @group Emails
 */
export const SET_API_LOGS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof API_LOGS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAPILogs>>
) => {
  client.setQueryData(API_LOGS_QUERY_KEY(...keyParams), response);
};

interface GetAPILogsParams extends InfiniteQueryParams {
  startDate: string;
  endDate: string;
  method?: string;
  status?: "success" | "failed";
  source?: string;
  userId?: string;
  accountId?: string;
}

/**
 * @category Query
 * @group Emails
 */
export const GetAPILogs = async ({
  startDate,
  endDate,
  method,
  status,
  source,
  userId,
  accountId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAPILogsParams): Promise<ConnectedXMResponse<BaseAPILog[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/logs/api`, {
    params: {
      startDate,
      endDate,
      method: method || undefined,
      status: status || undefined,
      source: source || undefined,
      userId: userId || undefined,
      accountId: accountId || undefined,
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
 * @group Emails
 */
export const useGetAPILogs = (
  startDate: string,
  endDate: string,
  method?: string,
  status?: "success" | "failed",
  source?: string,
  userId?: string,
  accountId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetAPILogs>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetAPILogs>>>(
    API_LOGS_QUERY_KEY(
      startDate,
      endDate,
      method,
      status,
      source,
      userId,
      accountId
    ),
    (params: InfiniteQueryParams) =>
      GetAPILogs({
        ...params,
        startDate,
        endDate,
        method,
        status,
        source,
        userId,
        accountId,
      }),
    params,
    options,
    "org"
  );
};
