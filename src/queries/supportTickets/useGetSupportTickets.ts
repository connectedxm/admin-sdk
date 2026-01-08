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
export const SUPPORT_TICKETS_QUERY_KEY = (
  type?: string,
  state?: string,
  assignedToMe?: boolean
) => ["SUPPORT_TICKETS", type, state, assignedToMe];

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
  type?: string;
  state?: string;
  assignedToMe?: boolean;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTickets = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  type,
  state,
  assignedToMe,
  adminApiParams,
}: GetSupportTicketsProps): Promise<ConnectedXMResponse<SupportTicket[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/supportTickets`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      type: type || undefined,
      state: state || undefined,
      assignedToMe:
        typeof assignedToMe !== "undefined"
          ? assignedToMe
            ? "true"
            : "false"
          : undefined,
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
  type?: string,
  state?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > & {
    assignedToMe?: boolean;
  } = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSupportTickets>>
  > = {}
) => {
  const { assignedToMe, ...restParams } = params;
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTickets>>
  >(
    SUPPORT_TICKETS_QUERY_KEY(type, state, assignedToMe),
    (params: InfiniteQueryParams) =>
      GetSupportTickets({
        type,
        state,
        assignedToMe,
        ...params,
      }),
    restParams,
    options
  );
};
