import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventTicketTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_TICKET_QUERY_KEY } from "../useGetEventTicket";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TICKET_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  ticketId: string
) => [...EVENT_TICKET_QUERY_KEY(eventId, ticketId), "TRANSLATIONS"];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_TICKET_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TICKET_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicketTranslations>>
) => {
  client.setQueryData(
    EVENT_TICKET_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventTicketTranslationsProps extends InfiniteQueryParams {
  eventId: string;
  ticketId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTicketTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  ticketId,
  adminApiParams,
}: GetEventTicketTranslationsProps): Promise<
  ConnectedXMResponse<EventTicketTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/translations`,
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
export const useGetEventTicketTranslations = (
  eventId: string = "",
  ticketId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventTicketTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTicketTranslations>>
  >(
    EVENT_TICKET_TRANSLATIONS_QUERY_KEY(eventId, ticketId),
    (params: InfiniteQueryParams) =>
      GetEventTicketTranslations({
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
