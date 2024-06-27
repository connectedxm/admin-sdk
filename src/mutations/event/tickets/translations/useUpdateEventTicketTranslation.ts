import { GetAdminAPI } from "@src/AdminAPI";
import { EventTicketTranslation } from "@src/interfaces";
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
export interface UpdateEventTicketTranslationParams extends MutationParams {
  eventId: string;
  ticketId: string;
  ticketTranslation: EventTicketTranslation;
}

/**
 * @category Methods
 * @group Event-Tickets-Translations
 */
export const UpdateEventTicketTranslation = async ({
  eventId,
  ticketId,
  ticketTranslation,
  adminApiParams,
  queryClient,
}: UpdateEventTicketTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { locale, ...body } = ticketTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/tickets/${ticketId}/translations/${locale}`,
    body
  );
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
export const useUpdateEventTicketTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventTicketTranslation>>,
      Omit<UpdateEventTicketTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventTicketTranslationParams,
    Awaited<ReturnType<typeof UpdateEventTicketTranslation>>
  >(UpdateEventTicketTranslation, options);
};
