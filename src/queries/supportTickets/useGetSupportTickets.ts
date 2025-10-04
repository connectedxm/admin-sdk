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
export const SUPPORT_TICKETS_QUERY_KEY = (state?: string, type?: string) => [
  "SUPPORT_TICKETS",
  type,
  state,
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
  state: string;
  type: string;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTickets = async ({
  type,
  state,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSupportTicketsProps): Promise<ConnectedXMResponse<SupportTicket[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/supportTickets`, {
    params: {
      state: state || undefined,
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      type: type || undefined,
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
  type: string,
  state: string = "",
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
    SUPPORT_TICKETS_QUERY_KEY(state, type),
    (params: InfiniteQueryParams) =>
      GetSupportTickets({
        type,
        state,
        ...params,
      }),
    params,
    options
  );
};
