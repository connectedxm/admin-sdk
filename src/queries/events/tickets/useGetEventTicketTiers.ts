import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { Tier } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_TICKET_QUERY_KEY } from "./useGetEventTicket";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TICKET_TIERS_QUERY_KEY = (
  eventId: string,
  ticketId: string
) => [...EVENT_TICKET_QUERY_KEY(eventId, ticketId), "TIERS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TICKET_TIERS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TICKET_TIERS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicketTiers>>
) => {
  client.setQueryData(EVENT_TICKET_TIERS_QUERY_KEY(...keyParams), response);
};

interface GetEventTicketTiersProps extends InfiniteQueryParams {
  eventId: string;
  ticketId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTicketTiers = async ({
  eventId,
  ticketId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventTicketTiersProps): Promise<ConnectedXMResponse<Tier[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/tiers`,
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
 * @group Events
 */
export const useGetEventTicketTiers = (
  eventId: string = "",
  ticketId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventTicketTiers>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTicketTiers>>
  >(
    EVENT_TICKET_TIERS_QUERY_KEY(eventId, ticketId),
    (params: InfiniteQueryParams) =>
      GetEventTicketTiers({
        ...params,
        eventId,
        ticketId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!ticketId && (options.enabled ?? true),
    }
  );
};
