import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { TicketTranslation } from "@src/interfaces";
import { EVENT_TICKET_TRANSLATIONS_QUERY_KEY } from "./useGetEventTicketTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_TICKET_TRANSLATION_QUERY_KEY = (
  eventId: string,
  ticketId: string,
  locale: string
) => [...EVENT_TICKET_TRANSLATIONS_QUERY_KEY(eventId, ticketId), locale];

/**
 * @category Setters
 * @group Events
 */
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

interface GetEventTicketTranslationProps extends SingleQueryParams {
  eventId: string;
  ticketId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventTicketTranslation = async ({
  eventId,
  ticketId,
  locale,
  adminApiParams,
}: GetEventTicketTranslationProps): Promise<
  ConnectedXMResponse<TicketTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/tickets/${ticketId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventTicketTranslation = (
  eventId: string = "",
  ticketId: string = "",
  locale: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventTicketTranslation>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventTicketTranslation>>(
    EVENT_TICKET_TRANSLATION_QUERY_KEY(eventId, ticketId, locale),
    (params) =>
      GetEventTicketTranslation({
        ...params,
        eventId,
        ticketId,
        locale,
      }),
    {
      ...options,
      enabled: !!eventId && !!ticketId && !!locale,
    }
  );
};
