import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { EVENT_TICKET_TRANSLATION_QUERY_KEY } from "@context/queries/events/tickets/translations/useGetEventTicketTranslation";
import { EVENT_TICKET_TRANSLATIONS_QUERY_KEY } from "@context/queries/events/tickets/translations/useGetEventTicketTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteEventTicketTranslationProps {
  eventId: string;
  ticketId: string;
  locale: string;
}

export const DeleteEventTicketTranslation = async ({
  eventId,
  ticketId,
  locale,
}: DeleteEventTicketTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/events/${eventId}/tickets/${ticketId}/translations/${locale}`
  );

  return data;
};

export const useDeleteEventTicketTranslation = (
  eventId: string,
  ticketId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteEventTicketTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        EVENT_TICKET_TRANSLATIONS_QUERY_KEY(eventId, ticketId)
      );
      queryClient.invalidateQueries(
        EVENT_TICKET_TRANSLATION_QUERY_KEY(eventId, ticketId, locale)
      );
    },
  });
};

export default useDeleteEventTicketTranslation;
