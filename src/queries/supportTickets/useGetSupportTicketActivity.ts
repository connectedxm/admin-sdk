import {
  useConnectedInfiniteQuery,
  InfiniteQueryOptions,
  InfiniteQueryParams,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse, SupportTicketActivityLog } from "@src/interfaces";
import { SUPPORT_TICKETS_QUERY_KEY } from "./useGetSupportTickets";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Support Tickets
 */
export const SUPPORT_TICKET_ACTIVITY_QUERY_KEY = (supportTicketId: string) => [
  ...SUPPORT_TICKETS_QUERY_KEY(),
  supportTicketId,
  "ACTIVITY_LOGS",
];

/**
 * @category Setters
 * @group Support Tickets
 */
export const SET_SUPPORT_TICKET_ACTIVITY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUPPORT_TICKET_ACTIVITY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSupportTicketActivity>>
) => {
  client.setQueryData(
    SUPPORT_TICKET_ACTIVITY_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSupportTicketActivityProps extends InfiniteQueryParams {
  supportTicketId: string;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTicketActivity = async ({
  supportTicketId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSupportTicketActivityProps): Promise<
  ConnectedXMResponse<SupportTicketActivityLog[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/supportTickets/${supportTicketId}/activityLog`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Support Tickets
 */
export const useGetSupportTicketActivity = (
  supportTicketId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSupportTicketActivity>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTicketActivity>>
  >(
    SUPPORT_TICKET_ACTIVITY_QUERY_KEY(supportTicketId),
    (params: InfiniteQueryParams) =>
      GetSupportTicketActivity({ supportTicketId, ...params }),
    params,
    {
      ...options,
      enabled: !!supportTicketId && (options?.enabled ?? true),
    }
  );
};
