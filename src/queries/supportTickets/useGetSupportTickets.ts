import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SupportTicket } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Support Tickets
 */
export const SUPPORT_TICKETS_QUERY_KEY = (status?: string) => [
  "SUPPORT_TICKETS",
  status,
];

/**
 * @category Setters
 * @group Support Tickets
 */
export const SET_SUPPORT_TICKETS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUPPORT_TICKETS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSupportTickets>>
) => {
  client.setQueryData(SUPPORT_TICKETS_QUERY_KEY(...keyParams), response);
};

interface GetSupportTicketsProps extends InfiniteQueryParams {
  status: string;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTickets = async ({
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSupportTicketsProps): Promise<ConnectedXMResponse<SupportTicket[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/supportTickets`, {
    params: {
      status: status || undefined,
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
 * @group Support Tickets
 */
export const useGetSupportTickets = (
  status: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSupportTickets>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTickets>>
  >(
    SUPPORT_TICKETS_QUERY_KEY(status),
    (params: InfiniteQueryParams) =>
      GetSupportTickets({
        status,
        ...params,
      }),
    params,
    options
  );
};
