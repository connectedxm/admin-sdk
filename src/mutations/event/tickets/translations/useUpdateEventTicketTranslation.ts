import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_EVENT_TICKET_TRANSLATION_QUERY_DATA } from "@context/queries/events/tickets/translations/useGetEventTicketTranslation";
import {
  EVENT_TICKET_TRANSLATIONS_QUERY_KEY,
  SET_EVENT_TICKET_TRANSLATIONS_QUERY_DATA,
} from "@context/queries/events/tickets/translations/useGetEventTicketTranslations";
import { TicketTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateEventTicketTranslationProps {
  eventId: string;
  ticketId: string;
  ticketTranslation: TicketTranslation;
}

export const UpdateEventTicketTranslation = async ({
  eventId,
  ticketId,
  ticketTranslation,
}: UpdateEventTicketTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = ticketTranslation;

  const { data } = await connectedXM.put(
    `/events/${eventId}/tickets/${ticketId}/translations/${ticketTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateEventTicketTranslation = (
  eventId: string,
  ticketId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<TicketTranslation>(
    (ticketTranslation: TicketTranslation) =>
      UpdateEventTicketTranslation({
        eventId,
        ticketId,
        ticketTranslation,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventTicketTranslation>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_TICKET_TRANSLATIONS_QUERY_KEY(eventId, ticketId)
        );
        SET_EVENT_TICKET_TRANSLATION_QUERY_DATA(
          queryClient,
          [eventId, ticketId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateEventTicketTranslation;
