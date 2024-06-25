import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_TICKET_TRANSLATIONS_QUERY_KEY,
  EVENT_TICKET_TRANSLATION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Tickets-Translations
 */
export interface DeleteEventTicketTranslationParams extends MutationParams {
  eventId: string;
  ticketId: string;
  locale: string;
}

/**
 * @category Methods
 * @group Event-Tickets-Translations
 */
export const DeleteEventTicketTranslation = async ({
  eventId,
  ticketId,
  locale,
  adminApiParams,
  queryClient,
}: DeleteEventTicketTranslationParams) => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.delete(
    `/events/${eventId}/tickets/${ticketId}/translations/${locale}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_TICKET_TRANSLATIONS_QUERY_KEY(eventId, ticketId),
    });
    queryClient.invalidateQueries({
      queryKey: EVENT_TICKET_TRANSLATION_QUERY_KEY(eventId, ticketId, locale),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Tickets-Translations
 */
export const useDeleteEventTicketTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventTicketTranslation>>,
      Omit<DeleteEventTicketTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventTicketTranslationParams,
    Awaited<ReturnType<typeof DeleteEventTicketTranslation>>
  >(DeleteEventTicketTranslation, options);
};
