import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { TicketTranslation } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_TICKET_QUERY_KEY } from "../useGetEventTicket";

export const EVENT_TICKET_TRANSLATIONS_QUERY_KEY = (
  eventId: string,
  ticketId: string
) => [...EVENT_TICKET_QUERY_KEY(eventId, ticketId), "TRANSLATIONS"];

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

export const GetEventTicketTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  eventId,
  ticketId,
}: GetEventTicketTranslationsProps): Promise<
  ConnectedXMResponse<TicketTranslation[]>
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

const useGetEventTicketTranslations = (eventId: string, ticketId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventTicketTranslations>>
  >(
    EVENT_TICKET_TRANSLATIONS_QUERY_KEY(eventId, ticketId),
    (params: any) => GetEventTicketTranslations(params),
    {
      eventId,
      ticketId,
    },
    {
      enabled: !!eventId && !!ticketId,
    }
  );
};

export default useGetEventTicketTranslations;
