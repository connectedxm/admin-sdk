import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventTicketTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TICKET_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_TICKET_TRANSLATION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Tickets-Translations
 */
export interface CreateEventTicketTranslationParams extends MutationParams {
  eventId: string;
  ticketId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Event-Tickets-Translations
 */
export const CreateEventTicketTranslation = async ({
  eventId,
  ticketId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateEventTicketTranslationParams): Promise<
  ConnectedXMResponse<EventTicketTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventTicketTranslation>
  >(`/events/${eventId}/tickets/${ticketId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TICKET_TRANSLATIONS_QUERY_KEY(eventId, ticketId),
    });
    SET_EVENT_TICKET_TRANSLATION_QUERY_DATA(
      queryClient,
      [eventId, ticketId, data.data?.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tickets-Translations
 */
export const useCreateEventTicketTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventTicketTranslation>>,
      Omit<CreateEventTicketTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventTicketTranslationParams,
    Awaited<ReturnType<typeof CreateEventTicketTranslation>>
  >(CreateEventTicketTranslation, options);
};
