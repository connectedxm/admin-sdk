import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SupportTicketViewer } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SUPPORT_TICKET_QUERY_KEY } from "./useGetSupportTicket";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Support Tickets
 */
export const SUPPORT_TICKET_VIEWER_QUERY_KEY = (
  supportTicketId: string,
  orgMembershipId?: string
) => [
  ...SUPPORT_TICKET_QUERY_KEY(supportTicketId),
  "VIEWER",
  orgMembershipId || "CURRENT",
];

/**
 * @category Setters
 * @group Support Tickets
 */
export const SET_SUPPORT_TICKET_VIEWER_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUPPORT_TICKET_VIEWER_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSupportTicketViewer>>
) => {
  client.setQueryData(SUPPORT_TICKET_VIEWER_QUERY_KEY(...keyParams), response);
};

interface GetSupportTicketViewerProps extends InfiniteQueryParams {
  supportTicketId: string;
  orgMembershipId?: string;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTicketViewer = async ({
  supportTicketId,
  orgMembershipId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSupportTicketViewerProps): Promise<
  ConnectedXMResponse<SupportTicketViewer[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/supportTickets/${supportTicketId}/viewer`,
    {
      params: {
        orgMembershipId: orgMembershipId || undefined,
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
export const useGetSupportTicketViewer = (
  supportTicketId: string = "",
  orgMembershipId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSupportTicketViewer>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTicketViewer>>
  >(
    SUPPORT_TICKET_VIEWER_QUERY_KEY(supportTicketId, orgMembershipId),
    (queryParams: InfiniteQueryParams) =>
      GetSupportTicketViewer({
        supportTicketId,
        orgMembershipId,
        ...queryParams,
      }),
    params,
    {
      ...options,
      enabled: !!supportTicketId && (options?.enabled ?? true),
    }
  );
};
