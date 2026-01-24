import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { SupportTicketNote } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SUPPORT_TICKET_QUERY_KEY } from "../useGetSupportTicket";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Support Tickets
 */
export const SUPPORT_TICKET_NOTES_QUERY_KEY = (supportTicketId: string) => [
  ...SUPPORT_TICKET_QUERY_KEY(supportTicketId),
  "NOTES",
];

/**
 * @category Setters
 * @group Support Tickets
 */
export const SET_SUPPORT_TICKET_NOTES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SUPPORT_TICKET_NOTES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSupportTicketNotes>>
) => {
  client.setQueryData(SUPPORT_TICKET_NOTES_QUERY_KEY(...keyParams), response);
};

interface GetSupportTicketNotesProps extends InfiniteQueryParams {
  supportTicketId: string;
}

/**
 * @category Queries
 * @group Support Tickets
 */
export const GetSupportTicketNotes = async ({
  supportTicketId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSupportTicketNotesProps): Promise<
  ConnectedXMResponse<SupportTicketNote[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/supportTickets/${supportTicketId}/notes`,
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
export const useGetSupportTicketNotes = (
  supportTicketId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSupportTicketNotes>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSupportTicketNotes>>
  >(
    SUPPORT_TICKET_NOTES_QUERY_KEY(supportTicketId),
    (params: InfiniteQueryParams) =>
      GetSupportTicketNotes({
        supportTicketId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!supportTicketId && (options?.enabled ?? true),
    }
  );
};
