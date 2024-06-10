import { SingleQueryOptions, SingleQueryParams, useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { TicketTranslation } from "@src/interfaces";
import { EVENT_TICKET_TRANSLATIONS_QUERY_KEY } from "./useGetEventTicketTranslations";

export const EVENT_TICKET_TRANSLATION_QUERY_KEY = (
  eventId: string,
  ticketId: string,
  locale: string
) => [...EVENT_TICKET_TRANSLATIONS_QUERY_KEY(eventId, ticketId), locale];

export const SET_EVENT_TICKET_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_TICKET_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventTicketTranslation>>
) => {
  client.setQueryData(
    EVENT_TICKET_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventTicketTranslationProps {
  eventId: string;
  ticketId: string;
  locale: string;
}

export const GetEventTicketTranslation = async ({
  eventId,
  ticketId,
  locale,
}: GetEventTicketTranslationProps): Promise<
  ConnectedXMResponse<TicketTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/translations/${locale}`
  );
  return data;
};

const useGetEventTicketTranslation = (
  eventId: string,
  ticketId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTicketTranslation>>((
    EVENT_TICKET_TRANSLATION_QUERY_KEY(eventId, ticketId, locale),
    () =>
      GetEventTicketTranslation({
        eventId,
        ticketId,
        locale,
      }),
    {
      enabled: !!eventId && !!ticketId && !!locale,
    }
  );
};

export default useGetEventTicketTranslation;
